from itertools import zip_longest

import requests
from bs4 import BeautifulSoup


def get_(url):
    response = requests.get(url)
    if response.status_code == 200:
        print("Страница загружена успешно!")
        response.encoding = response.apparent_encoding
    soup = BeautifulSoup(response.text, 'html.parser')
    image_block = soup.find_all("div", class_="article-image-wrapper")
    text_block = soup.find_all("div", class_="article-text-wrapper")
    link_list = []

    for text_b, image_b in zip_longest(text_block, image_block, fillvalue=None):
        try:
            link = image_b.find("img", class_="h-full")
        except AttributeError:
            continue

        link_list.append(link.get("src"))

    return [link_list, text_block]

