import React, {Fragment, useEffect, useState} from "react";
// import FormatDate from "../FormatDate";
import {Carousel} from "../carousel/Carousel";
import {FaRubleSign} from 'react-icons/fa'
import {Link} from "react-router-dom";
import {differenceInDays} from 'date-fns';
import {ReadMore} from "../../pages/apartment/ReadMore";
import {deleteBooking} from "../../services/Api";

const UserItemReservation = ({reservation, onDelete}) => {
    const [startBooking, setStartBooking] = useState("");
    const [endBooking, setEndBooking] = useState("");
    const [days, setDays] = useState("");
    const [bookings, setBookings] = useState(reservation);

    const handleDelete = async (bookingId) => {
        // Здесь можно добавить логику для подтверждения удаления
        const confirmed = window.confirm('Вы уверены, что хотите удалить это бронирование?');
        if (confirmed) {
            const response = await deleteBooking(bookingId);
            if (response.status === 204) {
                onDelete(reservation.id);
            }
        }
    };

    const setDates = () => {
        const start_parts = reservation.start_booking.split("-");
        const end_parts = reservation.end_booking.split("-");
        setStartBooking(new Date(start_parts[2], start_parts[1] - 1, start_parts[0]));
        setEndBooking(new Date(end_parts[2], end_parts[1] - 1, end_parts[0]));
        setDays(differenceInDays(endBooking, startBooking));
    }

    useEffect(() => {
        setDates();
    }, [days]);

    return (
        <Fragment>
            <div className="card mb-3 user-items">
                <h4 className="card-header user-item-header">{reservation.apartment.name}</h4>
                <div className="card-body">
                    <h5 className="card-title"></h5>
                    <h6 className="card-subtitle text-muted">Даты бронирования:</h6>
                    <span className="card-subtitle text-muted">{reservation.start_booking} - </span>
                    <span className="card-subtitle text-muted">{reservation.end_booking}</span>
                </div>
                <Carousel PAGE_WIDTH={600} widthPage={"100%"} heightPage={"350px"}>
                    {reservation.apartment.images && reservation.apartment.images.length > 0 && (
                        reservation.apartment.images.map((image, index) => (
                                <img key={index} src={image.image} alt={`Image ${index}`}
                                     className="d-block ap-img"/>
                            )
                        ))}
                </Carousel>
                <div className="card-body">
                    <p className="card-text">
                        <ReadMore text={reservation.apartment.descriptions} maxLength={150}/>
                    </p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><strong>Цена
                        за {days} дней: {days * reservation.apartment.price}</strong> <FaRubleSign/></li>
                    <li className="list-group-item"><h6 className="card-subtitle text-muted">Даты бронирования:</h6>
                        <span className="card-subtitle text-muted">{reservation.start_booking} - </span>
                        <span className="card-subtitle text-muted">{reservation.end_booking}</span></li>
                    <li className="list-group-item">Количество комнат: {reservation.apartment.count_room}</li>
                    <li className="list-group-item">Количество спальных
                        мест: {reservation.apartment.sleeping_places}</li>
                </ul>
                <div className="card-body">
                    <Link to={`/apartment/${reservation.apartment.id}`} className="card-link">Смотреть
                        карточку</Link>
                    <a href="#" onClick={() => handleDelete(reservation.id)} className="card-link">Отменить
                        бронь</a>
                </div>
                <div className="card-footer text-muted">
                    2 days ago
                </div>
            </div>
        </Fragment>
    );
}

export default UserItemReservation;