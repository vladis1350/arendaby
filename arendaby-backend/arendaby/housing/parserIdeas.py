import os
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup


def parse_webpage(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    text_elements = soup.find_all('p')
    img_elements = soup.find_all('img')

    data = []
    for img, text in zip(img_elements, text_elements):
        data.append({'img_src': img['src'], 'text': text.get_text()})

    return data
