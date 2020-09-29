import requests
import bs4
from bs4 import BeautifulSoup
import pathlib
import time
import random

def crawl(filepath):
    dois = []
    with open(filepath) as f:
        for line in f:
            if 'doi = {' in line:
                dois.append(line.split('doi = {')[1].split('}')[0])

    fail_count = 0
    for doi in dois:
        filepath = f"crawled/{doi.replace('/', '-')}.txt"
        if pathlib.Path(filepath).exists():
            print(f'[PASS] {doi}')
            continue

        response = requests.get(f'https://dl.acm.org/doi/{doi}')
        if response.ok:
            with open(filepath.replace('.txt', '.html'), 'w') as f:
                f.write(response.text)
            soup = BeautifulSoup(response.text, features='html.parser')
            references = soup.select('span.references__note')

            def reference_to_string(ref):
                # full_title = ''
                # for child in ref.children:
                #     if type(child) == bs4.element.NavigableString:
                #         full_title += child
                full_title = ref.text
                doi = ''
                for a_tag in ref.select('a'):
                    if a_tag.has_attr('href') and 'dl.acm.org/doi' in a_tag['href']:
                        doi = a_tag['href'].split('doi/')[1]
                return f'{doi}\t{full_title}'

            with open(filepath, 'w') as f:
                f.write(
                    '\n'.join([reference_to_string(ref) for ref in references])
                )
            with open('log.txt', 'a') as f:
                f.write(f'[SUCCESS] {doi}\n')
        else:
            with open('log.txt', 'a') as f:
                f.write(f'[FAIL] {doi}\n')
            fail_count += 1
        if fail_count >= 3:
            break
        time.sleep(random.randint(5, 10))

if __name__ == "__main__":
    for filepath in ('papers-19.bib', 'papers-82.bib', 'papers-00.bib'):
        crawl(filepath)