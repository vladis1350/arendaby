import React, {Fragment, useEffect, useState} from 'react';
import Navbar from "../../components/navbar/navbar";
import {useNavigate, useParams} from "react-router-dom";
import {
    api,
    checkUserActivity,
    createBooking,
    createComment,
    getRating,
    saveUserActivity,
    updateUserFavorite
} from "../../services/Api";
import {useSelector} from "react-redux";
import {FaCalendar, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart, FaRubleSign, FaStar} from 'react-icons/fa';
import './apartment.css';
import Loader from "../../components/Loader/ClipLoader";
import BookingForm from "../../components/BookingCalendar/BookingForm";
import PopupComponent from "../../components/PopupComponent/PopupComponent";
import Rating from "../../components/rating/Rating";
import {differenceInDays, format} from 'date-fns';
import {ReadMore} from "./ReadMore";

export default function ViewApartmentDetail() {
    const {isLoggedIn, userId, token} = useSelector((state) => state.auth);
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
    const [days, setDays] = useState(0);
    const [isVisited, setIsVisited] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('overlay')) {
            setShowPopup(false);
        }
    };

    const handleSelectedDates = (start, end) => {
        setStartBooking(start);
        setEndBooking(end);
        setDays(differenceInDays(end, start));
    }

    useEffect(() => {
        // document.title = apartment.name;
        fetchApartmentDetail();
        checkUserRating();

        const intervalId = setInterval(() => {
            addApartmentToViewed();
            fetchApartmentDetail();
            checkUserRating();
        }, 10000);

        // Очищаем интервал при размонтировании компонента
        return () => clearInterval(intervalId);
    }, [rating, isVisited, isFavorite]);

    const addApartmentToViewed = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response_check = await checkUserActivity(userId, apart_id);
                if (response_check.status === 200) {
                    if (response_check.data.length === 0) {
                        const formDataToSend = new FormData();
                        formDataToSend.append('user', userId);
                        formDataToSend.append('apartment', apart_id);
                        formDataToSend.append('is_favorite', isFavorite);
                        const response = await saveUserActivity(formDataToSend);
                        if (response.status === 201) {
                            setIsVisited(true); // Устанавливаем, что пользователь просмотрел это
                        }
                    }
                }
            } catch (error) {
                console.error('Ошибка при добавлении в список просмотренных:', error);
            }
        }
    };

    const updateApartmentToViewed = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response_check = await checkUserActivity(userId, apart_id);
                if (response_check.status === 200) {
                    if (response_check.data.length !== 0) {
                        const formDataToSend = new FormData();
                        formDataToSend.append('user', userId);
                        formDataToSend.append('apartment', apart_id);
                        if (response_check.data[0].is_favorite === false) {
                            formDataToSend.append('is_favorite', true);
                            setIsFavorite(true);
                        } else if (response_check.data[0].is_favorite === true) {
                            formDataToSend.append('is_favorite', false);
                            setIsFavorite(false);
                        }
                        const response = await updateUserFavorite(response_check.data[0].id, formDataToSend);
                    }
                }
            } catch (error) {
                console.error('Ошибка при добавлении в список просмотренных:', error);
            }
        } else {
            navigate("/login");
        }
    };

    const changeImage = (index) => {
        setCurrentImage(index);
    };

    const checkUserRating = async () => {
        try {
            const response_check = await checkUserActivity(userId, apart_id);
            if (response_check.status === 200) {
                if (response_check.data.length !== 0) {
                    setIsFavorite(response_check.data[0].is_favorite);
                }
            }
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
        if (token) {
            try {
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
            } catch (error) {
                console.log(error);
                setCommentMessage("Комментарий не был добавлен!");
            }
        } else {
            navigate("/login");
        }
    }

    const toBooking = async () => {
        if (token) {
            try {
                const formDataToSend = new FormData();
                formDataToSend.append('client', userId);
                formDataToSend.append('apartment', apart_id);
                formDataToSend.append('start_booking', formatDate(start_booking));
                formDataToSend.append('end_booking', formatDate(end_booking));
                formDataToSend.append('isBooking', false);
                const response = await createBooking(formDataToSend);
                if (response.status === 201) {
                    alert("Бронь создана!");
                    navigate("/profile");
                } else {
                    alert("Ошибка бронирования, попробуйте позже!");
                }
            } catch (error) {
                console.log(error);
                alert("Ошибка бронирования, попробуйте позже!");
            }
        } else {
            navigate("/login");
        }
    }

    const handleCommentField = (e) => {
        setUserComment(e.target.value);
    }

    const calculate_discount = () => {
        if (days < 4) {
            return apartment.price;
        } else if (days >= 4 && days <= 7) {
            return apartment.price * 0.90;
        } else if (days >= 8 && days <= 14) {
            return apartment.price * 0.85;
        } else {
            return apartment.price * 0.80;
        }
    }

    return (
        <Fragment>
            <Navbar/>
            {apartment ? (
                <div className={"container-xl"} onClick={handleOverlayClick}>
                    <div className={"row"}>
                        <div className={"col-8"}>
                            <div className="slider-container">
                                <div className={"header_view-apart"}>
                                    <h3><strong>{apartment.name}</strong></h3>
                                    <p className={"address-detail"}>
                                        <strong><FaStar
                                            style={{color: "#FFD700"}}/> {apartment.rating.length === 0 ? 0 : apartment.rating.reduce((acc, rating) => acc + rating.rating, 0)}
                                        </strong>&nbsp;&nbsp;&nbsp;
                                        <span>{apartment.comment.length} {declineComment(apartment.comment.length)}</span>&nbsp;&nbsp;&nbsp;
                                        {apartment.street_name}, {apartment.number_house}, {apartment.number_block !== '-' ? apartment.number_block : ''}
                                    </p>
                                </div>
                                <div className={"favorite-block"}>
                                    <span onClick={() => updateApartmentToViewed()}
                                          className={"favorite"}>
                                        {isFavorite ? <FaHeart size={22} style={{color: "red"}}/> : (
                                            <FaRegHeart/>)}&nbsp;&nbsp;В избранное</span>
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
                                        <div className={"col-8"}>
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
                                <div className={"row"}>
                                    <div className={"col-8"}>
                                        <p className={"price"}>Цена за сутки:</p>
                                    </div>
                                    <div className={"col-4"}>
                                        <p className={"price"}>{apartment.price}<FaRubleSign/></p>
                                    </div>
                                </div>
                                <div className={"row"}>
                                    <div className={"col-8"}>
                                        <p className={"price"}>Цена
                                            за {days} дней с учетом скидки:</p>
                                    </div>
                                    <div className={"col-4"}>
                                        <p className={"price"}>{Math.round(calculate_discount() * days * 100) / 100}<FaRubleSign/>
                                        </p>
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