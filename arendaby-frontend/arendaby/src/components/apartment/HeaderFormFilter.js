import React, {useState} from 'react';
import {api} from "../../services/Api";
import DataTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export default function HeaderFormFilter() {
    const [searchTerm, setSearchTerm] = useState('');
    const [apartment, setApartment] = useState([]);
    const [city, setCity] = useState([]);
    const [value, onChange] = useState(new Date());
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
        setIsSearchFocused(false);
    };

    const fetchApartments = async (e) => {
        setSearchTerm(e.target.value);
        let response = {data: null}
        response = await api
            .get(`/api/apartment/search/?term=${e.target.value}`)
            .catch(err => console.log(err));
        if (response === undefined) {
            return;
        }
        setApartment(response.data);
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
        setApartment(response.data);
    };

    return (
        <div className="conatainer apart-filter-panel">
            <div className="row">
                <div className="col-5">
                    <input className="form-control form-control-lg city-search"
                           type="Куда едем" placeholder="Курорт, город или адрес"
                           value={searchTerm} onChange={fetchApartments} onFocus={handleSearchFocus}
                           onBlur={handleSearchBlur}/>
                </div>
                <div className="col-6">
                    <div className="datatimePicker">
                        <DataTimePicker onChange={onChange} value={value}/>
                        <DataTimePicker onChange={onChange} value={value}/>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className={isSearchFocused ? "col-6 search-result-focused" : "col-6 search-result-normal"}>
                    <ul>
                        {apartment.map(result => (
                            <li key={result.id}><span>{result.name}</span></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
        ;
}