import {Fragment, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import api from "../../api";
import Menu from "../../components/navbar/navbar";


export default function Apartment() {
    const [apartment, setApartmentList] = useState([])
    const {city} = useParams()

    useEffect(() => {
        getApartment(city)
    }, []);


    const getApartment = (city) => {
        api
            .get(`api/apartment/city/${city}`)
            .then((res) => res.data)
            .then((data) => setApartmentList(data))
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <Fragment>
            <Menu/>
            <div className="panel-sticky">
                <h1>{city}</h1>
                <div className="wrapper">
                    <div className="card-list">
                        {apartment.map(item => (
                            <div className="card-list__item">
                                <p>{item.name}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </Fragment>
    )
}
