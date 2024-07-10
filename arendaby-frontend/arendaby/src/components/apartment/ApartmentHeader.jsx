import React from "react";
import HeaderFormFilter from "./HeaderFormFilter";
import "./ApartmentStyle.css"

export default function ApartmentHeader({city, imgUrl, apartment}) {
    return (
        <div className="apartment-top-block" style={{
            backgroundImage: `url(${imgUrl})`,
        }}>
            <div className="part-header-capacity">
                <h1 className=''><strong>Снять квартиру посуточно в {city}e</strong></h1>
                <div className="col-lg">
                    <h2><strong>{apartment.length} предложений</strong></h2>
                </div>
                <HeaderFormFilter/>
            </div>
        </div>
    );
}