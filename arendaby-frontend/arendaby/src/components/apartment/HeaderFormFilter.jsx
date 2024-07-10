import React, {useState} from 'react';
import {api} from "../../services/Api";
import BookingCalendar from "../BoockingCalendar/BookingCalendar";
import {FaSearch} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';

export default function HeaderFormFilter() {
    const [searchTerm, setSearchTerm] = useState('');
    const [city, setCity] = useState([]);
    const [selectedCity, setSelectedCity] = useState();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const navigate = useNavigate();

    const searchInputStyle = {
        border: "none",
    }

    const handleDateSelection = (start, end) => {
        setSelectedDates([start, end]);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toISOString().slice(0, 19);
    };

    const redirectTo = () => {
        if (city && selectedDates.length !== 0) {
            navigate(`/apartment-filter?city=${selectedCity.id}&start_booking=${formatDate(selectedDates[0])}&end_booking=${formatDate(selectedDates[1])}`);
        } else {
            navigate(`/apartment/city/${selectedCity.id}`);
        }
    }

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
        setIsSearchFocused(false);
    };

    const handleSelectCity = (item) => {
        setSearchTerm(item.name);
        setSelectedCity(item);
        handleSearchBlur();
    };

    const fetchCity = async (e) => {
        setSearchTerm(e.target.value);
        let response = {data: null}
        response = await api
            .get(`/api/city/search/?term=${e.target.value}`)
            .catch(err => console.log(err));
        if (response === undefined) {
            return;
        }
        setCity(response.data);
    };

    return (
        <div className="conatainer apart-filter-panel">
            <div className="row">
                <div className="col-4 col-3-change">
                    <div className={"input-wrapper"}>
                        <input className="form-control me-md-3 city-search"
                               type="text" placeholder="Куда едем"
                               style={searchInputStyle}
                               value={searchTerm} onChange={fetchCity} onFocus={handleSearchFocus}/>
                        <label>Курорт, город или адрес</label>
                    </div>
                </div>
                <div className="data-wrapper">
                    <BookingCalendar getPeriod={handleDateSelection}/>
                </div>
                <div className={"guests"}>
                    <div className={"input-wrapper-guests"}>
                        <span className="info-guests">2 взрослых, без детей</span>
                        <label>Гости</label>
                    </div>
                </div>
                <div className={"col-2 fa-search-block"}>
                    <div onClick={redirectTo} className={"search-button"}>
                        <label>Найти</label>
                        <FaSearch size={30} className={"fa-search"}/>
                    </div>
                    {/*<div onClick={redirectTo} className={"search-button"}>*/}
                    {/*    <label>Найти</label>*/}
                    {/*    <FaSearch size={30} className={"fa-search"}/>*/}
                    {/*</div>*/}
                </div>
            </div>
            <div className="row">
                <div className={isSearchFocused ? "col-6 search-result-focused" : "col-6 search-result-normal"}>
                    <ul>
                        {city.map(result => (
                            <li key={result.id} onClick={() => handleSelectCity(result)}><span>{result.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}