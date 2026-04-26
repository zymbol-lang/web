# Translation Progress — Zymbol-Lang v0.0.4

**Referencia base:** `manual_en.md` · **Validador:** `python3 manual_compare.py manual_es.md`

## Reglas de ejecución críticas
- NO lanzar agentes en background ni subagentes paralelos
- Trabajar un archivo a la vez — completar y verificar antes de continuar
- Ejecutar `check_manual.sh` directamente en la sesión actual
- Reportar resultado y esperar confirmación antes del siguiente idioma

## Reglas de traducción
1. Misma estructura exacta que `manual_en.md` (23 H2, 10 H3, 57 filas tabla, 29 bullets, 6 versiones)
2. Traducir TODO: texto, ejemplos, strings, variables, comentarios, nombres de tipo
3. Idiomas con sistema numérico propio → traducir los números en la sección Numeral Modes
4. Disclaimer al INICIO en dos idiomas: idioma del manual + inglés (patrón: `manual_es.md` líneas 1–5)

## Flujo de trabajo por idioma
```
1. Lee manual_en.md
2. Lee manual_es.md líneas 1-7 (referencia disclaimer bilingüe)
3. Traduce y escribe el archivo
4. python3 manual_compare.py manual_XX.md
5. Corregir si hay errores
6. Reportar resultado → esperar confirmación
```

---

## Estado actual

✅ = listo (20/20) · ⚠️ = parcial · ❌ = pendiente

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_en.md | English (reference) |
| ✅ | manual_es.md | Español (reference) |

---

## Lote 1 — Romances (3)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_fr.md | Français |
| ✅ | manual_de.md | Deutsch |
| ✅ | manual_it.md | Italiano |
| ✅ | manual_pt.md | Português (BR) |
| ✅ | manual_ca.md | Català |
| ✅ | manual_gl.md | Galego |
| ✅ | manual_ro.md | Română |

## Lote 2 — Germánicas (5)

| Estado | Archivo | Idioma |
|--------|---------|--------|
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
| ✅ | manual_eu.md | Euskara |
| ✅ | manual_fi.md | Suomi |
| ✅ | manual_lv.md | Latviešu |
| ✅ | manual_lt.md | Lietuvių |

## Lote 5 — Griego, Turco, Caucásicas (5)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_az.md | Azərbaycanca |
| ✅ | manual_el.md | Ελληνικά |
| ✅ | manual_hy.md | Հայերեն |
| ✅ | manual_ka.md | ქართული |
| ✅ | manual_tr.md | Türkçe |

## Lote 6 — Semíticas + Persa (7)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_am.md | አማርኛ |
| ✅ | manual_ar.md | العربية  ★ numerales árabes ✔️ |
| ✅ | manual_fa.md | فارسی  ★ numerales árabes-persas ✔️ |
| ✅ | manual_he.md | עברית |
| ✅ | manual_ti.md | ትግርኛ |
| ✅ | manual_ur.md | اردو |
| ✅ | manual_ku.md | Kurdî |

## Lote 7 — Sur de Asia — Índicas (11)

| Estado | Archivo | Idioma | Nota |
|--------|---------|--------|------|
| ✅ | manual_bn.md | বাংলা | ★ numerales bengalíes ✔️ |
| ✅ | manual_gu.md | ગુજરાતી | ★ numerales gujarati ✔️ |
| ✅ | manual_hi.md | हिन्दी | ★ Devanagari ✔️ |
| ✅ | manual_kn.md | ಕನ್ನಡ | ★ numerales kannada ✔️ |
| ✅ | manual_ml.md | മലയാളം | ★ numerales malayalam ✔️ |
| ✅ | manual_mr.md | मराठी | ★ Devanagari ✔️ |
| ✅ | manual_ne.md | नेपाली | ★ Devanagari ✔️ |
| ✅ | manual_pa.md | ਪੰਜਾਬੀ | ★ numerales gurmukhi ✔️ |
| ✅ | manual_si.md | සිංහල | ★ numerales sinhala ✔️ |
| ✅ | manual_ta.md | தமிழ் | ★ numerales tamil ✔️ |
| ✅ | manual_te.md | తెలుగు | ★ numerales telugu ✔️ |

