import React, {Fragment} from "react";
import Menu from "../components/navbar/navbar";
import HeaderInfo from "../components/header/header";
import Ideas from "../components/body-ideas/ideas"
import Countries from "../components/body-countries/countries"
import HeaderFormFilter from "../components/apartment/HeaderFormFilter";

function Home() {
    return (
        <Fragment>
            <Menu/>
            <div className={"home-block"}>
                <h1><strong>Найдём, где остановиться!</strong></h1>
                <h5>Квартиры, отели, гостевые дома — 280 тысяч вариантов для поездок по России и зарубежью</h5>
                <HeaderFormFilter/>
                <HeaderInfo/>
                <Ideas/>
                <Countries/>
            </div>
        </Fragment>
    );
}

export default Home