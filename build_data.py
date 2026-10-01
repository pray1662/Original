#!/usr/bin/env python3
import subprocess, sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
data=root/'data'
for d in (data/'greek', data/'hebrew'):
    if d.exists():
        import shutil; shutil.rmtree(d)
    d.mkdir(parents=True,exist_ok=True)

def find_one(base, patterns):
    hits=[]
    for pat in patterns: hits += list(base.glob(pat))
    hits=[p for p in hits if p.is_file()]
    if not hits: raise SystemExit(f'No TSV found under {base}')
    return max(hits,key=lambda p:p.stat().st_size)

greek=find_one(root/'vendor/macula-greek',['TSV/*.tsv','SBLGNT/tsv/*.tsv','Nestle1904/TSV/*.tsv','**/*SBLGNT*.tsv'])
hebrew=find_one(root/'vendor/macula-hebrew',['WLC/tsv/*.tsv','**/macula-hebrew.tsv'])
for src,lang in ((greek,'greek'),(hebrew,'hebrew')):
    if src.stat().st_size < 100_000: raise SystemExit(f'{src} is suspiciously small ({src.stat().st_size} bytes); possible LFS pointer')
    print(f'Importing {lang}: {src} ({src.stat().st_size:,} bytes)')
    subprocess.run([sys.executable,str(root/'scripts/import_macula.py'),str(src),str(data),lang],check=True)
counts={lang:len(list((data/lang).glob('*/*.json'))) for lang in ('greek','hebrew')}
print('Chapter counts:',counts)
if counts['greek'] < 250: raise SystemExit('Greek import incomplete')
if counts['hebrew'] < 800: raise SystemExit('Hebrew import incomplete')
