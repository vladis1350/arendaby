import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import "./ideas.css"
import {api} from "../../services/Api";

export default function VocationIdeas() {
    const [ideas, setVocationIdeas] = useState([]);

    useEffect(() => {
        getIdeas()
    }, []);

    const getIdeas = () => {
        api
            .get("/api/ideas/")
            .then((res) => res.data)
            .then((data) => {
                setVocationIdeas(data);
                console.log(data);
            })
            .catch((err) => alert(err))
    };

    return (
        // <Router>
        <div className="container header-info">
            <div className="row">
                <div className='col-lg col-item'>
                    <h2 className='card-header vocation-ideas-title'><strong>Идеи для отпуска</strong></h2>
                </div>
            </div>
            <div className="row ideas-row">
                {ideas.map(item => (
                    <div className="col-sm col-item">
                        <div className="card ideas-block mb-3">
                            <Link className="link-ideas" to={item.link}>
                                <h6 className="card-header">{item.title}</h6>
                                <img src={item.image} alt="Тут картинка"
                                     className="d-block"/>
                                <div className="card-body">
                                    <p className="card-text">{item.info}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        // </Router>
    );
}