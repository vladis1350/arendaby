import random
import re
import time

import requests
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException, TimeoutException
# from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

from .service import create_apartment


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


def parse_webpage():
    all_cards_view = 0
    image_list = []
    info_list = {}
    params = []
    driver = webdriver.Firefox()
    links = {
        # "Москва": 'https://sutochno.ru/front/searchapp/search?guests_adults=1&term=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&price_per=1&id=1&SW.lat=54.60150568740563&SW.lng=36.37361645232882&NE.lat=56.558284061762066&NE.lng=38.48299145232881&occupied=2024-09-02;2024-09-03&sortings=rating.desc',
        "Санкт-Петербург": 'https://sutochno.ru/front/searchapp/search?id=397367&term=%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3&guests_adults=1&occupied=2024-08-31;2024-09-01&price_per=1&SW.lat=59.700402177912075&SW.lng=30.041236625000003&NE.lat=60.13410804459852&NE.lng=30.568580375000007&type=city',
        "Минск": 'https://sutochno.ru/front/searchapp/search?id=398612&term=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&guests_adults=1&occupied=2024-08-31;2024-09-01&price_per=1&SW.lat=53.76482957610492&SW.lng=27.428125558593123&NE.lat=54.01994455806141&NE.lng=27.691797433593102&type=city',
    }

    for city_name, link in links.items():
        driver.get(f'{link}')
        time.sleep(5)

        current_page = 1

        while all_cards_view != 500:
            page_height = driver.execute_script("return document.body.scrollHeight")
            curr_pos = 0
            while curr_pos < page_height:
                driver.execute_script(f"window.scrollTo({curr_pos}, {curr_pos + 500});")
                curr_pos += 500
                # Имитация поведения пользователя
                random_pause = random.uniform(0.5, 1.5)
                time.sleep(random_pause)
            time.sleep(5)

            to_parse1 = BeautifulSoup(driver.page_source, 'html')

            # Запоминаем идентификатор текущего окна, в котором открыта страница поиска
            originalWindow = driver.current_window_handle
            # Открываем новую вкладку, в которой и будут открываться карточки каждого объекта
            driver.switch_to.new_window('tab')

            # Собираем данные о каждом объекте
            flats_items = []
            for elem in to_parse1.find_all('div', class_='card'):
                flats_items.append(elem)

            flats = []
            cards_on_page = 0
            for item in flats_items:
                elem = item.find('a', class_='card-content')
                href = elem['href']
                # получение страницы с полной информацией объявления
                try:
                    driver.get(f'https://sutochno.ru{href}')
                    time.sleep(5)
                except TimeoutException:
                    continue
                # Имитация поведения пользователя
                driver.execute_script(f"window.scrollTo(0, 300);")
                random_pause2 = random.uniform(0.5, 3)
                time.sleep(random_pause2)
                try:
                    driver.find_element(By.CLASS_NAME, 'link-more').click()
                    time.sleep(5)
                except NoSuchElementException:
                    print('pip')
                to_parse2 = BeautifulSoup(driver.page_source, 'html')
                try:
                    path = to_parse2.find("ul", class_='path')
                    city = ''
                    try:
                        city = path.find_all("div", "list-city")[-1].text
                    except IndexError:
                        city = city_name
                    detail_top_name = to_parse2.find("div", class_='detail-top--name')
                    address = to_parse2.find("div", class_='address')
                    images = to_parse2.find_all("img", class_='navigation__img')
                    apart_type = to_parse2.find("div", class_='object-data--type')
                    params_block = to_parse2.find("div", class_='object-data--params')
                    param_items = params_block.find_all("span")
                    for param_item in param_items:
                        params.append(param_item.text)

                    desk = to_parse2.find("div", class_='object-data--desk')
                    sleeping_places_block = to_parse2.find("div", class_='object-data--sleeping-places')
                    sleeping_place = sleeping_places_block.find("span")
                    price = to_parse2.find("div", class_='view-price__item')
                    for image in images:
                        image_list.append(image.get('src'))

                    src_list = image_list.copy()
                    p = params.copy()

                    try:
                        info_list.update(
                            {detail_top_name.text: {"type": apart_type.text, "city": city, "address": address.text,
                                                    "price": price.text,
                                                    "params": p,
                                                    "desk": desk.text,
                                                    "sleeping_places": sleeping_place.text.replace(": ", ''),
                                                    "images": src_list}})
                    except AttributeError:
                        continue
                except AttributeError:
                    print("Attribute NOT FOUND!")
                    continue
                image_list.clear()
                params.clear()
                cards_on_page += 1
                if all_cards_view >= 500:
                    break
                else:
                    all_cards_view += 1
                print('++++\n', 'Просмотрен объект: ', cards_on_page, f' на странице: {current_page}', '\n++++')
                create_apartment(info_list)
                info_list.clear()

            print('-----\n', 'Обработана страница: ', current_page, '\n-----')
            current_page += 1

            # Закрываем текущую вкладку, на которой открывался каждый объект
            driver.close()
            # Возвращаемся во вкладку, в котором была открыта страница поиска
            driver.switch_to.window(originalWindow)

            # Проверяем есть ли на странице поиска следующая страница для поиска и если есть - открываем ее, если нет -
            # прерываем цикл while
            try:
                driver.find_element(By.LINK_TEXT, f'{current_page}').click()
            except NoSuchElementException:
                break
            except ElementClickInterceptedException:
                break

    # print('Всего просмотрено страниц поиска: ', cards_on_page - 1)
    print('Всего собрано данных о ', all_cards_view, ' объектах')

    return info_list


def replacer(text):
    text = text.text.replace("\n", '')
    text = text.replace("\t", '')
    text = re.sub(r's+', ' ', text).replace('\xa0', ' ').strip()

    return text
