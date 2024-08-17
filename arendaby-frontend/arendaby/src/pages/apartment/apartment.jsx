import React, {Fragment, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {api, getCity} from "../../services/Api";
import Menu from "../../components/navbar/navbar";
import "./apartment.css";
import Filter from "../../components/Filter/Filter";
import ApartmentHeader from "../../components/apartment/ApartmentHeader";
import ApartmentBody from "../../components/apartment/ApartmentBody";
import Loader from "../../components/Loader/ClipLoader";
import Footer from "../../components/Footer/Footer";

export default function Apartment() {
    const [apartment, setApartmentList] = useState([]);
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const [cityName, setCityName] = useState("");
    const [cityUrlImage, setCityUrlImage] = useState("");
    const decl = require('ru-declensions-geo').GeoNamesDeclensions;
    const [currentPage, setCurrentPage] = useState(1);
    const [apartPerPage, setApartPerPage] = useState(20);

    const indexOfLastApartment = currentPage * apartPerPage;
    const indexOfFirstApartment = indexOfLastApartment - apartPerPage;
    const currentApartments = apartment.slice(indexOfFirstApartment, indexOfLastApartment)
    const [refreshKey, setRefreshKey] = useState(0); // Ключ для принудительного обновления
    const [isFiltered, setIsFiltered] = useState(false);
    const [filterByParam, setFilterByParam] = useState([]);


    const handlePageChange = (number) => {
        setCurrentPage(number);
        setRefreshKey(refreshKey + 1); // Принудительное обновление
    };

    const fetchCity = async () => {
        const response = await getCity(id);
        if (response.status === 200) {
            const city = decl.getCases(response.data.name)
            setCityName(city[city.length - 1]);
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
        try {
            fetchCity(id);
            fetchApartment(id);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        } finally {
            setLoading(false);
            // setCurrentApartments(apartment.slice(indexOfFirstApartment, indexOfLastApartment));
        }
    }, [currentPage]);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(apartment.length / apartPerPage); i++) {
        pageNumbers.push(i);
    }

    const updateApartmentList = (filterResult) => {
        setIsFiltered(true);
        setApartmentList(filterResult);
    }

    return (
        <Fragment>
            <Menu/>
            {apartment.length !== 0 ? (
                <Fragment>
                    <ApartmentHeader city={cityName} apartment={apartment} imgUrl={cityUrlImage}/>
                    <div className="container container-primary">
                        <div className="row apartment-row-title">
                            <div className="col-lg">
                                <h4><strong>Найдём, где остановиться в {cityName}: {apartment.length} вариантов</strong>
                                </h4>
                            </div>
                        </div>
                        <div className="row">
                            <Filter cityId={id}/>
                            <ApartmentBody
                                apartmentList={currentApartments} refreshKey={refreshKey}/>
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
            ) : (
                <Loader loading={loading}/>
            )}
            <Footer/>
        </Fragment>
    )
}
