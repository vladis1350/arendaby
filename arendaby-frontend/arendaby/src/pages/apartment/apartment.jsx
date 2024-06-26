import React, {Fragment, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {api} from "../../services/Api";
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
                    <div className="col-9 center-apart-block">
                        {apartment.map(item => (
                            <Link to={`/apartment/${item.id}`}>
                                <div className="row apartment-row-items">
                                    <div className="col-4 apart-img-block">
                                        <Carousel>
                                            {item.images && item.images.length > 0 && (
                                                item.images.map((image, index) => (
                                                    // alert(image.image)
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
