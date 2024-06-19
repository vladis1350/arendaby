import React, {Fragment, useEffect, useState} from "react";
import Navbar from "../../components/navbar/navbar";
import "./Rent.css"
import {getApartmentTypes, getGroupApartmentType} from "../../services/Api";


export default function Rent() {
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [groupApartmentType, setGroupApartmentType] = useState([]);
    const [apartmentType, setApartmentType] = useState([]);
    const [radioValue, setRadioValue] = useState('');

    const handleClickOnGroupBlock = (id) => {
        setSelectedBlock(id);
        fetchApartmentType(id);
    }
    const fetchApartmentType = async (id) => {
        try {
            const response = await getApartmentTypes(id);
            if (response.status === 200) {
                setApartmentType(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    }
    const fetchGroupApartmentTypes = async () => {
        try {
            const response = await getGroupApartmentType();
            if (response.status === 200) {
                setGroupApartmentType(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const selectApartmentType = (type_id) => {
        setRadioValue(type_id)
    }

    useEffect(() => {
        fetchGroupApartmentTypes();
    }, []);

    return (
        <Fragment>
            <Navbar/>
            <div className="container">
                <div className="row">
                    <div className="col rent-header">
                        <h3>Сдавайте своё жильё на ArendaBy</h3>
                        <p>Бесплатное размещение объявлений, оплата только за успешные бронирования</p>
                    </div>
                </div>
                <div className="row">
                    <h5>Что будете сдавать?</h5>
                    {groupApartmentType.map(group => (
                        <div className="col-lg-3"
                             onClick={() => handleClickOnGroupBlock(group.id)}>
                            <div className="type-apartment">
                                <p>{group.group_name}</p>
                                <p className="inf">{group.short_info}</p>
                            </div>
                            <div className="footer-type-apartment">
                                <span>{group.descriptions}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row">
                    {apartmentType.map(type => (
                        <div className="col-3 ">
                            <div className="apart-type-block" onClick={() => selectApartmentType(type.id)}>
                                <div className="my-radio-block">
                                    <input type='radio' value={type.id} checked={radioValue === type.id}
                                           onChange={() => {
                                           }}/> {type.type_name}
                                </div>
                            </div>
                        </div>
                    ))
                    }
                </div>
            </div>
        </Fragment>
    );
}