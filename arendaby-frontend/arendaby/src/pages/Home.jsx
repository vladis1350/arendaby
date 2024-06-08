import React, {Fragment} from "react";
import Menu from "../components/navbar/navbar";
import HeaderInfo from "../components/header/header";
import Ideas from "../components/body-ideas/ideas"
import Countries from "../components/body-countries/countries"

function Home() {
    return (
        <Fragment>
            <Menu/>
            <HeaderInfo/>
            <Ideas/>
            <Countries />
        </Fragment>
    );
}

export default Home