import "../../styles/bootstrap.min.css"
import "./city.css"
import React, {Fragment, useEffect, useState} from "react";
import Menu from "../../components/navbar/navbar";
import {getCities} from "../../services/Api";
import {Link, useParams} from "react-router-dom";

export default function City() {
    const [city, setCityList] = useState([])
    // const  country = useParams();
    const {country, id} = useParams();

    const fetchCities = async () => {
        const resp = await getCities(id);
        setCityList(resp.data);
    }

    useEffect(() => {
        fetchCities()
    }, []);

    const CityLink = ({to, param, item}) => {
        return (
            <Link to={to + param} style={{textDecoration: 'none'}}>
                <img src={item.image} alt="Тут картинка"
                     className="d-block img-item-block"/>
                <h3 className="item-name-card-text"><span className="city-name">{item.name}</span></h3>
            </Link>
        );
    };

    return (
        <Fragment>
            <Menu/>
            <table className="table">
                <tbody>
                <tr>
                    <td className="cities-left-block">

                    </td>
                    <td className="cities-main-block">
                        <div className="container cities-container">
                            <div className="row">
                                <div className="col-lg col-item">
                                    <h1>Спланируйте поездку легко и быстро</h1>
                                    <span>Выберите вид отдыха и посмотрите лучшие места в {country}</span>
                                </div>
                            </div>
                            <div className="row cities-row">
                                {city.map(item => (
                                    <div className="col-sm-4 city-block">
                                        <div className="mb-3">
                                            <CityLink className="city-name" to='/apartment/city/' param={item.id}
                                                      item={item}/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </Fragment>
    );
}