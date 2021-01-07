import os
import json
import bibtexparser

bibpaths = ['vis_bibtex/' + i for i in os.listdir('vis_bibtex') if i.endswith('.bib')]
id_to_doi = {}
for bibpath in bibpaths:
    print(bibpath)
    with open(bibpath) as f:
        entries = bibtexparser.load(f).entries
        for entry in entries:
            try:
                id_to_doi[entry['ID']] = entry['doi']
            except Exception as e:
                print(e)

filepaths = ['tvcg/' + i for i in os.listdir('tvcg/') if i.endswith('json')]

def clean_ref(references):
    cleaned = []
    for reference in references:
        if reference.startswith('IKEY'):
            doc_id = reference.split('IKEY:')[1]
            if doc_id in id_to_doi:
                cleaned.append(id_to_doi[doc_id])
        else:
            cleaned.append(reference)
    return list(set(cleaned))

merged = {}
for filepath in filepaths:
    print(filepath)
    with open(filepath) as f:
        for doi, entry in json.load(f).items():
            entry['referencing'] = clean_ref(entry['referencing'])
            entry['referenced_by'] = clean_ref(entry['referenced_by'])
            if 'tvcg/tvcg' in filepath or 'tvcg/vis_bibtex' in filepath:
                entry['conference'] = 'TVCG'
            elif 'tvcg/pv' in filepath:
                entry['conference'] = 'PV'
            elif 'tvcg/data' in filepath:
                entry['conference'] = 'CHI'
            merged[doi] = entry

with open('merged.json', 'w') as f:
    f.write(json.dumps(merged))
