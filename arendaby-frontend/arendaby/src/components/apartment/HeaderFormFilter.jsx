import React, {useEffect, useRef, useState} from 'react';
import {api} from "../../services/Api";
import BookingCalendar from "../BookingCalendar/BookingCalendar";
import {FaSearch} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import SelectGuestsComponent from "../PopupComponent/SelectGuestsComponent";

export default function HeaderFormFilter() {
    const [searchTerm, setSearchTerm] = useState('');
    const [city, setCity] = useState([]);
    const [selectedCity, setSelectedCity] = useState();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const navigate = useNavigate();
    const [guest, setGuest] = useState(1);
    const [guestAdult, setGuestAdult] = useState(1);
    const [guestChild, setGuestChild] = useState(0);
    const [hideGuestBlock, setHideGuestBlock] = useState(false);
    const blockRef = useRef(null);


    const searchInputStyle = {
        border: "none",
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50 && hideGuestBlock) {
                setHideGuestBlock(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hideGuestBlock]);

    const showGuestsBlock = () => {
        setHideGuestBlock(!hideGuestBlock)
    }

    const handleDateSelection = (start, end) => {
        setSelectedDates([start, end]);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toISOString().slice(0, 19);
    };

    const redirectTo = () => {
        setGuest(guestAdult + guestChild);
        if (city && selectedDates.length !== 0) {
            navigate(`/apartment-filter?city=${selectedCity.id}&start_booking=${formatDate(selectedDates[0])}&end_booking=${formatDate(selectedDates[1])}&guests=${guestAdult+guestChild}`);
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

    const handleAdults = (adultValue) => {
        setGuestAdult(adultValue);
    }

    const handleChild = (childValue) => {
        setGuestChild(childValue);
        setHideGuestBlock(!hideGuestBlock)
    }

    return (
        <div ref={blockRef} className="conatainer apart-filter-panel">
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
                    <div className={"input-wrapper-guests"} onClick={showGuestsBlock}>
                        <span
                            className="info-guests">{guestAdult} взрослых, {guestChild > 0 ? guestChild + " детей" : "без детей"}</span>
                        <label>Гости</label>
                    </div>
                    <SelectGuestsComponent hide={hideGuestBlock} guestAdults={handleAdults}
                                           guestChildren={handleChild}/>
                </div>
                <div className={"col-2 fa-search-block"}>
                    <div onClick={redirectTo} className={"search-button"}>
                        <label>Найти</label>
                        <FaSearch size={30} className={"fa-search"}/>
                    </div>
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