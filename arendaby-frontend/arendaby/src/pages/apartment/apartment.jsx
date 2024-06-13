import React, {Fragment, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {api} from "../../services/Api";
import Menu from "../../components/navbar/navbar";
import "./apartment.css";
import IMG from "./img/240.jpg"
import Filter from "../../components/Filter/Filter";
import {Carousel} from "../../components/carousel/Carousel";
import ApartmentHeader from "../../components/apartment/ApartmentHeader";

export default function Apartment() {
    const [apartment, setApartmentList] = useState([]);
    let [apartmentPhoto, setApartmentPhotoList] = useState([]);
    const {id} = useParams();
    const [cityName, setCityName] = useState("");
    const [cityUrlImage, setCityUrlImage] = useState("");
    const [imageUrl, setImgUrl] = useState([]);

    const fetchCity = () => {
        api.get(`/api/city/${id}`)
            .then(res => res.data)
            .then(data => {
                setCityName(data.name);
                setCityUrlImage(data.image);
            })
            .catch(err => console.log(err));
    }
    const fetchApartment = async () => {
        api.get(`/api/apartment/city/${id}`)
            .then(res => res.data)
            .then(data => setApartmentList(data))
            .catch(err => console.log(err));
    }

    const fetchApartmentPhotos = async () => {

    }

    useEffect(() => {
        fetchApartment();
        fetchCity();
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
                    <div className="col-9">
                        {apartment.map(item => (
                            <div className="row apartment-row-items">
                                <div className="col-4 apart-img-block">
                                    <Carousel>
                                        {/*{apartmentPhoto.map(imageItem => (*/}
                                        <img src={IMG} alt="Img 1" className="d-block ap-img"/>
                                        <img src={IMG} alt="Img 1" className="d-block ap-img"/>
                                        <img src={IMG} alt="Img 1" className="d-block ap-img"/>
                                        <img src={IMG} alt="Img 1" className="d-block ap-img"/>
                                        {/*))}*/}
                                    </Carousel>
                                </div>
                                <div className="col-6 apartment-info">
                                    <p>{item.name}</p>
                                    <p>{item.address}</p>
                                    {/*<p>{item.descriptions}</p>*/}
                                    <p>Количество спальных мест: {item.sleeping_places}</p>
                                </div>
                                <div className="col-2 apartment-price">
                                    <span>{item.price} за сутки</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
