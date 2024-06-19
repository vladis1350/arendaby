import React, {Fragment, useEffect, useState} from "react"
import Navbar from "../../components/navbar/navbar";
import {useDispatch, useSelector} from "react-redux";
import {getRefreshToken, getUser} from "../../services/Api"
import "./UserProfile.css"
import {useNavigate} from "react-router-dom";
import {login, logout} from "../../Redux/authReducer";
import {showMessageInfo} from "../../Redux/messagesReducer";

export default function UserProfile() {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const {isLoggedIn, userId, token, refreshToken} = useSelector(
        (state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userIsUpdated, setUserIsUpdated] = useState(false);
    const [formData, setFormData] = useState({
        firstname: "",
        secondname: "",
        username: "",
        gender: "",
        image: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (isLoggedIn) {
                    const response = await getUser(userId);
                    if (response.status === 200) {
                        setUserData(response.data)
                        setFormData({
                            firstname: response.data.profile.firstname,
                            secondname: response.data.profile.secondname,
                            username: response.data.username,
                            gender: response.data.profile.genders,
                            image: response.data.profile.image,
                            email: response.data.email,
                            phone: response.data.profile.phone,
                        });
                    }
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        const response = await getRefreshToken(refreshToken);
                        const newAccessToken = response.data.access;
                        // Обновляем токен
                        dispatch(login(newAccessToken, refreshToken));
                    } catch (refreshError) {
                        dispatch(
                            showMessageInfo({
                                type: "error",
                                text: "Необходимо авторизоваться",
                            })
                        );
                        dispatch(logout());
                        navigate("/login");
                    }
                } else {
                    dispatch(
                        showMessageInfo({
                            type: "error",
                            text: "Произошла ошибка при получении данных профиля",
                        })
                    );
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [isLoggedIn, userIsUpdated]);

    return (
        <Fragment>
            <Navbar/>
            <div className="container">
                <div className="row">
                    <div className="col-3 profile-left-block">
                        <div className="avatar-block">
                            <img className="avatar" src={formData.image} alt="User"/>
                        </div>
                        <span className="fio"><strong>{formData.firstname} {formData.secondname}</strong></span>
                        <br/>
                        <span className="username">{formData.username}</span>
                        <button className="btn-fill-profile">Заполнить профиль</button>
                    </div>
                    <div className="col-6">
                        <div className="row">
                            <div className="col profile-center-block">
                                <p><strong>Пол:</strong> {formData.gender}</p>
                                <p><strong>Username:</strong> {formData.username}</p>
                                <p><strong>Email:</strong> {formData.email}</p>
                                <p><strong>Телефон:</strong> {formData.phone}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-3 profile-right-block">
                        <span>Right block</span>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}