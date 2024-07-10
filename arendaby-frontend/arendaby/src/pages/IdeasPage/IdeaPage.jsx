import {Fragment, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {getIdea} from '../../services/Api';
import Menu from "../../components/navbar/navbar";
import "./IdeaPage.css"

export default function IdeaPage() {
    const [idea, setIdea] = useState([]);
    const {v_id} = useParams();

    const fetchIdeas = async () => {
        const response = await getIdea(v_id);
        if (response.status === 200) {
            setIdea(response.data);
        } else {
            alert(response.status)
        }
    }

    useEffect(() => {
        fetchIdeas();
    }, []);

    return (
        <Fragment>
            <Menu/>
            <div className={"container ideas-container"}>
                <div className={"row"}>
                    <div className={"col"}>
                        <h3><strong>ТОП - {idea.length} - Красивых мест Подмосковья</strong></h3>
                    </div>
                </div>
                {idea ? (idea.map(item => (
                    <>
                        <div className="row">
                            <div className="col">
                                <img className={"idea-image"} src={item.image} alt={item.name}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3"></div>
                            <div className="col-9">
                                <h4><strong>{item.name}</strong></h4>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    </>
                ))) : (
                    <div><h4>Пока нет идей!</h4></div>
                )}
            </div>
        </Fragment>
    );
}