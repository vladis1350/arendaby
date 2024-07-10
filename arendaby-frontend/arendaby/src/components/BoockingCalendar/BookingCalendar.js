import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {add, format} from 'date-fns';
import ruLocale from 'date-fns/locale/ru'; // импорт локали для русского языка


const BookingCalendar = ({getPeriod}) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const currentDate = new Date();
    const tomorrowDate = add(currentDate, {days: 1});
    const formattedCurrentDate = format(currentDate, 'd MMMM, EE', {locale: ruLocale});
    const formattedTomorrowDate = format(tomorrowDate, 'd MMMM, EE', {locale: ruLocale});

    const onSelectDates = (startDate, endDate) => {
        getPeriod(startDate, endDate);
    }

    const handleSelectDate = dates => {
        const [start, end] = dates;
        // const startFormat = format(start,  'd MMMM, EE', { locale: ruLocale })
        // const endFormat = format(end,  'd MMMM, EE', { locale: ruLocale })
        setStartDate(start);
        setEndDate(end);
        onSelectDates(start, end);
    };

    return (
        <div className={"row-data"}>
            <div className={"data-field"}>
                <label>Заезд</label>
                <DatePicker className={"date-picker-style"}
                            selected={startDate}
                            onChange={date => handleSelectDate([date, endDate])}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText={formattedCurrentDate}
                />
            </div>
            <div className={"data-field"}>
                <label>Отъезд</label>
                <DatePicker className={"date-picker-style"}
                            selected={endDate}
                            onChange={date => handleSelectDate([startDate, date])}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            placeholderText={formattedTomorrowDate}
                />
            </div>
        </div>
    );
};

export default BookingCalendar;