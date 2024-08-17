import React, {Fragment, useEffect, useState} from "react";
import Menu from "../components/navbar/navbar";
import HeaderInfo from "../components/header/header";
import Ideas from "../components/body-ideas/ideas"
import Countries from "../components/body-countries/countries"
import HeaderFormFilter from "../components/apartment/HeaderFormFilter";
import UserActivity from "../components/user-activity/UserActivity";
import Footer from "../components/Footer/Footer";

function Home() {

    const userActivityStyle = {
        display: "inline-block",
        margin: "0 5px",
        width: "300px"
    }

    return (
        <Fragment>
            <Menu/>
            <div className={"home-block"}>
                <h1><strong>Найдём, где остановиться!</strong></h1>
                <h5>Квартиры, отели, гостевые дома — 280 вариантов для поездок по России и зарубежью</h5>
                <HeaderFormFilter/>
                <UserActivity style={userActivityStyle}/>
                <HeaderInfo/>
                <Ideas/>
                <Countries/>
                <Footer/>
            </div>
        </Fragment>
    );
}

export default Home