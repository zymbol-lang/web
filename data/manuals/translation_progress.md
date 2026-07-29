# Translation Progress — Zymbol-Lang v0.0.5

**Referencia base:** `v005/manual_en.md` · **Validador:** `python3 web/data/v005/manual_compare.py manual_XX.md`

## Reglas de ejecución críticas
- NO lanzar agentes en background ni subagentes paralelos
- Trabajar un archivo a la vez — completar y verificar antes de continuar
- Ejecutar el validador directamente en la sesión actual
- Reportar resultado y esperar confirmación antes del siguiente idioma

## Reglas de traducción
1. Misma estructura exacta que `v005/manual_en.md` (24 H2, 11 H3, bloques de código con igual número de líneas)
2. Traducir TODO: texto, ejemplos, strings, variables, comentarios, nombres de tipo
3. Idiomas con sistema numérico propio → traducir los números en la sección Modos Numéricos
4. Disclaimer al INICIO en dos idiomas: idioma del manual + inglés (patrón: `manual_es.md` líneas 1–5)
5. Match arms usan `=>` (no `:`); imports/exports usan `=>` (no `<=`)

## Flujo de trabajo por idioma
```
1. Borrar el archivo existente si lo hay: rm web/data/v005/manual_XX.md
2. Leer v005/manual_en.md (contenido a traducir)
3. Leer v005/manual_es.md líneas 1-5 (patrón del disclaimer bilingüe)
4. Crear el archivo nuevo en web/data/v005/ traduciendo TODO:
   - Disclaimer al INICIO: idioma destino + inglés
   - Texto narrativo → traducido
   - Strings en código → equivalente en idioma
   - Comentarios → traducidos
   - Nombres de variable → equivalentes en idioma
   - Nombres de tipo en tabla → traducidos si aplica
   - Números en sección Modos Numéricos → si el idioma tiene sistema propio
5. python3 web/data/v005/manual_compare.py web/data/v005/manual_XX.md
6. Corregir si hay errores (DIFF o MISMATCH)
7. Reportar resultado → esperar confirmación
```

---

## Estado actual

✅ = listo (110/110) · ⚠️ = parcial · ❌ = pendiente

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_en.md | English (reference) |
| ✅ | manual_es.md | Español (reference) |

---

## Lote 1 — Románicas + Caribe (9)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_fr.md | Français |
| ✅ | manual_it.md | Italiano |
| ✅ | manual_pt.md | Português (BR) |
| ✅ | manual_pt_eu.md | Português (PT-EU) |
| ✅ | manual_ca.md | Català |
| ✅ | manual_gl.md | Galego |
| ✅ | manual_ro.md | Română |
| ✅ | manual_ht.md | Kreyòl ayisyen |
| ✅ | manual_jam.md | Jamaican Patois |

## Lote 2 — Germánicas (6)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_de.md | Deutsch |
| ✅ | manual_da.md | Dansk |
| ✅ | manual_is.md | Íslenska |
| ✅ | manual_nl.md | Nederlands |
| ✅ | manual_no.md | Norsk |
| ✅ | manual_sv.md | Svenska |

## Lote 3 — Eslavas (11)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_be.md | Беларуская |
| ✅ | manual_bg.md | Български |
| ✅ | manual_cs.md | Čeština |
| ✅ | manual_hr.md | Hrvatski |
| ✅ | manual_mk.md | Македонски |
| ✅ | manual_pl.md | Polski |
| ✅ | manual_ru.md | Русский |
| ✅ | manual_sk.md | Slovenčina |
| ✅ | manual_sl.md | Slovenščina |
| ✅ | manual_sr.md | Српски |
| ✅ | manual_uk.md | Українська |

## Lote 4 — Bálticas + Finesas (5)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_et.md | Eesti |
| ✅ | manual_fi.md | Suomi |
| ✅ | manual_lv.md | Latviešu |
| ✅ | manual_lt.md | Lietuvių |
| ✅ | manual_eu.md | Euskara |

## Lote 5 — Mediterráneas + Caucásicas (6)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_el.md | Ελληνικά |
| ✅ | manual_sq.md | Shqip |
| ✅ | manual_az.md | Azərbaycanca |
| ✅ | manual_hy.md | Հայերեն |
| ✅ | manual_ka.md | ქართული |
| ✅ | manual_tr.md | Türkçe |

