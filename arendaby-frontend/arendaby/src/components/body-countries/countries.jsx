import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {api} from "../../services/Api";
import "./countries.css"


export default function Countries() {
    const [countries, setCountryList] = useState([])
    const [cities, setCitiesList] = useState([])


    useEffect(() => {
        getCountries();
    }, []);

    const getCities = (id) => {
        api
            .get(`/api/cities/${id}`)
            .then((res) => res.data)
            .then((data) => {
                setCitiesList(data)
                // console.log(data)
            })
            .catch((err) => console.log(err))
    }

    const CountryLink = ({to, param, item}) => {
        return (
            <Link to={`${to}/${param}`} style={{textDecoration: 'none'}}>
                <img src={item.image} alt="Тут картинка"
                     className="d-block img-item-block"/>
                <h3 className="item-name-card-text"><span className="country-name">{item.name}</span></h3>
            </Link>
        );
    };

    const getCountries = () => {
        api
            .get("/api/country/")
            .then((res) => res.data)
            .then((data) => {
                setCountryList(data)
                console.log(data)
            })
            .catch((err) => console.log(err))
    }

    return (
        <div className="container countries-block">
            <div className="row">
                <div className='col-lg col-item'>
                    <h2 className='countries-title'><strong>Страны и популярные направления</strong></h2>
                </div>
            </div>
            <div className="row country-row">
                {countries.map(item => (
                    // getCities(item.id),
                    <div className="col-3 col-item">
                        <div className="mb-3 countries-block">
                            <CountryLink to="/country" param={item.name + "/" + item.id} item={item}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}