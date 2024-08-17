import {useLocation} from "react-router-dom";
import {filterApartment, getCity} from "../../services/Api";
import React, {Fragment, useEffect, useState} from "react";
import ApartmentBody from "./ApartmentBody";
import Menu from "../navbar/navbar";
import ApartmentHeader from "./ApartmentHeader";
import Filter from "../Filter/Filter";
import {format} from 'date-fns';


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
    const [currentPage, setCurrentPage] = useState(1);
    const [apartPerPage, setApartPerPage] = useState(20);
    const indexOfLastApartment = currentPage * apartPerPage;
    const indexOfFirstApartment = indexOfLastApartment - apartPerPage;
    const currentApartments = filterResult.slice(indexOfFirstApartment, indexOfLastApartment)
    const [refreshKey, setRefreshKey] = useState(0); // Ключ для принудительного обновления


    const fetchCity = async () => {
        try {
            const response = await getCity(city_id);
            if (response.status === 200) {
                setCityName(response.data.name);
                setCityUrlImage(response.data.image);
            } else {
                alert("Ошибка получения данных!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchApartmentByFilter = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('city', cityName);
        formDataToSend.append('guests', guests);
        if (start_booking !== '') {
            formDataToSend.append('start_booking', format(start_booking, "yyyy-MM-dd"));
        } else {
            formDataToSend.append('start_booking', "");
        }

        if (end_booking !== '') {
            formDataToSend.append('end_booking', format(end_booking, "yyyy-MM-dd"));
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

    const handlePageChange = (number) => {
        setCurrentPage(number);
        setRefreshKey(refreshKey + 1); // Принудительное обновление
    };

    useEffect(() => {
        fetchCity();
        fetchApartmentByFilter();
    }, [city_id, cityName, cityUrlImage]);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filterResult.length / apartPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <Fragment>
            <Menu/>
            <ApartmentHeader city={cityName} apartment={filterResult} imgUrl={cityUrlImage}/>
            <div className="container container-primary">
                <div className="row apartment-row-title">
                    <div className="col-lg">
                        <h4><strong>Найдём, где остановиться в {cityName}e: {filterResult.length} вариантов</strong>
                        </h4>
                    </div>
                </div>
                <div className="row">
                    <Filter cityId={city_id}/>
                    <ApartmentBody apartmentList={currentApartments} refreshKey={refreshKey}/>
                    <div className={"pagination-block"}>
                        <ul className="pagination">
                            <li className="page-item disabled">
                                <a className="page-link" href="#">&laquo;</a>
                            </li>
                            {pageNumbers.map(number => (
                                <li className="page-item active" key={number}
                                    onClick={() => handlePageChange(number)}>
                                    <a className="page-link" href="#">{number}</a>
                                </li>
                            ))}
                            <li className="page-item">
                                <a className="page-link" href="#">&raquo;</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}