## Lote 6 — Semíticas + Iranias (8)

| Estado | Archivo | Idioma | Nota |
|--------|---------|--------|------|
| ✅ | manual_am.md | አማርኛ | |
| ✅ | manual_ar.md | العربية | ★ numerales árabes ✔️ |
| ✅ | manual_fa.md | فارسی | ★ numerales árabes-persas ✔️ |
| ✅ | manual_he.md | עברית | |
| ✅ | manual_ti.md | ትግርኛ | |
| ✅ | manual_ur.md | اردو | ★ numerales árabes-persas ✔️ |
| ✅ | manual_ku.md | Kurdî | |
| ✅ | manual_ps.md | پښتو | ★ numerales árabes-persas ✔️ |

## Lote 7 — Sur de Asia — Índicas (11)

| Estado | Archivo | Idioma | Nota |
|--------|---------|--------|------|
| ✅ | manual_bn.md | বাংলা | ★ numerales bengalíes ✔️ |
| ✅ | manual_gu.md | ગુજરાતી | ★ numerales gujarati ✔️ |
| ✅ | manual_hi.md | हिन्दी | ★ numerales Devanagari ✔️ |
| ✅ | manual_kn.md | ಕನ್ನಡ | ★ numerales kannada ✔️ |
| ✅ | manual_ml.md | മലയാളം | ★ numerales malayalam ✔️ |
| ✅ | manual_mr.md | मराठी | ★ numerales Devanagari ✔️ |
| ✅ | manual_ne.md | नेपाली | ★ numerales Devanagari ✔️ |
| ✅ | manual_pa.md | ਪੰਜਾਬੀ | ★ numerales gurmukhi ✔️ |
| ✅ | manual_si.md | සිංහල | ★ numerales sinhala ✔️ |
| ✅ | manual_ta.md | தமிழ் | ★ numerales tamil ✔️ |
| ✅ | manual_te.md | తెలుగు | ★ numerales telugu ✔️ |

## Lote 8 — Este y Sureste de Asia (13)

| Estado | Archivo | Idioma | Nota |
|--------|---------|--------|------|
| ✅ | manual_zh.md | 中文 | |
| ✅ | manual_ja.md | 日本語 | |
| ✅ | manual_ko.md | 한국어 | |
| ✅ | manual_vi.md | Tiếng Việt | |
| ✅ | manual_th.md | ภาษาไทย | ★ numerales Thai ✔️ |
| ✅ | manual_my.md | မြန်မာဘာသာ | ★ numerales Myanmar ✔️ |
| ✅ | manual_id.md | Bahasa Indonesia | |
| ✅ | manual_ms.md | Bahasa Melayu | |
| ✅ | manual_tl.md | Filipino / Tagalog | |
| ✅ | manual_jv.md | Basa Jawa | |
| ✅ | manual_su.md | Basa Sunda | |
| ✅ | manual_km.md | ភាសាខ្មែរ | ★ numerales Khmer ✔️ |
| ✅ | manual_lo.md | ພາສາລາວ | ★ numerales Lao ✔️ |

## Lote 9 — África Subsahariana (18)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_ha.md | Hausa |
| ✅ | manual_yo.md | Yorùbá |
| ✅ | manual_ig.md | Igbo |
| ✅ | manual_sw.md | Kiswahili |
| ✅ | manual_af.md | Afrikaans |
| ✅ | manual_bm.md | Bamanankan |
| ✅ | manual_ff.md | Fulfulde |
| ✅ | manual_ln.md | Lingála |
| ✅ | manual_om.md | Oromoo |
| ✅ | manual_sn.md | chiShona |
| ✅ | manual_so.md | Soomaali |
| ✅ | manual_wo.md | Wolof |
| ✅ | manual_xh.md | isiXhosa |
| ✅ | manual_zu.md | isiZulu |
| ✅ | manual_lg.md | Luganda |
| ✅ | manual_ny.md | Chichewa |
| ✅ | manual_tn.md | Setswana |
| ✅ | manual_pcm.md | Nigerian Pidgin |

## Lote 10 — Indígenas Américas (11)

