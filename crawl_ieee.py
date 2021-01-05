import requests
from selenium import webdriver 
import bibtexparser
import re
import pathlib
import time
import random
import json
from glob import glob

WEBDRIVER_PATH = './chromedriver'

'''
@ARTICLE{7274774,
author={E. {Foxlin} and T. {Calloway} and H. {Zhang}},
journal={IEEE Transactions on Visualization and Computer Graphics}, title={Design and Error Analysis of a Vehicular AR System with Auto-Harmonization},
year={2015},
volume={21},
number={12},
pages={1323-1335},
abstract={This paper describes the design, development and testing of an AR system that was developed for aerospace and ground vehicles to meet stringent accuracy and robustness requirements. The system uses an optical see-through HMD, and thus requires extremely low latency, high tracking accuracy and precision alignment and calibration of all subsystems in order to avoid mis-registration and “swim”. The paper focuses on the optical/inertial hybrid tracking system and describes novel solutions to the challenges with the optics, algorithms, synchronization, and alignment with the vehicle and HMD systems. Tracker accuracy is presented with simulation results to predict the registration accuracy. A car test is used to create a through-the-eyepiece video demonstrating well-registered augmentations of the road and nearby structures while driving. Finally, a detailed covariance analysis of AR registration error is derived.},
keywords={aircraft;augmented reality;automobiles;covariance analysis;error analysis;helmet mounted displays;image registration;optical tracking;traffic engineering computing;error analysis;vehicular AR system;auto-harmonization;aerospace vehicles;ground vehicles;optical see-through HMD;optical-inertial hybrid tracking system;through-the-eyepiece video;covariance analysis;AR registration error;augmented reality;car;aircraft;Aerospace electronics;Optical sensors;Augmented reality;Virtual reality;Calibration;Adaptive optics;Cameras;Augmented reality;registration;calibration;hybrid tracking;inertial;see-through HMD;Inertial, augmented reality, calibration, registration, hybrid tracking, see through HMD, image processing, sensor fusion},
doi={10.1109/TVCG.2015.2481385},
ISSN={1941-0506},
month={Dec},}
'''

'''
@INPROCEEDINGS{5742371, 
author={T. {Gschwandtner} and W. {Aigner} and K. {Kaiser} and S. {Miksch} and A. {Seyfang}}, 
booktitle={2011 IEEE Pacific Visualization Symposium}, title={CareCruiser: Exploring and visualizing plans, events, and effects interactively}, 
year={2011}, 
volume={}, 
number={}, 
pages={43-50}, 
abstract={In recent years, sophisticated visualization methods have been developed to support both, the logical structure and the time-oriented aspects of computer-executable clinical treatment plans. However, visualizing the effects of applying treatment plans as well as supporting the exploration of effects on the patient's condition are still largely unresolved tasks. To fill this gap, we have developed a prototype that enhances known visualization methods to communicate the processes of treatment plan application together with their effects on a patient's condition in an easily understandable way. Our prototype combines the advantages of enhanced visual recognition of patterns with traditional information of parameters' development. Thus, it provides means (1) to assess success or failure of previously applied treatment plans, (2) to explore the effects of each applied clinical action on the patient's condition, and (3) to identify sub-optimal treatment choices. These means help physicians to optimize their treatment choices and enable developers of clinical practice guidelines (CPGs) to investigate and readjust these treatment plans.}, 
keywords={data visualisation;medical information systems;patient treatment;pattern recognition;CareCruiser;sophisticated visualization methods;time-oriented aspects;computer-executable clinical treatment plans;treatment plan application;patient condition;enhanced visual pattern recognition;clinical action;suboptimal treatment choices;clinical practice guidelines;CPG;Data visualization;Image color analysis;Visualization;Diamond-like carbon;Color;Electronic mail;Prototypes;H.5.m [Information Systems]: Information Interfaces And Presentation (e.g., HCI)—Miscellaneous;I.3.6 [Computing Methodologies]: Computer Graphics—Methodology and Techniques;J.3 [Computer Applications]: Life and Medical Sciences—Medical information systems}, 
doi={10.1109/PACIFICVIS.2011.5742371}, 
ISSN={2165-8773}, 
month={March},}
'''

