  Plan de incorporación gradual — 15 idiomas en 5 fases

  ---
  Por qué gradual

  Cada idioma requiere 3 artefactos:
  1. Entrada en languages.json — tokens FizzBuzz + constructs del showcase
  2. Entrada completa en i18n.json — ~50 campos de UI traducidos
  3. Manual manual_XX.md — ~430 líneas

  Para idiomas con documentación limitada online (Navajo, Yanomami, Embera) el riesgo
  de errores de traducción es mayor — mejor hacerlos en tandas pequeñas y verificables.

  ---
  Fase 1 — Américas Norte (3 idiomas) sprint inmediato

  ┌───────────────┬────────┬───────────────┐
  │    Idioma     │ Código │   Subgrupo    │
  ├───────────────┼────────┼───────────────┤
  │ Navajo / Diné │ nv     │ north_america │
  ├───────────────┼────────┼───────────────┤
  │ Cherokee      │ chr    │ north_america │
  ├───────────────┼────────┼───────────────┤
  │ Cree          │ cr     │ north_america │
  └───────────────┴────────┴───────────────┘

  ▎ Culturalmente relevantes, completan la representación indígena de EE.UU./Canadá.

  ---
  Fase 2 — Américas Sur (4 idiomas)

  ┌──────────┬────────┬───────────────┐
  │  Idioma  │ Código │   Subgrupo    │
  ├──────────┼────────┼───────────────┤
  │ Aymara   │ ay     │ south_america │
  ├──────────┼────────┼───────────────┤
  │ Wayuu    │ way    │ south_america │
  ├──────────┼────────┼───────────────┤
  │ Embera   │ emb    │ south_america │
  ├──────────┼────────┼───────────────┤
  │ Yanomami │ yno    │ south_america │
  └──────────┴────────┴───────────────┘

  ▎ Aymara primero (~2M hablantes), luego los tres colombo-venezolanos.

  ---
  Fase 3 — África Oriental (2 idiomas)

  ┌─────────┬────────┬─────────────┬────────────────────────────┐
  │ Idioma  │ Código │  Subgrupo   │           Estado           │
  ├─────────┼────────┼─────────────┼────────────────────────────┤
  │ Amharic │ am     │ east_africa │ ⚡ Solo falta manual_am.md │
  ├─────────┼────────┼─────────────┼────────────────────────────┤
  │ Oromo   │ om     │ east_africa │ Nuevo completo             │
  └─────────┴────────┴─────────────┴────────────────────────────┘

  ▎ Amharic ya tiene languages.json + i18n.json completos — solo necesita el manual.
  Oromo ~40M hablantes, el más hablado del África oriental.

  ---
  Fase 4 — África Occidental + Central (3 idiomas)

  ┌─────────────────┬────────┬──────────────────────────────┐
  │     Idioma      │ Código │           Subgrupo           │
  ├─────────────────┼────────┼──────────────────────────────┤
  │ Bambara         │ bm     │ west_africa                  │
  ├─────────────────┼────────┼──────────────────────────────┤
  │ Fula / Fulfulde │ ff     │ west_africa                  │
  ├─────────────────┼────────┼──────────────────────────────┤
  │ Lingala         │ ln     │ west_africa → central_africa │
  └─────────────────┴────────┴──────────────────────────────┘

  ▎ Lingala justificaría agregar central_africa como subgrupo dentro del tab África.

  ---
  Fase 5 — África Cuerno + Sur (3 idiomas)

  ┌──────────┬────────┬─────────────────┐
  │  Idioma  │ Código │    Subgrupo     │
  ├──────────┼────────┼─────────────────┤
  │ Somali   │ so     │ east_africa     │
  ├──────────┼────────┼─────────────────┤
  │ Tigrinya │ ti     │ east_africa     │
  ├──────────┼────────┼─────────────────┤
  │ Shona    │ sn     │ southern_africa │
  └──────────┴────────┴─────────────────┘

  ---
  Resumen de esfuerzo por fase

  ┌──────┬─────────┬─────────────┬───────────────────────────┐
  │ Fase │ Idiomas │ Artefactos  │    Complejidad script     │
  ├──────┼─────────┼─────────────┼───────────────────────────┤
  │ 1    │ 3       │ 9 archivos  │ Silabario Cherokee ⚠️      │
  ├──────┼─────────┼─────────────┼───────────────────────────┤
  │ 2    │ 4       │ 12 archivos │ Moderada                  │
  ├──────┼─────────┼─────────────┼───────────────────────────┤
  │ 3    │ 2       │ 5 archivos  │ Fácil (amharic ya existe) │
  ├──────┼─────────┼─────────────┼───────────────────────────┤
  │ 4    │ 3       │ 9 archivos  │ Moderada                  │
  ├──────┼─────────┼─────────────┼───────────────────────────┤
  │ 5    │ 3       │ 9 archivos  │ Moderada                  │
  └──────┴─────────┴─────────────┴───────────────────────────┘

  ---
