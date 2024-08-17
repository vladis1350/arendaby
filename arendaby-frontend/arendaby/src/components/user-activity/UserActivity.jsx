import React, {Fragment, useEffect, useState} from "react";
import {getUserActivity} from "../../services/Api";
import {useSelector} from "react-redux";
import "./user-activity.css";
import {Link, useNavigate} from "react-router-dom";
import {Carousel} from "../carousel/Carousel";


const UserActivity = ({style}) => {
    const [userActivities, setUserActivities] = useState([]);
    const {isLoggedIn, userId, token} = useSelector(
        (state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserActivities();
    }, []);

    const fetchUserActivities = async () => {
        if (token) {
            try {
                const response = await getUserActivity(userId); // Запрос для получения активности пользователя
                setUserActivities(response.data);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <Fragment>
            {userActivities.length !== 0 ? (<>
                <h4>Вы смотрели:</h4>
                {userActivities.map(activity => (
                <div style={style}>
                    <Link to={`/apartment/${activity.apartment.id}`} className="link-no-decoration">
                        <div key={activity.id}>
                            <h5>{activity.apartment.name}</h5>
                            <div>
                                <Carousel PAGE_WIDTH={250} heightPage={200} widthPage={300}>
                                    {activity.apartment.images && activity.apartment.images.length > 0 && (
                                        activity.apartment.images.map((image, index) => (
                                                <img key={index} src={image.image} alt={`Image ${index}`}
                                                     className="d-block ap-img"/>
                                            )
                                        ))}
                                </Carousel>
                                <span
                                    className={"activity_date"}>Просмотренно: {new Date(activity.viewed_at).toLocaleString()}</span>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}</>) : (<></>)
            }
        </Fragment>
    );
};

export default UserActivity;