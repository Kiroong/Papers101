import pathlib
from glob import glob
import time
import random
import json

bibpath = 'bibs/'
textpath = 'crawled/'

# Global data

'''
@inproceedings{10.1145/332040.332042,
author = {McClard, Anne and Somers, Patricia},
title = {Unleashed: Web Tablet Integration into the Home},
year = {2000},
isbn = {1581132166},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/332040.332042},
doi = {10.1145/332040.332042},
abstract = {To understand how web access from a portable tablet appliance changes the way people use the Internet, MediaOne gave families pen-based tablet computers with a wireless connection to our high-speed data network. We used ethnographic and usability methods to understand how tablets would be integrated into household activities and to define user requirements for such devices. Participants viewed the tablet as conceptually different from a PC. The tablet enabled a high degree of multitasking with household activities, yet flaws in form and function affected use. Results suggest that correctly designed portable Internet appliances will fill a special role in peoples' daily lives, particularly if these devices share information with each other. They will allow spontaneous access to information and communication anywhere.},
booktitle = {Proceedings of the SIGCHI Conference on Human Factors in Computing Systems},
pages = {1–8},
numpages = {8},
keywords = {Internet appliances, hand-held computer, ethnography, pen-based computing, ergonomics},
location = {The Hague, The Netherlands},
series = {CHI '00}
}


@inbook{10.1145/3025453.3025589,
author = {Mentis, Helena M. and Komlodi, Anita and Schrader, Katrina and Phipps, Michael and Gruber-Baldini, Ann and Yarbrough, Karen and Shulman, Lisa},
title = {Crafting a View of Self-Tracking Data in the Clinical Visit},
year = {2017},
isbn = {9781450346559},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/3025453.3025589},
abstract = {When self-tracking encounters clinical practices, the data is reshaped by goals and expertise that exist within a healthcare framework. To uncover these shaping practices, we provided a Fitbit Zip step-count sensor to nine patients with Parkinson's disease. Each patient wore the sensor for four weeks and then returned for a clinical visit with their neurologist. Our analysis focuses on this first clinical visit after four weeks of data had been collected. Our use of conversation analysis of both talk and action makes visible the practices engaged in by both collaborative members to 'craft a view' of the data toward shared decision making. Our findings reveal the deliberate guiding of attention to specific interpretations of the data through both talk and actions and we explain how our systematic analysis has uncovered tools for the mutually beneficial crafting practices of the clinician and patient.},
booktitle = {Proceedings of the 2017 CHI Conference on Human Factors in Computing Systems},
pages = {5800–5812},
numpages = {13}
}


@dataset{10.1145/review-2702123.2702240_R52090,
author = {Szymanska, Agnieszka},
title = {Review ID:R52090 for DOI: 10.1145/2702123.2702240},
publisher = {Association for Computing Machinery},
url = {https://doi.org/10.1145/review-2702123.2702240_R52090}
}

'''

def parse_reference(doi, refpath) :
    global data
    global dois
    with open(refpath, 'r', encoding='utf8') as reffile :
        while True :
            line = reffile.readline()
            if not line : break

            words = line.split('\t')
            if words[0] :
                refdoi = words[0].replace('/', '-')
                if refdoi in data:
                    data[doi]['referencing'].append(refdoi)
                    data[refdoi]['referenced_by'].append(doi)

def parse_dataset(doi, lines) :
    pass

def parse_book(doi, lines) :
    global data
    for line in lines :
        try:
            key = line.split(' ')[0]
            values = line.split('{')[1][:-3]
            if key == 'author' :
                author = [v.strip() for v in values.split('and')]
                data[doi]['author'] = author
            elif key == 'title' :
                data[doi]['title'] = values
            elif key == 'year': 
                data[doi]['year'] = int(values)
            #elif key == 'doi': 
            #    data[doi]['doi'] = values
            elif key == 'abstract':
                data[doi]['abstract'] = values
        except :
            print(doi)
            print(line)
            exit()

    refpaths = glob(textpath+doi+'.txt')
    if refpaths:
        parse_reference(doi, refpaths[0])




def parse_proceedings(doi, lines):
    #print(doi)
    #print(lines)
    current_key = ''
    for line in lines :
        #print(line)
        if ' = {' in line or '@in' in line:
            key = line.split(' ')[0]
            current_key = key
            values = line.split('{')[1][:-3]
            if key == 'author' :
                author = [v.strip() for v in values.split('and')]
                data[doi]['author'] = author
            elif key == 'title' :
                data[doi]['title'] = values
            elif key == 'year': 
                data[doi]['year'] = int(values)
            #elif key == 'doi': 
            #    data[doi]['doi'] = values
            elif key == 'abstract':
                data[doi]['abstract'] = values
            elif key == 'keywords':
                keywords = [v.strip() for v in values.split(',')]
                data[doi]['keywords'] = keywords
        else :
            data[doi][current_key] += line

    refpaths = glob(textpath+doi+'.txt')
    if refpaths:
        parse_reference(doi, refpaths[0])

def parse(bibpath) :
    # Reference text files
    i = 0
    #print(refpaths)
    with open(bibpath, 'r', encoding='utf8') as bibfile :
        doi = ''
        intype = None
        lines = []
        
        while True :
            line = bibfile.readline()
            if not line : break
            # Get doi
            if '@inproceedings' in line :
                doi = line.split('{')[1][:-2].replace('/', '-')
                intype = 'proceedings'
            elif '@inbook' in line :
                doi = line.split('{')[1][:-2].replace('/', '-')
                intype = 'book'
            elif '@dataset' in line :
                # Pass dataset
                doi = line.split('{')[1][:-2].replace('/', '-').replace('review-', '').split('_')[0]
                intype = 'dataset'

            if intype is not None :
                if '}' == line[0]  :
                    if intype == 'proceedings' :
                        parse_proceedings(doi, lines)
                    elif intype == 'book' :
                        parse_book(doi, lines)
                    elif intype == 'dataset' :
                        parse_dataset(doi, lines)
                    else :
                        print('...')
                    print(i)
                    i += 1
                    #print(data[doi])
                    lines = []
                    doi = ''
                    intype = None

                elif '\n' == line :
                    pass
                else :
                    lines.append(line)

if __name__ == "__main__":
    global data
    global dois

    data = {}
    doipaths = glob(textpath+'*.txt')
    dois = [doi.split('\\')[-1].replace('.txt', '') for doi in doipaths]
    
    for doi in dois:
        data[doi] = {
            'doi': '',
            'author': [],
            'title': '',
            'year': 0,
            'abstract': '', 
            'keywords': [], # keyword list. only for proccedings
            'referenced_by': [],    # doi list
            'referencing': []   # doi list
        }
    bibpaths = glob(bibpath+'*.bib')
    for bibpath in bibpaths :
        parse(bibpath)

    print(len(data))
    json_path = 'data.json'
    with open('data.json', 'w', encoding='utf8') as outfile:
        json.dump(data, outfile)