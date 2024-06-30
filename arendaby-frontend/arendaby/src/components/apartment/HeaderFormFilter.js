import React, {useState} from 'react';
import {api} from "../../services/Api";
import BookingCalendar from "../BoockingCalendar/BookingCalendar";
import {FaSearch} from 'react-icons/fa';

export default function HeaderFormFilter() {
    const [searchTerm, setSearchTerm] = useState('');
    const [city, setCity] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const searchInputStyle = {
        border: "none",
    }

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
        setIsSearchFocused(false);
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
                           value={searchTerm} onChange={fetchCity} onFocus={handleSearchFocus}
                           onBlur={handleSearchBlur}/>
                        <label>Курорт, город или адрес</label>
                    </div>
                </div>
                <div className="data-wrapper">
                        <BookingCalendar/>
                </div>
                <div className={"guests"}>
                    <div className={"input-wrapper-guests"}>
                        <span className="info-guests">2 взрослых, без детей</span>
                        <label>Гости</label>
                    </div>
                </div>
                <div className={"col-2 fa-search-block"}>
                    <div className={"search-button"}>
                        <label>Найти</label>
                        <FaSearch size={30} className={"fa-search"}/>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className={isSearchFocused ? "col-6 search-result-focused" : "col-6 search-result-normal"}>
                    <ul>
                        {city.map(result => (
                            <li key={result.id}><span>{result.name}</span></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}