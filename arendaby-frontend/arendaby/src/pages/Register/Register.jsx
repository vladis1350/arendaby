import React, {Fragment, useCallback, useState} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
// context
import {useDispatch, useSelector} from "react-redux";
// context
import {login} from "../../Redux/authReducer";
import {showMessageInfo} from "../../Redux/messagesReducer";
// services
import {authUser} from "../../services/Api";
// components
import "./Register.css";
import Navbar from "../../components/navbar/navbar";

const title = "Регистрация";

function CheckPassword(password, password2) {
    return password === password2;
}

export default function Register() {
    const dispath = useDispatch();
    const {isLoggedIn} = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
    });

    const handleChange = useCallback((event) => {
        const {name, value} = event.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }, []);

    if (isLoggedIn) {
        dispath(
            showMessageInfo({
                type: "success",
                text: "Вы уже зарегистрированы",
            })
        );
        return <Navigate to="/"/>;
    }

    document.title = title;

    const handleSubmit = async (event) => {
        event.preventDefault();

        const {username, email, password, password2} = formData;

        if (!CheckPassword(password, password2)) {
            dispath(
                showMessageInfo({
                    type: "error",
                    text: "Пароли не совпадают",
                })
            )
            return;
        }
        try {
            const response = await authUser(username, email, password);
            dispath(login(response.data.access, response.data.refresh));
            navigate("/login");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log(error);
            } else if (error.response && error.response.status === 400) {
                console.log(error);
            } else {
                console.log(error);
            }
        }
    };

    return (
        <Fragment>
            <Navbar/>
            <div className="container">
                <div className="form__reg">
                    <div className="reg-header">
                        <h1>Регистрация</h1>
                    </div>
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="row">
                            <label className="form-label mt-2">Имя пользователя:</label>
                            <div className="col-sm-7">
                                <input className="form-control"
                                       type="text"
                                       id="username"
                                       name="username"
                                       value={formData.username}
                                       onChange={handleChange}
                                       required
                                />
                            </div>
                        </div>
                        <div className="row">
                            <label className="form-label mt-2">Почта:</label>
                            <div className="col-sm-7">
                                <input className="form-control"
                                       type="text"
                                       id="email"
                                       name="email"
                                       value={formData.email}
                                       onChange={handleChange}
                                       required
                                />
                            </div>
                        </div>
                        <div className="row">
                            <label className="form-label mt-2">Пароль:</label>
                            <div className="col-sm-7">
                                <input className="form-control"
                                       type="password"
                                       id="password"
                                       name="password"
                                       value={formData.password}
                                       onChange={handleChange}
                                       required
                                />
                            </div>
                        </div>
                        <div className="row">
                            <label className="form-label mt-2">Повторите пароль:</label>
                            <div className="col-sm-7">
                                <input className="form-control"
                                       type="password"
                                       id="password2"
                                       name="password2"
                                       value={formData.password2}
                                       onChange={handleChange}
                                       required
                                />
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className={"col"}>
                                <button type="submit" className={"btn btn-success reg-btn"}>Зарегистрироваться</button>
                            </div>
                        </div>
                        <Link className="login-register" to="/login">
                            У меня уже есть аккаунт
                        </Link>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}
