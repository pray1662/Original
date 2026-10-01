#!/usr/bin/env python3
import csv,json,re,sys
from pathlib import Path

BOOKS={
'MAT':'Matthew','MRK':'Mark','LUK':'Luke','JHN':'John','ACT':'Acts','ROM':'Romans','1CO':'1 Corinthians','2CO':'2 Corinthians','GAL':'Galatians','EPH':'Ephesians','PHP':'Philippians','COL':'Colossians','1TH':'1 Thessalonians','2TH':'2 Thessalonians','1TI':'1 Timothy','2TI':'2 Timothy','TIT':'Titus','PHM':'Philemon','HEB':'Hebrews','JAS':'James','1PE':'1 Peter','2PE':'2 Peter','1JN':'1 John','2JN':'2 John','3JN':'3 John','JUD':'Jude','REV':'Revelation',
'GEN':'Genesis','EXO':'Exodus','LEV':'Leviticus','NUM':'Numbers','DEU':'Deuteronomy','JOS':'Joshua','JDG':'Judges','1SA':'1 Samuel','2SA':'2 Samuel','1KI':'1 Kings','2KI':'2 Kings','ISA':'Isaiah','JER':'Jeremiah','EZK':'Ezekiel','HOS':'Hosea','JOL':'Joel','AMO':'Amos','OBA':'Obadiah','JON':'Jonah','MIC':'Micah','NAM':'Nahum','HAB':'Habakkuk','ZEP':'Zephaniah','HAG':'Haggai','ZEC':'Zechariah','MAL':'Malachi','PSA':'Psalms','JOB':'Job','PRO':'Proverbs','RUT':'Ruth','SNG':'Song of Songs','ECC':'Ecclesiastes','LAM':'Lamentations','EST':'Esther','DAN':'Daniel','EZR':'Ezra','NEH':'Nehemiah','1CH':'1 Chronicles','2CH':'2 Chronicles'}

def slug(s): return s.lower().replace(' ','-')
def val(row,*names):
    low={k.lower():v for k,v in row.items() if k}
    for n in names:
        if n.lower() in low and low[n.lower()] not in (None,''): return low[n.lower()].strip()
    return ''
def parse_ref(s):
    m=re.search(r'([1-3]?[A-Z]{2,3})\s+(\d+):(\d+)(?:!(\d+))?',s or '')
    return m.groups() if m else None

def pretty(row,lang):
    # Prefer MACULA's combined morphology string when present; otherwise compose readable features.
    morph=val(row,'morph','morphology')
    if morph and not re.fullmatch(r'[A-Za-z0-9,+\-]+',morph): return morph
    fields=[]
    for key in ('pos','type','stem','tense','voice','mood','person','gender','number','case','state'):
        x=val(row,key)
        if x and x not in fields: fields.append(x)
    return ' · '.join(fields) or morph or '—'

def main(src,out,lang):
    chapters={}
    with open(src,encoding='utf-8-sig',newline='') as f:
        r=csv.DictReader(f,delimiter='\t')
        for row in r:
            ref=val(row,'ref','reference')
            pr=parse_ref(ref)
            if not pr: continue
            code,ch,vs,_=pr; book=BOOKS.get(code)
            if not book: continue
            text=val(row,'text','word','surface')
            if not text: continue
            lemma=val(row,'lemma')
            translit=val(row,'transliteration','translit')
            gloss=val(row,'english','gloss','mandarin') if lang=='hebrew' else val(row,'english','gloss')
            token=[text,lemma,translit,gloss,pretty(row,lang)]
            key=(book,int(ch)); chapters.setdefault(key,{}).setdefault(int(vs),[]).append(token)
    out=Path(out)
    count=0
    for (book,ch),verses in chapters.items():
        d=out/slug(book); d.mkdir(parents=True,exist_ok=True)
        payload=[{'v':v,'w':verses[v]} for v in sorted(verses)]
        (d/f'{ch}.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
        count+=1
    print(f'Generated {count} {lang} chapters')

if __name__=='__main__':
    if len(sys.argv)!=4 or sys.argv[3] not in ('greek','hebrew'):
        raise SystemExit('usage: import_macula.py SOURCE.tsv OUTPUT_DIR greek|hebrew')
    main(*sys.argv[1:])