def crawl(bibpath):
    #print(bibpath)
    print(f'[BEGIN] bibpath: '+bibpath)
    # Open selenium webdriver
    options = webdriver.ChromeOptions()
    # specify headless mode
    options.add_argument('headless')
    options.add_argument("start-maximized")
    #options.add_experimental_option("excludeSwitches", ["enable-automation"])
    #options.add_experimental_option('useAutomationExtension', False)
    # add disable gpu option
    options.add_argument("disable-gpu")
    browser = webdriver.Chrome(WEBDRIVER_PATH, options=options)

    def get_ieee_dois_of_ref(ref_links):
        dois = []
        # print(ref_links)
        for url in ref_links:
            print(url)
            response = requests.get(url)
            if response.ok:
                browser.implicitly_wait(3)
                browser.get(url)
                try :
                    doi_elem = browser.find_element_by_class_name('stats-document-abstract-doi').find_element_by_tag_name('a')
                    dois.append(doi_elem.text)
                except :
                    print('no such paper: '+ url)
        # print(dois)
        return dois

    # TODO: save data in data
    data = {}
    # open bib file
    with open(bibpath, 'r', encoding='utf8') as bibfile :

        # with bibtexparser, parse bib file
        bibs = bibtexparser.load(bibfile)

        fail_count = 0
        for bib in bibs.entries :
            #print(bib)
            entrytype = bib['ENTRYTYPE']
            doi = bib['doi']    # get doi which is used as primary key
            ikey = bib['ID']    # get ID to find url
            # TODO: authors
            author = bib['author'].replace('{', '').replace('}', '').split(' and ')
            author = [a.strip()for a in author]
            # TODO: abstract
            abstract = bib['abstract']
            # TODO: title
            title = bib['title']
            # TODO: year
            year = bib['year']
            # TODO: keywords
            keywords = bib['keywords'].split(';')
            # TODO: journal ( conference )
            published = ''
            if entrytype == 'articles' :
                published = bib['journal']
            elif entrytype == 'inproceedings' :
                published = bib['booktitle']
            # TODO: volume
            # 그냥 bib에 존재하는 데이터 다 data로 때려 박을까?

            # TODO: to distinguish from chi data, please change location
            filepath = f"crawled/{doi}.txt"
            if pathlib.Path(filepath).exists():
                print(f'[PASS] {doi}')
                continue

            # Get reference data
            ref_url = f'https://ieeexplore.ieee.org/document/{ikey}/references#references'
            #print(ref_url)
            response = requests.get(ref_url)
            refs = []
            if response.ok:
                browser.implicitly_wait(3)
                browser.get(ref_url)

                ref_links_ieee = [elem.get_attribute('href') for elem in browser.find_elements_by_class_name('stats-reference-link-viewArticle')]
                refs_cross = [elem.get_attribute('href').split('doi.org/')[1] for elem in browser.find_elements_by_class_name('stats-reference-link-crossRef')]
                refs_acm = [elem.get_attribute('href').split('doi.org/')[1] for elem in browser.find_elements_by_class_name('stats-reference-link-accessAcm')]
                #print(ref_links_ieee)
                refs_ieee = get_ieee_dois_of_ref(ref_links_ieee)
                refs = refs_ieee + refs_acm + refs_cross
                # TODO: with reference check module, get dois of ref_links_ieee
                with open('log.txt', 'a') as f:
                    f.write(f'[SUCCESS] {doi} ref\n')
            else:
                with open('log.txt', 'a') as f:
                    f.write(f'[FAIL] {doi} ref\n')
                fail_count += 1

            # get citation data
            cite_url = f'https://ieeexplore.ieee.org/document/{ikey}/citations#citations'
            #print(cite_url)
            cites = []
            response = requests.get(cite_url)
            if response.ok:
                browser.implicitly_wait(3)
                browser.get(cite_url)

                cite_links_ieee = [elem.get_attribute('href') for elem in browser.find_elements_by_class_name('stats-citations-link-viewArticle')]
                cites_cross = [elem.get_attribute('href').split('doi.org/')[1] for elem in browser.find_elements_by_class_name('stats-citations-link-crossRef')]
                cites_acm = [elem.get_attribute('href').split('doi.org/')[1] for elem in browser.find_elements_by_class_name('stats-citations-link-accessAcm')]
                    
                # TODO: with reference check module, get dois of cite_links_ieee
                cites_ieee = get_ieee_dois_of_ref(cite_links_ieee)
                #print(cites_ieee)
                #print(cites_cross)
                #print(cites_acm)
                cites = cites_ieee + cites_acm + cites_cross
                with open('log.txt', 'a') as f:
                    f.write(f'[SUCCESS] {doi} cite\n')
            else:
                with open('log.txt', 'a') as f:
                    f.write(f'[FAIL] {doi} cite\n')
                fail_count += 1
            if fail_count >= 3:
                break

            data[doi] = {
                "doi": doi,
                "author": author,
                "title": title,
                "year": year,
                "abstract": abstract,
                "keywords": keywords,
                "referenced_by": cites, 
                "referencing": refs,
            }
            
            time.sleep(random.randint(5, 10))
    
    browser.quit()

    outfile_path = './vis_data/'
    outfile_name = bibpath.split('\\')[1].split('.')[0]
    with open(outfile_path+outfile_name+'.json', 'w', encoding='utf8') as outfile :
        json.dump(data, outfile)





if __name__ == "__main__":
    bibpaths = glob('./vis_bib/*.bib')
    #print(bibpaths)
    for bibpath in bibpaths:
        crawl(bibpath)