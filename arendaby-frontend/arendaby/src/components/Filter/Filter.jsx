import "../Filter/Filter.css"
import React, {useEffect, useState} from "react";
import {api} from "../../services/Api";
import 'react-input-range/lib/css/index.css';
import {FaRubleSign} from "react-icons/fa";
import {useParams} from "react-router-dom";


export default function Filter({cityId}) {
    const [apartment_group, setApartmentGroup] = useState([]);
    const [allFilters, setAllFilters] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [minRange, setMinRange] = useState(2000); // Начальное значение "от"
    const [maxRange, setMaxRange] = useState(8000); // Начальное значение "до"

    // Обработка изменения ползунка "от"
    const handleMinChange = (e) => {
        const value = Math.min(e.target.value, maxRange); // Условие для минимального значения
        setMinRange(value);
    };

    // Обработка изменения ползунка "до"
    const handleMaxChange = (e) => {
        const value = Math.max(e.target.value, minRange); // Условие для максимального значения
        setMaxRange(value);
    };

    const handleSelectGroup = (value) => {
        if (selectedGroup.includes(value)) {
            setSelectedGroup(selectedGroup.filter(item => item !== value));
        } else {
            setSelectedGroup([...selectedGroup, value]);
        }
    }

    const showVariables = async () => {
        const response = await fetch(`http://127.0.0.1:8000/api/apartment/filter-by-param/?city=${cityId}&price_min=${minRange}&price_max=${maxRange}&group_ids=${selectedGroup.join('&group_ids=')}`);
        const apartments = await response.json();
        alert(`Найдено ${apartments.length} вариантов`);
    }

    const openAllFilter = () => {
        setAllFilters(!allFilters);
    }

    useEffect(() => {
        getApartmentGroup();
    }, []);

    const getApartmentGroup = () => {
        api.get("/api/apartment/groups/")
            .then(res => setApartmentGroup(res.data))
            .catch(err => {
                console.log(err)
            });
    };

    return (
        <div className="col left-block">
            <div className={""}>
                <div className="placement">
                    <span><strong>Варианты размещения:</strong></span>
                </div>
                {!allFilters ? (apartment_group.slice(0, 5).map(item => (
                    <p key={item.id}><input type="checkbox"
                                            checked={selectedGroup.includes(item.id)}
                                            onChange={() => handleSelectGroup(item.id)}/> {item.group_name}</p>
                ))) : apartment_group.map(item => (
                    <p key={item.id}><input type="checkbox"
                                            checked={selectedGroup.includes(item.id)}
                                            onChange={() => handleSelectGroup(item.id)}/> {item.group_name}</p>
                ))}
            </div>
            <p style={{color: "blue", cursor: "pointer"}}
               onClick={openAllFilter}>{allFilters ? "Скрыть варианты" : "Показать ещё"}</p>
            <div className={"filter_price_range"}>
                <hr/>
                <h4>Цена</h4>
                <div>
                    <label>
                        Цена от: {minRange} <FaRubleSign/>
                        <input
                            type="range"
                            min={minPrice}
                            max={maxPrice}
                            step={100}
                            value={minRange}
                            onChange={handleMinChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Цена до: {maxRange} <FaRubleSign/>
                        <input
                            type="range"
                            min={minPrice}
                            max={maxPrice}
                            step={100}
                            value={maxRange}
                            onChange={handleMaxChange}
                        />
                    </label>
                </div>
                <div>
                    <p>Выбранный диапазон: <br/>{minRange} <FaRubleSign/>- {maxRange} <FaRubleSign/></p>
                </div>
            </div>
            <button type={"button"} className={"btn btn-info"} onClick={showVariables}>Показать варианты</button>
        </div>
    );
}