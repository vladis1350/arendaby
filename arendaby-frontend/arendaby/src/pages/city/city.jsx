import "../../styles/bootstrap.min.css"
import "./city.css"
import React, {Fragment, useEffect, useState} from "react";
import Menu from "../../components/navbar/navbar";
import api from "../../api";
import {Link, useParams} from "react-router-dom";

export default function City() {
    const [city, setCityList] = useState([])
    // const  country = useParams();
    const {country, id} = useParams();

    useEffect(() => {
        getCities(id)
    }, []);

    const getCities = (id) => {
        api
            .get(`/api/cities/${id}`)
            .then((res) => res.data)
            .then((data) => {
                setCityList(data);
                console.log(data);
            })
            .catch((err) => alert(err))
    }

    const CityLink = ({to, param, item}) => {
        return (
            <Link to={`/`} style={{textDecoration: 'none'}}>
                <img src={item.image} alt="Тут картинка"
                     className="d-block user-select-none img-ideas"/>
                <h3 className="country-card-text"><span className="city-name">{item.name}</span></h3>
            </Link>
        );
    };

    return (
        <Fragment>
            <Menu/>
            <div className="container">
                <div className="row">
                    <div className="col-lg col-item">
                        <h1>Спланируйте поездку легко и быстро</h1>
                        <span>Выберите вид отдыха и посмотрите лучшие места в {country}</span>
                    </div>
                </div>
                <div className="row">
                    {city.map(item => (
                        <div className="col-lg-4">
                            <div className="mb-3">
                                <CityLink to='/' param='*' item={item}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    );
}