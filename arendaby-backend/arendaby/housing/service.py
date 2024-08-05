import os
import random

import requests
from apartment.models import Apartment, ApartmentType, ApartmentPhoto, GroupApartmentType
from country.models import City, Country
from django.core.files import File
from geopy.geocoders import Nominatim
from user.models import UserProfile

PEXEL_API_KEY = "bDgZKrkxhnMrFnzUQpZtRjqrfwyJ0uJUbFwcSDw8vUna7tSu3juiWzAp"
YANDEX_API_KEY = 'AQVNypOYgJnwl787cT6evGo8BG5xGi4NT3dANd8F'


def get_random_photo(query, api_key):
    url = f'https://api.pexels.com/v1/search?query={query.strip()}&per_page=15&page={random.randint(1, 10)}'
    headers = {
        'Authorization': api_key
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data['photos']:
            photo = random.choice(data['photos'])
            return photo['src']['original']
        else:
            return "None"
    else:
        return "Ошибка подключения к API."


def save_image(image_url, destination_folder):
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)  # Создаем папку, если она не существует

    image_response = requests.get(image_url)

    if image_response.status_code == 200:
        image_name = os.path.join(destination_folder, os.path.basename(image_url))
        with open(image_name, 'wb') as file:
            file.write(image_response.content)
        print(image_name)
        return image_name
    else:
        return None


# @transaction.atomic
def create_apartment(apart_data):
    for key, value in apart_data.items():
        address = value["address"].split(",")
        image_list = value["images"]
        city_name = address[0]
        city = check_city(city_name)
        apart_price = int(
            value["price"].replace("₽за сутки Стоимость за 1 сутки при заезде сегодня", "").replace(" ", ''))
        apartment = check_apartment(key, city, value["type"])
        if apartment is not None:
            try:
                new_apartment = Apartment.objects.create(
                    name=key, city=city, type=apartment[1],
                    street_name=address[1].strip(),
                    count_floor=random.randint(1, 20),
                    number_floor=random.randint(1, 20),
                    elevator=random.randint(0, 1) > 0,
                    number_house=address[len(address) - 1].strip(),
                    price=apart_price,
                    square=value["facilities_size"].split(" ")[0],
                    count_room=value["facilities"][2].split(" ")[0],
                    sleeping_places=value["facilities"][0].split(" ")[0],
                    landlord=UserProfile.objects.get(username="user123").user)

                for photo_link in image_list:
                    filename, photo_content = _download_photo(photo_link)
                    with open(filename, "wb") as file:
                        file.write(photo_content)
                    with open(filename, "rb") as file:
                        django_file = File(file)
                        new_photo = ApartmentPhoto(image=django_file, apartment=new_apartment)
                        new_photo.save()
                    # Удаляем временный файл
                    os.remove(filename)
                print(new_apartment.name + " - Успешно создан!")
            except Exception as e:
                print(e)
        else:
            continue


def check_group_apart_type(type_name):
    group_contains = GroupApartmentType.objects.filter(group_name__icontains=type_name.split(" ")[0]).first()
    # group = GroupApartmentType.objects.filter(group_name=type_name).first()
    if group_contains is not None:
        return group_contains
    else:
        return GroupApartmentType.objects.create(group_name=type_name.split(" ")[0])


def check_apart_type(type_name):
    group_type = check_group_apart_type(type_name)
    apart_type = ApartmentType.objects.filter(type_name=type_name).first()
    if apart_type is not None:
        return apart_type
    else:
        return ApartmentType.objects.create(type_name=type_name, group=group_type)


def check_apartment(apart_name, city, apart_type):
    apart_type = check_apart_type(apart_type)
    apartment = Apartment.objects.filter(name=apart_name, city=city, type=apart_type).first()
    if apartment is not None:
        print("Апартаменты уже есть в базе!")
        return None
    else:
        return [Apartment(name=apart_name, city=city, type=apart_type), apart_type]


def check_country(country_name):
    country = Country.objects.filter(name=country_name).first()
    if country is not None:
        return country
    else:
        try:
            photo = get_random_photo(country_name, PEXEL_API_KEY)
            return Country.objects.create(name=country_name, image=photo)
        except Exception as e:
            print(f"Не удалось создать страну: {e}")
            return None


def check_city(city_name) -> City:
    city = City.objects.filter(name=city_name).first()
    country_name = get_country_by_city(city_name)
    country = check_country(country_name)
    if country is not None:
        if city is not None:
            return city
        else:
            try:
                photo = get_random_photo(city_name, PEXEL_API_KEY)
                return City.objects.create(name=city_name, country=country, image=photo)
            except Exception as e:
                print(f"Не удалось создать город:  {e}")
                return None


def get_image_file(image_url):
    filename, photo_content = _download_photo(image_url)
    with open(filename, "wb") as file:
        file.write(photo_content)
    with open(filename, "rb") as file:
        django_file = File(file)
        return django_file


def _download_photo(photo_link: str):
    try:
        filename = photo_link.split("/")[-1]
        response = requests.get(photo_link)
        response.raise_for_status()
        return filename, response.content
    except requests.exceptions.RequestException as e:
        print(f"Не удалось загрузить фото: {e}")
        return None


def get_country_by_city(city_name):
    geolocator = Nominatim(user_agent="arendaby/1.0 (zerdonik777@gmail.com)")
    location = geolocator.geocode(city_name)

    if location:
        return location.address.split(',')[-1].strip()  # Получаем название страны
    else:
        return None


def translate_text(text, api_key):
    url = "https://translate.yandex.net/api/v1.5/tr.json/translate"

    params = {
        'key': api_key,
        'text': text,
        'lang': '-ru'  # 'en-ru' для перевода с английского на русский
    }

    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        return " ".join(data['text'])  # Возвращаем переведённый текст
    else:
        print(f"Ошибка: {response.status_code} - {response.text}")
        return None
