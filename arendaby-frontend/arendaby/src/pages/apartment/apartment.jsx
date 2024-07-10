import React, {Fragment, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {api, getCity} from "../../services/Api";
import Menu from "../../components/navbar/navbar";
import "./apartment.css";
import Filter from "../../components/Filter/Filter";
import ApartmentHeader from "../../components/apartment/ApartmentHeader";
import ApartmentBody from "../../components/apartment/ApartmentBody";

export default function Apartment({isFilter, filteredList}) {
    const [apartment, setApartmentList] = useState([]);
    const {id} = useParams();
    const [cityName, setCityName] = useState("");
    const [cityUrlImage, setCityUrlImage] = useState("");

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 19);
    };

    const fetchCity = async () => {
        const response = await getCity(id);
        if (response.status === 200) {
            setCityName(response.data.name);
            setCityUrlImage(response.data.image);
        } else {
            alert("Ошибка получения данных!");
        }
    }

    const fetchApartment = async () => {
        await api.get(`/api/apartment/city/${id}`)
            .then(res => res.data)
            .then(data => setApartmentList(data))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchCity(id);
        fetchApartment(id);
    }, []);

    return (
        <Fragment>
            <Menu/>
            <ApartmentHeader city={cityName} apartment={apartment} imgUrl={cityUrlImage}/>
            <div className="container container-primary">
                <div className="row apartment-row-title">
                    <div className="col-lg">
                        <h4><strong>Найдём, где остановиться в {cityName}e: {apartment.length} вариантов</strong></h4>
                    </div>
                </div>
                <div className="row">
                    <Filter/>
                        <ApartmentBody apartmentList={apartment}/>
                </div>
            </div>
        </Fragment>
    )
}
