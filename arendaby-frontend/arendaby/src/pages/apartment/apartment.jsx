import React, {Fragment, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import api from "../../api";
import Menu from "../../components/navbar/navbar";
import "./apartment.css"
import {Carousel} from "../../components/carousel/Carousel";
import IMG from "./img/240.jpg";
import Filter from "../../components/Filter/Filter";

export default function Apartment() {
    const [apartment, setApartmentList] = useState([])
    const [apartmentPhoto, setApartmentPhotoList] = useState([])
    const {city} = useParams()

    useEffect(() => {
        getApartment(city);
        // getApartmentPhotos(apartment);
    }, []);


    const getApartmentPhotos = (apart_id) => {
        return api
            .get(`/api/apartment/city/get_photo/${apart_id}`)
            .then((res) => res.data)
            .then((data) => setApartmentPhotoList(data))
            .catch((err) => {
                console.log(err)
            });
    }

    const getApartment = (city) => {
        api
            .get(`api/apartment/city/${city}`)
            .then((res) => res.data)
            .then((data) => setApartmentList(data))
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <Fragment>
            <Menu/>
            <div className="apartment-top-block">
                <h1>Снять квартиру посуточно в {city}e</h1>
                <div className="col-lg">
                    <h2>{apartment.length} предложений</h2>
                </div>
                <div className="apart-filter-panel">
                    <div className="city-panel">

                    </div>
                </div>
            </div>
            <div className="container container-primary">
                <div className="row apartment-row-title">
                    <div className="col-lg">
                        <h4><strong>Найдём, где остановиться в {city}e: {apartment.length} вариантов</strong></h4>
                    </div>
                </div>
                <div className="row">
                    <Filter />
                    <div className="col-9">
                        {apartment.map(item => (
                            <div className="row apartment-row-items">
                                <div className="col-4 apart-img-block">
                                    <Carousel>
                                        {/*{apartmentPhoto.map(imageItem => (*/}
                                        <img src={IMG} alt="Img 1" className="d-block ap-img"/>
                                        {/*<img src={IMG} alt="Img 2" className="d-block ap-img"/>*/}
                                        {/*<img src={IMG} alt="Img 3" className="d-block ap-img"/>*/}
                                        {/*<img src={IMG} alt="Img 4" className="d-block ap-img"/>*/}
                                        {/*))*/}
                                        {/*}*/}
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

            {/*<div className="my-wrapper">*/
            }
            {/*    <div className="left-panel">*/
            }
            {/*        <h3>LEFT PANEL</h3>*/
            }
            {/*        <span>1</span>*/
            }
            {/*        <p>2</p>*/
            }
            {/*        <p>3</p>*/
            }
            {/*        <p>4</p>*/
            }
            {/*        <p>5</p>*/
            }
            {/*        <p>6</p>*/
            }
            {/*        <p>7</p>*/
            }
            {/*        <p>8</p>*/
            }
            {/*        <p>9</p>*/
            }
            {/*    </div>*/
            }
            {/*    <div className="main-panel">*/
            }
            {/*        <h1>{city}</h1>*/
            }
            {/*        <div className="card-list">*/
            }
            {/*            {apartment.map(item => (*/
            }
            {/*                <div className="">*/
            }
            {/*                    <p>{item.name}</p>*/
            }
            {/*                </div>*/
            }
            {/*            ))}*/
            }
            {/*        </div>*/
            }
            {/*    </div>*/
            }
            {/*</div>*/
            }
        </Fragment>
    )
}
