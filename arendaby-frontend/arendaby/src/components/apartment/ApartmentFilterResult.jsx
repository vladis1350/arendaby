import {useLocation} from "react-router-dom";
import {filterApartment, getCity} from "../../services/Api";
import React, {Fragment, useEffect, useState} from "react";
import ApartmentBody from "./ApartmentBody";
import Menu from "../navbar/navbar";
import ApartmentHeader from "./ApartmentHeader";
import Filter from "../Filter/Filter";


export default function ApartmentFilterResult() {
    const [loader, setLoader] = useState(false);
    const [filterResult, setFilterResult] = useState([]);
    const searchParams = new URLSearchParams(useLocation().search);
    const city_id = searchParams.get('city');
    const [cityUrlImage, setCityUrlImage] = useState("");
    const [cityName, setCityName] = useState('');
    const start_booking = searchParams.get('start_booking');
    const end_booking = searchParams.get('end_booking');
    const guests = searchParams.get('guests');

    const fetchCity = async () => {
        const response = await getCity(city_id);
        if (response.status === 200) {
            setCityName(response.data.name);
            setCityUrlImage(response.data.image);
        } else {
            alert("Ошибка получения данных!");
        }
    }

    const fetchApartmentByFilter = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('city', cityName);
        formDataToSend.append('guests', guests);
        if (start_booking !== '') {
            formDataToSend.append('start_booking', start_booking);
        } else {
            formDataToSend.append('start_booking', "");
        }

        if (end_booking !== '') {
            formDataToSend.append('end_booking', end_booking);
        } else {
            formDataToSend.append('end_booking', "");
        }

        const response = await filterApartment(formDataToSend);
        try {
            if (response.status === 200) {
                setFilterResult(response.data);
            } else {
                alert("не 200");
            }
        } catch (err) {
            alert("ERR");
        } finally {
        }
    }

    useEffect(() => {
        fetchCity();
        fetchApartmentByFilter();
    }, [city_id, cityName, cityUrlImage]);

    return (
        <Fragment>
            <Menu/>
            <ApartmentHeader city={cityName} apartment={filterResult} imgUrl={cityUrlImage}/>
            <div className="container container-primary">
                <div className="row apartment-row-title">
                    <div className="col-lg">
                        <h4><strong>Найдём, где остановиться в {cityName}e: {filterResult.length} вариантов</strong></h4>
                    </div>
                </div>
                <div className="row">
                    <Filter/>
                    <ApartmentBody apartmentList={filterResult}/>
                </div>
            </div>
        </Fragment>
    );
}