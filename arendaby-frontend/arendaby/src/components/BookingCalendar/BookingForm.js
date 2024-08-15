import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {format} from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Loader from "../../components/Loader/ClipLoader";

const BookingForm = ({apart_id, selectedDates}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookedDates, setBookedDates] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]); // Хранит диапазон выбранных дат
    const [availableDates, setAvailableDates] = useState(true); // Состояние для отображения доступности

    useEffect(() => {
        // Получаем забронированные даты
        const fetchBookedDates = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/apartment/bookings/${apart_id}`);
                setBookedDates(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Ошибка при загрузке забронированных дат", err);
                setLoading(false)
            }
        };

        fetchBookedDates();
    }, [dateRange]);

    const isDateAvailable = (date) => {
        const bookings = [];
        bookedDates.map(b => {
            let start_date = b.start_booking.split("-");
            let end_date = b.end_booking.split("-");
            bookings.push([new Date(start_date[2], start_date[1] - 1, start_date[0]), new Date(end_date[2], end_date[1] - 1, end_date[0])]);
        });
        return !bookings.some((booking) =>
            isDateInRange(date, booking)
        );
    };

    const handleDateChange = (range) => {
        const [start, end] = range;

        // Проверяем доступность обеих дат в диапазоне
        if (start && end) {
            const allDatesAvailable = Array.from({length: (end - start) / (1000 * 60 * 60 * 24) + 1}, (_, i) => new Date(start.getTime() + i * (1000 * 60 * 60 * 24)))
                .every(date => isDateAvailable(date));

            if (allDatesAvailable) {
                setDateRange(range);
                selectedDates(start, end);
                setAvailableDates(true);
            } else {
                alert('Один или несколько дней в выбранном диапазоне уже заняты. Пожалуйста, выберите другой диапазон.');
                setAvailableDates(false);
            }
        } else {
            setDateRange(range); // Если диапазон не полный, просто обновляем состояние
        }
    };

    const isDateInRange = (date, [start, end]) => {
        return date >= start && date <= end;
    };

    if (loading) {
        return <Loader loading={loading}/>;
    }

    return (
        <div>
            <h1>Забронировать даты</h1>
            <div>
                <Calendar
                    onChange={handleDateChange}
                    value={dateRange}
                    selectRange={true}                                // Включение выбора диапазона
                    tileDisabled={({date}) => !isDateAvailable(date)} // Отключаем занятые даты
                    minDate={new Date()} // Запрет выбора прошлых дат*/}
                />
            </div>
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default BookingForm;