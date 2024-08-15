import React, {Fragment, useEffect, useState} from 'react';
import Navbar from "../../components/navbar/navbar";
import {useNavigate, useParams} from "react-router-dom";
import {api, createBooking, createComment, getRating} from "../../services/Api";
import {useSelector} from "react-redux";
import {FaCalendar, FaChevronLeft, FaChevronRight, FaStar} from 'react-icons/fa';
import './apartment.css';
import Loader from "../../components/Loader/ClipLoader";
import BookingForm from "../../components/BookingCalendar/BookingForm";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import Rating from "../../components/rating/Rating";
import {format} from 'date-fns';
import {ReadMore} from "./ReadMore";

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
    const [userComment, setUserComment] = useState("");
    const navigate = useNavigate();
    const [commentMessage, setCommentMessage] = useState("");
    const [rating, setRating] = useState(0);
    const [start_booking, setStartBooking] = useState();
    const [end_booking, setEndBooking] = useState();

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('overlay')) {
            setShowPopup(false);
        }
    };

    const handleSelectedDates = (start, end) => {
        setStartBooking(start);
        setEndBooking(end);
    }

    useEffect(() => {
        // document.title = apartment.name;
        fetchApartmentDetail();
        checkUserRating();

        const intervalId = setInterval(() => {
            fetchApartmentDetail();
            checkUserRating();
        }, 10000); // 10000 мс = 10 секунд

        // Очищаем интервал при размонтировании компонента
        return () => clearInterval(intervalId);
    }, [rating]);

    const changeImage = (index) => {
        setCurrentImage(index);
    };

    const checkUserRating = async () => {
        try {
            const response = await getRating(apart_id, userId);
            if (response.status === 200) {
                setRating(response.data.rating)
            } else {
                setRating(0)
            }
        } catch (error) {
            console.error('Ошибка получения оценки:', error);
        }
    }

    const formatDate = (date) => {
        return format(date, 'yyyy-MM-dd');
    };

    const fetchApartmentDetail = async () => {
        try {
            api.get(`/api/apartment/${apart_id}`)
                .then(res => res.data)
                .then(data => setApartment(data))
                .catch(err => console.log(err))
            await getRating(apart_id, userId);
        } catch (error) {
            console.error(error);
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

    const declineGuest = (count) => {
        if (count % 10 === 1 && count % 100 !== 11) {
            return 'гость';
        } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
            return 'гостя';
        } else {
            return 'гостей';
        }
    };

    const declineComment = (count) => {
        if (count % 10 === 1 && count % 100 !== 11) {
            return 'отзыв';
        } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
            return 'отзыва';
        } else {
            return 'отзывов';
        }
    };

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

    const saveComment = async () => {
        if (isLoggedIn) {
            const formDataToSend = new FormData();
            formDataToSend.append('client', userId);
            formDataToSend.append('apartment', apart_id);
            formDataToSend.append('comment', userComment);
            const response = await createComment(formDataToSend);
            if (response.status === 201) {
                setCommentMessage("Комментарий успешно добавлен!");
                fetchApartmentDetail();
            } else {
                setCommentMessage("Комментарий не был добавлен!");
            }
        } else {
            navigate("/login");
        }
    }

    const toBooking = async () => {
        alert(start_booking)
        alert(end_booking)
        if (isLoggedIn) {
            const formDataToSend = new FormData();
            formDataToSend.append('client', userId);
            formDataToSend.append('apartment', apart_id);
            formDataToSend.append('start_booking', formatDate(start_booking));
            formDataToSend.append('end_booking', formatDate(end_booking));
            formDataToSend.append('isBooking', false);
            const response = await createBooking(formDataToSend);
            if (response.status === 201) {
                alert("Бронь создана!");
            } else {
                alert("Что то пошло не так!");
            }
        } else {
            navigate("/login");
        }
    }

    const handleCommentField = (e) => {
        setUserComment(e.target.value);
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
                                    <div className={"row row-params"}>
                                        <span>{apartment.sleeping_places} {declineGuest(apartment.sleeping_places)}</span>
                                        <span>Этаж: {apartment.number_floor} из {apartment.count_floor}</span>
                                        <span>Лифт: {apartment.elevator ? " Есть" : " Нет"}</span>
                                        <span>Площадь: {apartment.square} м<sup>2</sup></span>
                                        {/*<div className={"col-2"}><span>Комнат : {apartment.count_room}</span></div>*/}
                                    </div>
                                    <div className={"row"}>
                                        <div className={"col"}>
                                            <h5><strong>Спальных мест: {apartment.sleeping_places}</strong></h5>
                                            <div>
                                                <ReadMore text={apartment.descriptions} maxLength={500}/>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                </div>
                            </div>
                        </div>
                        <div className={"col-4 apart-view-right-block"}>
                            <div className={"right-head-block"}>
                                <div className={"row"}>
                                    <div className={"col booking-calendar"}>
                                        <BookingForm apart_id={apart_id} user_id={userId}
                                                     selectedDates={handleSelectedDates}/>
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
                                        <button type="button" onClick={toBooking}
                                                className="btn btn-success btn-booking">Забронировать
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
                    <div className={"row"}>
                        <div className={"col-8 comment-block"}>
                            <div className={"row"}>
                                <div className={"col"}>
                                    <div className={"rating-comment"}>
                                        <h4><strong>Оценка гостей &nbsp;&nbsp;&nbsp;<FaStar
                                            style={{color: "#FFD700"}}/> {apartment.rating.length === 0 ? 0 : apartment.rating.reduce((acc, rating) => acc + rating.rating, 0)}
                                        </strong></h4>
                                        <span>{apartment.comment.length} {declineComment(apartment.comment.length)}</span>
                                    </div>
                                    <Rating apartmentId={apart_id} userRating={rating}/>
                                    <hr/>
                                    <h4>ОТЗЫВЫ</h4>
                                    <label>{apartment.comment.length !== 0 ? "Напишите свой отзыв:" : "Напиши свой отзыв. Будь первым!"} </label><br/>
                                    <textarea rows="5" cols="70" value={userComment} onChange={handleCommentField}/>
                                    <br/>
                                    <button type="button" onClick={saveComment}>Отправить</button>
                                    <span>{commentMessage !== "" ? commentMessage : ""}</span>
                                </div>
                            </div>
                            {apartment.comment.length !== 0 ? (apartment.comment.slice().reverse().map(comment => (
                                    <div className={"row row-comment"}>
                                        <div className={"col-2"}>
                                            <div className={"user_photo"}>
                                                <img src={comment.client.profile.image} alt={"User photo"}/>
                                            </div>
                                        </div>
                                        <div className={"col"}>
                                            <div className={"user-comment"}>
                                                <span>{comment.client.profile.firstname + " " + comment.client.profile.secondname}</span>
                                                <p><FaCalendar/> {formatDate(comment.created_at)}</p>
                                                <p>{comment.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={"no-comment"}>
                                    <p>Нет отзывов</p>
                                </div>
                            )}
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