| Estado | Archivo | Idioma | Nota |
|--------|---------|--------|------|
| ✅ | manual_qu.md | Quechua | |
| ✅ | manual_ay.md | Aymara | |
| ✅ | manual_gn.md | Guaraní | |
| ✅ | manual_nah.md | Nāhuatl | |
| ✅ | manual_nav.md | Diné Bizaad | |
| ✅ | manual_nv.md | Navajo | |
| ✅ | manual_arn.md | Mapudungun | |
| ✅ | manual_chr.md | ᏣᎳᎩ Cherokee | ★ sílabas Cherokee |
| ✅ | manual_quc.md | K'iche' | |
| ✅ | manual_cr_syl.md | Cree (Syllabics) | ★ silabario |
| ✅ | manual_myn.md | Maya numerals | ★ numerales mayas ✔️ |

## Lote 11 — Auxiliares / Construidas (5)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_eo.md | Esperanto |
| ✅ | manual_ia.md | Interlingua |
| ✅ | manual_io.md | Ido |
| ✅ | manual_jbo.md | Lojban |
| ✅ | manual_tp.md | Toki Pona |

## Lote 12 — Scripts especiales / Conlangs (5)

| Estado | Archivo | Idioma | Nota |
|--------|---------|--------|------|
| ✅ | manual_emb.md | Emoji-based | ★ solo emojis |
| ✅ | manual_tlh.md | Klingon Hol (Latin) | |
| ✅ | manual_thl_iq.md | Klingon pIqaD | ★ chars pIqaD & ★ numerales pIqaD ✔️ |
| ✅ | manual_way.md | Warlpiri | ★ indígena Australia ✔️ |
| ✅ | manual_yno.md | Yiddish | ★ script hebreo |

---

**Total pendientes:** 0 · **Completados:** 110 (en, es, fr, it, pt, pt_eu, ca, gl, ro, de, da, is, nl, no, sv, be, bg, cs, hr, mk, pl, ru, sk, sl, sr, uk, et, fi, lv, lt, eu, el, sq, az, hy, ka, tr, am, ar, fa, he, ti, ur, ku, ps, bn, gu, hi, kn, ml, mr, ne, pa, si, ta, te, zh, ja, ko, vi, th, my, id, ms, tl, ha, yo, ig, sw, af, bm, ff, ln, om, sn, so, wo, xh, zu, qu, ay, gn, nah, nav, nv, arn, eo, ia, io, jbo, tp, chr, emb, tlh, thl_iq, jam, ht, jv, su, km, lo, lg, ny, tn, pcm, quc, cr_syl, myn, way, yno) · **Referencias:** 2

---

## Futuras inclusiones — 🟡 Media prioridad

No pendientes actualmente. Evaluar para lotes futuros.

| Código | Idioma | Hablantes | Nota |
|--------|--------|-----------|------|
| `mt` | Maltés | ~0.5M | único idioma semítico oficial UE |
| `lb` | Luxemburgués | ~0.4M | UE |
| `fo` | Feroés | ~0.07M | Islas Feroe |
| `kek` | Q'eqchi' | ~0.8M | Guatemala, Maya |
| `mam` | Mam | ~0.6M | Guatemala/México, Maya |
| `tzh` | Tzeltal | ~0.6M | México, Maya |
| `tzz` | Tzotzil | ~0.55M | México, Maya |
| `oj` | Ojibwe | ~0.06M | Canadá/EE.UU., cultural |

## Futuras inclusiones — 🟢 Baja prioridad

| Código | Idioma | Nota |
|--------|--------|------|
| `dv` | Divehi | ★ script Thaana, Maldivas |
| `dz` | Dzongkha | ★ script Tibetano, Bután |
| `gd` | Gaélico escocés | Reino Unido |
| `gv` | Manés | Isla de Man |
| `kw` | Córnico | Cornualles |
| `sco` | Escocés | Escocia |
| `lfn` | Lingua Franca Nova | auxiliar |
| `nov` | Novial | auxiliar |
| `chy` | Cheyenne | EE.UU. |
| `lkt` | Lakota | EE.UU. |
| `moh` | Mohawk | Canadá/EE.UU. |
| `nhe` | Nheengatu | Amazonía |
