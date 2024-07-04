import React, {Fragment, useEffect, useState} from "react";
import {Link, useLocation, useParams} from "react-router-dom";
import {api, filterApartment, getCity} from "../../services/Api";
import Menu from "../../components/navbar/navbar";
import "./apartment.css";
import Filter from "../../components/Filter/Filter";
import {Carousel} from "../../components/carousel/Carousel";
import ApartmentHeader from "../../components/apartment/ApartmentHeader";

export default function Apartment() {
    const [apartment, setApartmentList] = useState([]);
    const {id} = useParams();
    const [cityName, setCityName] = useState("");
    const [cityUrlImage, setCityUrlImage] = useState("");
    const searchParams = new URLSearchParams(useLocation().search);
    const city = searchParams.get('city');
    const start_booking = searchParams.get('start_booking');
    const end_booking = searchParams.get('end_booking');
    const [selectedDates, setSelectedDates] = useState([]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toISOString().slice(0, 19);
    };

    const fetchCity = async (city_id) => {
        const response = await getCity(city_id);
        if (response.status === 200) {
            setCityName(response.data.name);
            setCityUrlImage(response.data.image);
        } else {
            alert("Ошибка получения данных!");
        }
    }

    const fetchApartment = async (city_id) => {
        await api.get(`/api/apartment/city/${city_id}`)
            .then(res => res.data)
            .then(data => setApartmentList(data))
            .catch(err => console.log(err));
    }

    const fetchApartmentByFilter = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('city', cityName);
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
                setApartmentList(response.data);
            } else {
                alert("не 200")
            }
        } catch (err) {
            alert("ERR")
        } finally {

        }
    }

    useEffect(() => {
        if (city) {
            fetchApartmentByFilter();
            fetchCity(city);
        } else {
            fetchApartment(id);
            fetchCity(id);
        }
    }, [apartment]);

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
                    <div className="col-9 center-apart-block">
                        {apartment.map(item => (
                            <Link to={`/apartment/${item.id}`}>
                                <div className="row apartment-row-items">
                                    <div className="col-4 apart-img-block">
                                        <Carousel>
                                            {item.images && item.images.length > 0 && (
                                                item.images.map((image, index) => (
                                                        <img key={index} src={image.image} alt={`Image ${index}`}
                                                             className="d-block ap-img"/>
                                                    )
                                                ))}
                                        </Carousel>
                                    </div>
                                    <div className="col-6 apartment-info">
                                        <p className={"apart-type"}>{item.type.type_name}</p>
                                        <p className={"apart-title"}>{item.name}</p>
                                        <p className={"apart-address"}>{item.address}</p>
                                        {/*<p className={"apart-description"}>{item.descriptions}</p>*/}
                                        <p className={"sleeping_places"}>Количество спальных
                                            мест: {item.sleeping_places}</p>
                                    </div>
                                    <div className="col-2 apartment-price">
                                        <span className={"apart-price"}>{item.price} за сутки</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
