import re

import requests
from bs4 import BeautifulSoup


def get_country_list(url):
    response = requests.get(url)
    if response.status_code == 200:
        print("Страница загружена успешно!")
        response.encoding = response.apparent_encoding
    soup = BeautifulSoup(response.text, 'html.parser')
    abroad = soup.find("div", class_="abroad__group")
    links = abroad.find_all("a", class_="abroad__el")
    link_list = []
    for item in links:
        link_list.append(item.get('href'))

    return link_list


def parse_webpage(url):
    response = requests.get(url)
    # if response.status_code == 200:
    #     print("Страница загружена успешно!")
    #     response.encoding = response.apparent_encoding
    soup = BeautifulSoup(response.text, 'html.parser')
    apart_block_list = soup.find("div", class_='objects-list')
    apart_block = apart_block_list.find_all("div", class_="card")

    info_list = {}
    image_list = []
    fac = []
    for apart in apart_block:
        # парсинг информации
        apart_info = apart.find("div", class_="card-content")
        apart_price = apart.find("div", class_="card-prices")
        price = apart_price.find("div", class_="price")
        price = replacer(price)
        apart_type = apart_info.find("span", class_="object-hotel__type")
        apart_name = apart_info.find("a", class_="card-content__object-type")
        facilities_main = apart.find_all("p", class_="facilities__facility")
        facilities_size = apart.find("span", class_="value")
        for p in facilities_main:
            s = re.sub(r's+', ' ', p.text).replace('\xa0', ' ').strip()
            fac.append(s)
        apart_address = apart_info.find("p", class_="address__text")
        apart_address = apart_address.text.replace("\n", '')
        apart_address = apart_address.replace("\t", '')

        # парсинг изображений
        apart_img_block = apart.find("div", class_='card__img')
        carousel = apart_img_block.find("div", class_='carousel')
        slider_light = carousel.find_all("img", class_='track__img')
        for image in slider_light:
            if image.get('data-src') is not None:
                image_list.append(image.get('data-src'))
            else:
                image_list.append(image.get('src'))

        src_list = image_list.copy()
        fac_list = fac.copy()
        try:
            info_list.update({apart_name.text: {"type": apart_type.text, "address": apart_address,
                                                "price": price,
                                                "facilities": fac_list,
                                                "facilities_size": facilities_size.text.strip(), "images": src_list}})
        except AttributeError:
            continue
        image_list.clear()
        fac.clear()

    return info_list


def replacer(text):
    text = text.text.replace("\n", '')
    text = text.replace("\t", '')
    text = re.sub(r's+', ' ', text).replace('\xa0', ' ').strip()

    return text
