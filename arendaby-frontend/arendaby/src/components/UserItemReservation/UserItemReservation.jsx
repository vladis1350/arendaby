import React, {Fragment} from "react";
import FormatDate from "../FormatDate";
import {Carousel} from "../carousel/Carousel";
import {FaRubleSign} from 'react-icons/fa'
import {Link} from "react-router-dom";

const UserItemReservation = ({reservation}) => {
    const start = new Date(reservation.start_booking);
    const end = new Date(reservation.end_booking);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / 1000 / 60 / 60 / 24);

    return (
        <Fragment>
            <div className="card mb-3">
                <h3 className="card-header">{reservation.apartment.name}</h3>
                <div className="card-body">
                    <h5 className="card-title"></h5>
                    <h6 className="card-subtitle text-muted">Даты бронирования:</h6>
                    <span className="card-subtitle text-muted">{<FormatDate
                        dateString={reservation.start_booking}/>} - </span>
                    <span className="card-subtitle text-muted">{<FormatDate
                        dateString={reservation.end_booking}/>}</span>
                </div>
                <Carousel>
                    {reservation.apartment.images && reservation.apartment.images.length > 0 && (
                        reservation.apartment.images.map((image, index) => (
                                <img key={index} src={image.image} alt={`Image ${index}`}
                                     className="d-block ap-img"/>
                            )
                        ))}
                </Carousel>
                <div className="card-body">
                    <p className="card-text">{reservation.apartment.descriptions}</p>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><strong>Цена
                        за {diffDays} дней: {diffDays * reservation.apartment.price}</strong> <FaRubleSign/></li>
                    <li className="list-group-item"><h6 className="card-subtitle text-muted">Даты бронирования:</h6>
                        <span className="card-subtitle text-muted">{<FormatDate
                            dateString={reservation.start_booking}/>} - </span>
                        <span className="card-subtitle text-muted">{<FormatDate
                            dateString={reservation.end_booking}/>}</span></li>
                    <li className="list-group-item">Количество комнат: {reservation.apartment.count_room}</li>
                    <li className="list-group-item">Количество спальных
                        мест: {reservation.apartment.sleeping_places}</li>
                </ul>
                <div className="card-body">
                    <Link to={`/apartment/${reservation.apartment.id}`} className="card-link">Смотреть
                        карточку</Link>
                    <a href="#" className="card-link">Отменить бронь</a>
                </div>
                <div className="card-footer text-muted">
                    2 days ago
                </div>
            </div>
        </Fragment>
    );
}

export default UserItemReservation;