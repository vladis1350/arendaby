import React, {Fragment, useEffect, useState} from "react";
import Navbar from "../../components/navbar/navbar";
import "./Rent.css"
import {getGroupApartmentType} from "../../services/Api";


export default function Rent() {
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [groupApartmentType, setGroupApartmentType] = useState([])

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
                        <div className="col-lg-3" onClick={() => setSelectedBlock(group.id)}>
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
                    <div>
                        {selectedBlock === 1 && <div className="info">1</div>}
                        {selectedBlock === 2 && <div className="info">2</div>}
                        {selectedBlock === 3 && <div className="info">3</div>}
                        {selectedBlock === 4 && <div className="info">4</div>}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}