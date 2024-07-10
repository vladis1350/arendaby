import React, {Fragment, useEffect, useState} from 'react';
import Navbar from "../../components/navbar/navbar";
import {useParams} from "react-router-dom";
import {api, createBooking} from "../../services/Api";
import {useSelector} from "react-redux";
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import './apartment.css';
import Loader from "../../components/Loader/ClipLoader";
import BookingCalendar from "../../components/BoockingCalendar/BookingCalendar";
import PopupComponent from "../../components/PopupComponent/PopupComponent"

export default function ViewApartmentDetail() {
    const {isLoggedIn, userId} = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const {apart_id} = useParams();
    const [apartment, setApartment] = useState();
    const [currentImage, setCurrentImage] = useState(0);
    const title = "Апартаменты";
    const [moved, setMoved] = useState(false);
    const [offset, setOffset] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [selectedDates, setSelectedDates] = useState([]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toISOString().slice(0, 19);
    };
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('overlay')) {
            setShowPopup(false);
        }
    };

    useEffect(() => {
        // document.title = apartment.name;
        fetchApartmentDetail()
    }, []);

    const changeImage = (index) => {
        setCurrentImage(index);
    };

    const fetchApartmentDetail = async () => {
        try {
            setLoading(true);
            api.get(`/api/apartment/${apart_id}`)
                .then(res => res.data)
                .then(data => setApartment(data))
                .catch(err => console.log(err))
            setLoading(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLeftArrowClick = () => {
        setCurrentImage((currentImage) => {
            if (currentImage === 0) {
                return currentImage = 0;
            } else
                setOffset(offset - 300)
            return currentImage - 1;
        });
    }

    const handleRightArrowClick = () => {
        setCurrentImage((currentImage) => {

            if (currentImage === apartment.images.length - 1) {
                return currentImage = 0;
            } else {
                setOffset(offset + 300)
                return currentImage + 1;
            }
        });
    }

    const handleMouseEnter = () => {
        setMoved(true);
    };

    const handleMouseLeave = () => {
        setMoved(false);
    };

    const openGuestBlock = () => {
        setShowPopup(true);
    }

    const closeGuestBlock = (adults, child) => {
        setShowPopup(false);
        setAdults(adults);
        setChildren(child);
    };

    const handleDateSelection = (start, end) => {
        setSelectedDates([start, end]);
    }

    const toBooking = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('client', userId);
        formDataToSend.append('apartment', apart_id);
        formDataToSend.append('start_booking', formatDate(selectedDates[0]));
        formDataToSend.append('end_booking', formatDate(selectedDates[1]));
        formDataToSend.append('isBooking', false);
        const response = await createBooking(formDataToSend);
        if (response.status === 201) {
            alert("Бронь создана!");
        } else {
            alert("Что то пошло не так!");
        }
    }

    return (
        <Fragment>
            <Navbar/>
            {apartment ? (
                <div className={"container"} onClick={handleOverlayClick}>
                    <div className={"row"}>
                        <div className={"col-8"}>
                            <div className="slider-container">
                                <div className={"header_view-apart"}>
                                    <h3><strong>{apartment.name}</strong></h3>
                                    <p>{apartment.street_name}, {apartment.number_house}, {apartment.number_block !== '-' ? apartment.number_block : ''}</p>
                                </div>
                                <div className={"main-image-block"} onMouseEnter={handleMouseEnter}
                                     onMouseLeave={handleMouseLeave}
                                     style={{cursor: 'pointer'}}>
                                    <FaChevronLeft className="arrow-apart-view arrow-left-apart-view"
                                                   onClick={handleLeftArrowClick} style={{
                                        transition: 'transform 0.3s',
                                        transform: moved ? 'translate(15px, 0px)' : 'translate(5px, 0px)',
                                    }}/>
                                    <div className="main-image">
                                        <img src={apartment.images[currentImage].image}
                                             alt="Main"
                                             className={"img-view-apartment"}/>
                                    </div>
                                    <FaChevronRight className="arrow-apart-view arrow-right-apart-view"
                                                    onClick={handleRightArrowClick} style={{
                                        transition: 'transform 0.3s',
                                        // visibility: "visible",
                                        transform: moved ? 'translate(-40px, 0px)' : 'translate(-30px, 0px)',
                                    }}/>
                                </div>
                                <div className="thumbnail-images">
                                    {apartment.images && apartment.images.length > 0 && (
                                        apartment.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image.image}
                                                alt={`Thumbnail ${index + 1}`}
                                                className={index === currentImage ? 'thumbnail-active' : 'thumbnail'}
                                                onClick={() => changeImage(index)}
                                            />
                                        )))}
                                </div>
                                <div className={"container"}>
                                    <div className={"row"}>
                                        <div className={"col-2"}><span>Этаж : {apartment.number_floor}</span></div>
                                        <div className={"col-2"}>
                                            <span>Лифт : {apartment.elevator ? " Есть" : " Нет"}</span></div>
                                        <div className={"col-2"}><span>Площадь : {apartment.square}</span></div>
                                        <div className={"col-2"}><span>Комнат : {apartment.count_room}</span></div>
                                    </div>
                                    <div className={"row"}>
                                        <div className={"col"}>
                                            <p>Спальных мест: {apartment.sleeping_places}</p>
                                            <p>Описание:</p>
                                            <p>{apartment.descriptions}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"col-4 apart-view-right-block"}>
                            <div className={"right-head-block"}>
                                <div className={"row"}>
                                    <div className={"col booking-calendar"}>
                                        <BookingCalendar getPeriod={handleDateSelection}/>
                                    </div>
                                </div>
                                <div className={"row row-guests"}>
                                    <div className={"col"}>
                                        <div className={"guests"} onClick={openGuestBlock}>
                                            <div className={"input-wrapper-guests"}>
                                                <span
                                                    className="info-guests">{adults} взрослых, {children === 0 ? "без детей" : children + " детей"}</span>
                                                <label>Гости</label>
                                            </div>
                                        </div>
                                        {showPopup && (<PopupComponent onClose={closeGuestBlock}
                                                                       count_guest={apartment.sleeping_places}/>)}
                                    </div>
                                </div>
                                <div className={"row row-booking"}>
                                    <div className={"col"}>
                                        <button type="button" onClick={toBooking} className="btn btn-success btn-booking">Забронировать
                                        </button>
                                    </div>
                                </div>
                                <div className={"row row-landlord"}>
                                    <div className={"col"}>
                                        <h4>Арендодатель:</h4>
                                        <h5>
                                            <strong>{apartment.landlord.profile.firstname} {apartment.landlord.profile.secondname}</strong>
                                        </h5>
                                        <p>{apartment.landlord.profile.phone}</p>
                                        <div className={"profile-image-block"}>
                                            <img
                                                src={apartment.landlord.profile.image}
                                                alt={`ФОТО`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loader loading={loading}/>
            )}
        </Fragment>
    )
        ;
};