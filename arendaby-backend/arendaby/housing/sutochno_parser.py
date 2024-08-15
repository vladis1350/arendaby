import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

# Установка драйвера
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

try:
    # Переход на сайт
    driver.get(
        'https://sutochno.ru/front/searchapp/search?search_history=1&from=mainpage&price_per=1&guests_adults=2&id=398612&SW.lat=53.76482957610492&SW.lng=27.428125558593123&NE.lat=54.01994455806141&NE.lng=27.691797433593102&guests_childrens=2&term=%D0%9C%D0%B8%D0%BD%D1%81%D0%BA&type=city')

    # Ждем, чтобы страница полностью загрузилась
    time.sleep(3)  # Лучше использовать WebDriverWait для более надежного ожидания

    # Получение данных (например, заголовки всех <h2> элементов)
    headers = driver.find_elements(By.CLASS_NAME, 'card-list__item')

    for header in headers:
        print(header.text)  # Печатаем текст заголовка

finally:
    # Закрытие браузера
    driver.quit()
