# Original
A minimal offline-first PWA for reading the Greek New Testament and Hebrew Old Testament.

## v1
- Testament → book → chapter navigation
- Original-language reader
- Tap a word for gloss, transliteration, lemma and parsing
- RTL Hebrew support
- Installable/offline PWA shell
- Static hosting compatible (including GitHub Pages)

The repository includes a live John 1 / Genesis 1 sample so the UI works immediately. The app expects full generated chapter data at `data/{greek|hebrew}/{book-slug}/{chapter}.json`.

Each chapter is an array of verses:
`[{"v":1,"w":[[surface,lemma,transliteration,gloss,parsing], ...]}]`

## Data sources
Designed for MACULA Greek and MACULA Hebrew. Preserve their required attribution when distributing derived data.
- MACULA Greek Linguistic Datasets, available at https://github.com/Clear-Bible/macula-greek/ (CC BY 4.0)
- MACULA Hebrew Linguistic Datasets, available at https://github.com/Clear-Bible/macula-hebrew/ (CC BY 4.0; constituent source licences also apply)

## Run locally
Because service workers and JSON fetches require HTTP, run a local server rather than opening index.html directly, e.g. `python3 -m http.server 8000`, then visit localhost:8000.
