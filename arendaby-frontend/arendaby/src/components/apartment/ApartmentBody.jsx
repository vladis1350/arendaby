import {Link} from "react-router-dom";
import {Carousel} from "../carousel/Carousel";
import React, {useEffect, useState} from "react";
import {FaRubleSign, FaStar} from 'react-icons/fa';

const ApartmentBody = ({apartmentList, refreshKey}) => {

    useEffect(() => {

    }, [apartmentList]);

    return (
        <div className="col-9 center-apart-block">
            {apartmentList.map(item => (
                <Link to={`/apartment/${item.id}`} className="link-no-decoration">
                    <div key={refreshKey} className="row apartment-row-items">
                        <div className="col-4 apart-img-block">
                            <Carousel PAGE_WIDTH={305} heightPage={"230px"} widthPage={"305px"}>
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
                            <p className={"sleeping_places"}>
                                <span>Спальных мест: {item.sleeping_places}</span>
                                <span>Комнат: {item.count_room}</span>
                            </p>
                            <p className={"apart-address"}>{item.street_name + " " + item.number_house}</p>
                        </div>
                        <div className="col-2 apartment-price">
                            <p className={"apart-rating"}>{item.rating.length === 0 ? 0 : item.rating.reduce((acc, rating) => acc + rating.rating, 0)}
                                <span><FaStar/></span></p>
                            <p className={"apart-comment"}>{item.comment.length}<span>Отзывов</span></p>
                            <p className={"apart-price"}>{item.price} <FaRubleSign/><span>за сутки</span></p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default ApartmentBody;