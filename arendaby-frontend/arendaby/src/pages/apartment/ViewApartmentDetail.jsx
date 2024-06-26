import React, {Fragment, useEffect, useState} from 'react';
import './apartment.css';
import Navbar from "../../components/navbar/navbar";
import {useParams} from "react-router-dom";
import {getApartmentById} from "../../services/Api";
import {useSelector} from "react-redux";
import Loader from "../../components/Loader/ClipLoader";

export default function ViewApartmentDetail() {
    const {isLoggedIn} = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const {apart_id} = useParams();
    const [apartment, setApartment] = useState();
    const [currentImage, setCurrentImage] = useState(0);
    const title = "Апартаменты";

    useEffect(async () => {
        fetchApartmentDetail()
    }, []);

    const changeImage = (index) => {
        setCurrentImage(index);
    };

    const fetchApartmentDetail = async () => {
        try {
            setLoading(true);
            const response = await getApartmentById(apart_id);
            setApartment(response.data)
            setLoading(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <Fragment>
            <Navbar/>
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col"}>
                        {apartment ? (
                            <div>
                                <div className="slider-container">
                                    <div className="main-image">
                                        <img src={apartment.images[currentImage]} alt="Main"/>
                                    </div>
                                    <div className="thumbnail-images">
                                        {apartment.images && apartment.images.length > 0 && (
                                            apartment.images.map((image, index) => (
                                                alert(image.image)
                                                // <img
                                                //     key={index}
                                                //     src={image}
                                                //     alt={`Thumbnail ${index + 1}`}
                                                //     className={index === currentImage ? 'thumbnail-active' : 'thumbnail'}
                                                //     onClick={() => changeImage(index)}
                                                // />
                                            )))}
                                    </div>
                                </div>
                                {/*<Carousel>*/}
                                {/*    {apartment.images && apartment.images.length > 0 && (*/}
                                {/*        apartment.images.map((image, index) => (*/}
                                {/*                // <img key={index} src={} alt={`Image ${index}`}*/}
                                {/*                //      className="d-block ap-img"/>*/}
                                {/*                alert(image.image)*/}
                                {/*            )*/}
                                {/*        ))}*/}
                                {/*</Carousel>*/}
                            </div>
                        ) : (
                            <Loader loading={loading}/>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    );
};