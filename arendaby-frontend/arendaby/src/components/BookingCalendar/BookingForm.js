import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {createBooking} from "../../services/Api";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const BookingForm = ({apart_id, user_id}) => {
    const {isLoggedIn, userId} = useSelector((state) => state.auth);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState('');
    const [bookedDates, setBookedDates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Получаем забронированные даты
        const fetchBookedDates = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/apartment/bookings/${apart_id}`);
                setBookedDates(response.data);
            } catch (err) {
                console.error("Ошибка при загрузке забронированных дат", err);
            }
        };

        fetchBookedDates();
    }, []);

    const isDateBlocked = (date) => {
         // Если нет забронированных дат, все даты доступны
        if (bookedDates.length === 0) return false;

        // Проверяем, попадает ли дата в диапазон забронированных дат
        return bookedDates.some(booking => {
            const from = booking.startDate;
            const to = booking.endDate;
            return date >= from && date <= to;
        });
    };

    const formatDate = (dateString) => {
        return format(dateString, 'yyyy-MM-dd');
    };

    const toBooking = async () => {
        if (isLoggedIn) {
            const formDataToSend = new FormData();
            formDataToSend.append('client', user_id);
            formDataToSend.append('apartment', apart_id);
            formDataToSend.append('start_booking', formatDate(startDate));
            formDataToSend.append('end_booking', formatDate(endDate));
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

    return (
        <div>
            <h1>Забронировать даты</h1>
            <form onSubmit={toBooking}>
                <div>
                    <label>Заезд:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        filterDate={!isDateBlocked}
                        placeholderText="Дата заселения"
                        minDate={new Date()} // Запрет выбора прошлых дат
                    />
                </div>
                <div>
                    <label>Отъезд:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        filterDate={!isDateBlocked}
                        placeholderText="Дата выселения"
                        minDate={new Date(startDate)} // Запрет выбора даты конца раньше даты начала
                    />
                </div>
                <button type="submit"
                        className="btn btn-success btn-booking">Забронировать
                </button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    );
};

export default BookingForm;