## Lote 8 — Este y Sureste de Asia (8)

| Estado | Archivo | Idioma | Nota |
|--------|---------|--------|------|
| ❌ | manual_id.md | Bahasa Indonesia | |
| ❌ | manual_ja.md | 日本語 | |
| ❌ | manual_ko.md | 한국어 | |
| ❌ | manual_ms.md | Bahasa Melayu | |
| ❌ | manual_my.md | မြန်မာဘာသာ | ★ Myanmar |
| ❌ | manual_th.md | ภาษาไทย | ★ Thai |
| ❌ | manual_vi.md | Tiếng Việt | |
| ✅ | manual_zh.md | 中文 | |

## Lote 9 — Africanas (14)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ❌ | manual_af.md | Afrikaans |
| ❌ | manual_bm.md | Bamanankan |
| ❌ | manual_ff.md | Fulfulde |
| ❌ | manual_ha.md | Hausa |
| ❌ | manual_ig.md | Igbo |
| ❌ | manual_ln.md | Lingála |
| ❌ | manual_om.md | Oromoo |
| ❌ | manual_sn.md | chiShona |
| ❌ | manual_so.md | Soomaali |
| ❌ | manual_sq.md | Shqip |
| ❌ | manual_sw.md | Kiswahili |
| ❌ | manual_wo.md | Wolof |
| ❌ | manual_xh.md | isiXhosa |
| ❌ | manual_yo.md | Yorùbá |
| ❌ | manual_zu.md | isiZulu |

## Lote 10 — Indígenas Américas (7)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ❌ | manual_arn.md | Mapudungun |
| ❌ | manual_ay.md | Aymara |
| ❌ | manual_gn.md | Guaraní |
| ❌ | manual_nah.md | Nāhuatl |
| ❌ | manual_nav.md | Diné Bizaad |
| ❌ | manual_nv.md | Navajo |
| ❌ | manual_qu.md | Quechua |

## Lote 11 — Auxiliares / Construidas (7)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ❌ | manual_eo.md | Esperanto |
| ❌ | manual_ia.md | Interlingua |
| ❌ | manual_io.md | Ido |
| ❌ | manual_jbo.md | Lojban |
| ❌ | manual_qya.md | Quenya |
| ❌ | manual_sjn.md | Sindarin |
| ❌ | manual_tp.md | Toki Pona |

## Lote 12 — Scripts especiales / Conlangs visuales (12)

| Estado | Archivo | Idioma | Nota |
|--------|---------|--------|------|
| ❌ | manual_chr.md | ᏣᎳᎩ Cherokee | ★ sílabas Cherokee |
| ❌ | manual_cr.md | Cree (Latin) | |
| ❌ | manual_cr_syl.md | Cree (Syllabics) | ★ silabario |
| ❌ | manual_cy.md | Cymraeg | |
| ❌ | manual_doth.md | Dothraki | |
| ❌ | manual_emb.md | Emoji-based | ★ solo emojis |
| ❌ | manual_hval.md | High Valyrian | |
| ❌ | manual_mando.md | Mando'a | |
| ❌ | manual_myn.md | Maya numerals | ★ numerales mayas |
| ❌ | manual_tlh.md | Klingon (Latin) | |
| ❌ | manual_tlh_iq.md | Klingon (pIqaD) | ★ chars pIqaD reales |
| ❌ | manual_way.md | Warlpiri | |
| ❌ | manual_yno.md | Yiddish | |

## Lote 13 — Europeo regional (2)

| Estado | Archivo | Idioma |
|--------|---------|--------|
| ✅ | manual_pt_eu.md | Português (PT-EU) |
| ✅ | manual_tl.md | Filipino / Tagalog |

---

**Total pendientes:** 87 · **Completados:** 22 (fr, de, it, pt, ca, gl, ro, pt_eu, tl, da, is, nl, no, sv, be, bg, cs) · **Referencias:** 2 (en, es)
