import "../Filter/Filter.css"
import React, {useEffect, useState} from "react";
import {api} from "../../services/Api";
import 'react-input-range/lib/css/index.css';
import FilterPrice from "./FilterPrice";


export default function Filter({selectedItems}) {
    const [apartment_group, setApartmentGroup] = useState([]);
    const [allFilters, setAllFilters] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState([]);

    const handleSelectGroup = (value) => {
        if (selectedGroup.includes(value)) {
            setSelectedGroup(selectedGroup.filter(item => item !== value));
        } else {
            setSelectedGroup([...selectedGroup, value]);
        }
    }

    const showVariables = () => {
        alert(selectedGroup);
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
            <FilterPrice/>
            <button type={"button"} className={"btn btn-info"} onClick={showVariables}>Показать варианты</button>
        </div>
    );
}