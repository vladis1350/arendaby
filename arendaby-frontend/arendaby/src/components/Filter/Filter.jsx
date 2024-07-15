import "../Filter/Filter.css"
import React, {useEffect, useState} from "react";
import {api} from "../../services/Api";
import 'react-input-range/lib/css/index.css';
import InputRange from "react-input-range";

export default function Filter({selectedItems}) {
    const [apartment_group, setApartmentGroup] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [range, setRange] = useState({min: 200, max: 20000});

    const handleChange = (value) => {
        setRange(value);
    };

    const handleSelectGroup = (selectedValue) => {
        setSelectedGroup(...selectedGroup, selectedValue);
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
                {apartment_group.map(item => (
                    <p><input type="checkbox" value={item.id}/> {item.group_name}</p>
                ))}
            </div>
            <div className="input-container">
                <InputRange
                    maxValue={100}
                    minValue={0}
                    formatLabel={value => `${value}`}
                    value={range}
                    onChange={handleChange}
                />
                <div>От: {range.min}</div>
                <div>До: {range.max}</div>
            </div>
        </div>
    );
}