import Form from "../../components/LoginAndRegForm"
import React, {Fragment, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {loginUser} from "../../services/Api";
import {login} from "../../Redux/authReducer";
import {showMessageInfo} from "../../Redux/messagesReducer";
import Navbar from "../../components/navbar/navbar";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const {isLoggedIn} = useSelector((state) => state.auth);
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await loginUser(username, password);
            if (res.status === 200) {
                dispatch(
                    login({
                        accessToken: res.data.access,
                        refreshToken: res.data.refresh,
                    })
                )
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    };

    if (isLoggedIn) {
        dispatch(showMessageInfo({type: "success", text: `Добро пожаловать ${username}`}));
        return <Navigate to="/"/>;
    }

    return (
        <Fragment>
            <Navbar/>
            <div className="col-md-4 login-form">
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend className='login-form-title'>Авторизация</legend>
                        <div>
                            <label className="form-label mt-4">Логин</label>
                            <input type="text" className="form-control"
                                   value={username}
                                   onChange={(e) => setUsername(e.target.value)}
                                   placeholder="Username"/>
                        </div>
                        <div>
                            <label className="form-label mt-4">Пароль</label>
                            <input type="password" className="form-control"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   placeholder="Password"/>
                        </div>
                    </fieldset>
                    <br/>
                    {loading && <LoadingIndicator/>}
                    <div className="login-submit">
                        <button type="submit">Войти</button>
                    </div>
                    <Link className="login-register" to="/register">
                        Регистрация
                    </Link>
            {/*        <button type="submit" className="btn btn-success btn-login-form">{name}</button>*/}
                </form>
            </div>
        </Fragment>
    );
}