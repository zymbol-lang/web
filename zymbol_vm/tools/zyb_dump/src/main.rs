// SPDX-License-Identifier: AGPL-3.0-only
//! `zyb_dump FILE.zy [-o OUT.json]` — the CompiledProgram that `zymbol run`
//! would execute for FILE.zy, as JSON.
//!
//! The steps are `zymbol run`'s VM path (`zymbol-cli/src/main.rs`,
//! `run_program`) minus the semantic checks, which refuse programs but never
//! change the bytecode of one they accept: read, lex with file id 0, parse,
//! `Compiler::compile_named` with the file's directory and the name the CLI
//! would display. A program this compiles and `zymbol run` refuses is not one
//! to compare engines on.
//!
//! Exit status: 0 written, 1 the program does not lex, parse or compile
//! (the reason on stderr), 2 a usage or I/O error, 3 a module file.

use std::path::Path;
use zymbol_compiler::Compiler;
use zymbol_lexer::Lexer;
use zymbol_parser::Parser;
use zymbol_span::FileId;

fn main() {
    let args: Vec<String> = std::env::args().skip(1).collect();
    let mut input = None;
    let mut output = None;
    let mut i = 0;
    while i < args.len() {
        match args[i].as_str() {
            "-o" => {
                i += 1;
                output = args.get(i).cloned();
            }
            a if input.is_none() => input = Some(a.to_string()),
            _ => usage(),
        }
        i += 1;
    }
    let Some(input) = input else { usage() };
    let path = Path::new(&input);

    let source = match std::fs::read_to_string(path) {
        Ok(s) => s,
        Err(e) => {
            eprintln!("zyb_dump: cannot read {}: {}", path.display(), e);
            std::process::exit(2);
        }
    };

    // The name `zymbol run` displays: relative to the working directory when
    // the path is under it, the path as written otherwise.
    let display_name = std::env::current_dir()
        .ok()
        .and_then(|cwd| path.strip_prefix(&cwd).ok().map(|p| p.to_string_lossy().into_owned()))
        .unwrap_or_else(|| path.display().to_string());

    let (tokens, lex_diagnostics) = Lexer::new(&source, FileId(0)).tokenize();
    if let Some(d) = lex_diagnostics.first() {
        eprintln!("zyb_dump: lex error: {}", d.message);
        std::process::exit(1);
    }
    let program = match Parser::new(tokens).parse() {
        Ok(p) => p,
        Err(diagnostics) => {
            let first = diagnostics.first().map(|d| d.message.clone()).unwrap_or_default();
            eprintln!("zyb_dump: parse error: {}", first);
            std::process::exit(1);
        }
    };
    // `zymbol run` refuses a module file before compiling it, and so does this.
    if program.module_decl.is_some() {
        eprintln!("zyb_dump: '{}' is a module file and cannot be run directly", display_name);
        std::process::exit(3);
    }
    let compiled = match Compiler::compile_named(&program, path.parent(), Some(&display_name)) {
        Ok(c) => c,
        Err(e) => {
            eprintln!("zyb_dump: compile error: {}", e);
            std::process::exit(1);
        }
    };

    let mut value = match serde_json::to_value(&compiled) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("zyb_dump: cannot serialize: {}", e);
            std::process::exit(2);
        }
    };
    spell_non_finite(&compiled, &mut value);
    let json = value.to_string();
    match output {
        Some(out) => {
            if let Err(e) = std::fs::write(&out, json) {
                eprintln!("zyb_dump: cannot write {}: {}", out, e);
                std::process::exit(2);
            }
        }
        None => println!("{}", json),
    }
}

/// JSON has no infinity and no NaN, and serde_json writes all three as `null`,
/// which loses which one it was. Every float the bytecode can hold —
/// `LoadFloat`'s operand and a `GlobalInit::Float` — is put back as the string
/// Rust's `{}` spells it: "inf", "-inf", "NaN". The reader takes those three.
fn spell_non_finite(p: &zymbol_bytecode::CompiledProgram, v: &mut serde_json::Value) {
    use zymbol_bytecode::{GlobalInit, Instruction};
    fn spell(f: f64) -> serde_json::Value {
        serde_json::Value::String(f.to_string())
    }
    fn chunk(c: &zymbol_bytecode::Chunk, v: &mut serde_json::Value) {
        for (i, ins) in c.instructions.iter().enumerate() {
            if let Instruction::LoadFloat(_, f) = ins {
                if !f.is_finite() {
                    v["instructions"][i]["LoadFloat"][1] = spell(*f);
                }
            }
        }
    }
    fn init(g: &GlobalInit, v: &mut serde_json::Value) {
        match g {
            GlobalInit::Float(f) if !f.is_finite() => v["Float"] = spell(*f),
            GlobalInit::Array(items) | GlobalInit::Tuple(items) => {
                let key = if matches!(g, GlobalInit::Array(_)) { "Array" } else { "Tuple" };
                for (i, x) in items.iter().enumerate() {
                    init(x, &mut v[key][i]);
                }
            }
            GlobalInit::Dict(fields) => {
                for (i, (_, x)) in fields.iter().enumerate() {
                    init(x, &mut v["Dict"][i][1]);
                }
            }
            _ => {}
        }
    }
    chunk(&p.main, &mut v["main"]);
    for (i, c) in p.functions.iter().enumerate() {
        chunk(c, &mut v["functions"][i]);
    }
    for (i, g) in p.global_var_inits.iter().enumerate() {
        init(g, &mut v["global_var_inits"][i]);
    }
}

fn usage() -> ! {
    eprintln!("usage: zyb_dump FILE.zy [-o OUT.json]");
    std::process::exit(2);
}
