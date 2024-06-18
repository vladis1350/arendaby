import React, {Fragment, useState} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import {loginUser} from "../services/Api"
import Navbar from "./navbar/navbar";
import "../styles/bootstrap.min.css";
import "../styles/login.css";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../Redux/authReducer";
import {showMessageInfo} from "../Redux/messagesReducer";

export default function Form({route, method}) {
    // const [username, setUsername] = useState("")
    // const [password, setPassword] = useState("")
    // const [loading, setLoading] = useState(false)
    // const {isLoggedIn} = useSelector((state) => state.auth);
    // const navigate = useNavigate()
    // const dispatch = useDispatch();
    //
    // const name = method === "login" ? "Login" : "Register"
    // const handleSubmit = async (e) => {
    //     setLoading(true);
    //     e.preventDefault();
    //
    //     try {
    //         const res = await loginUser(username, password);
    //         if (method === "login") {
    //             if (res.status === 200) {
    //                 dispatch(
    //                     login({
    //                         accessToken: res.data.access,
    //                         refreshToken: res.data.refresh,
    //                     })
    //                 )
    //             }
    //         } else {
    //             navigate("/login")
    //         }
    //     } catch (err) {
    //         console.log(err)
    //     } finally {
    //         setLoading(false)
    //     }
    // };
    //
    // if (isLoggedIn) {
    //     dispatch(showMessageInfo({type: "success", text: `Добро пожаловать ${username}`}));
    //     return <Navigate to="/"/>;
    // }
    //
    // return (
    //     <Fragment>
    //         <Navbar/>
    //         <div className="container">
    //             <div className="form__login">
    //                 <div className="login-header">
    //                     <h1>Войти</h1>
    //                 </div>
    //                 <form className="login-form" onSubmit={handleSubmit}>
    //                     <div className="login-name">
    //                         <h3>Имя пользователя:</h3>
    //                         <input
    //                             className="login__input-name"
    //                             type="text"
    //                             id="username"
    //                             value={username}
    //                             placeholder="Имя пользователя"
    //                             onChange={(e) => setUsername(e.target.value)}
    //                             required
    //                         />
    //                     </div>
    //                     <div className="login-password">
    //                         <h3>Пароль:</h3>
    //                         <input
    //                             className="login__input-password"
    //                             type="password"
    //                             id="password"
    //                             value={password}
    //                             placeholder="Пароль"
    //                             onChange={(e) => setPassword(e.target.value)}
    //                             required
    //                         />
    //                     </div>
    //                     <br/>
    //                     <div className="login-submit">
    //                         <button type="submit">Войти</button>
    //                     </div>
    //                     <Link className="login-register" to="/register">
    //                         Регистрация
    //                     </Link>
    //                 </form>
    //             </div>
    //         </div>
            {/*<div className="col-md-4 login-form">*/}
            {/*    <form onSubmit={handleSubmit}>*/}
            {/*        <fieldset>*/}
            {/*            <legend className='login-form-title'>{name}</legend>*/}
            {/*            <div>*/}
            {/*                <label className="form-label mt-4">Username</label>*/}
            {/*                <input type="text" className="form-control"*/}
            {/*                       value={username}*/}
            {/*                       onChange={(e) => setUsername(e.target.value)}*/}
            {/*                       placeholder="Username"/>*/}
            {/*            </div>*/}
            {/*            <div>*/}
            {/*                <label className="form-label mt-4">Password</label>*/}
            {/*                <input type="password" className="form-control"*/}
            {/*                       value={password}*/}
            {/*                       onChange={(e) => setPassword(e.target.value)}*/}
            {/*                       placeholder="Password"/>*/}
            {/*            </div>*/}
            {/*        </fieldset>*/}
            {/*        <br/>*/}
            {/*        {loading && <LoadingIndicator/>}*/}
            {/*        <button type="submit" className="btn btn-success btn-login-form">{name}</button>*/}
            {/*    </form>*/}
            {/*</div>*/}
        // </Fragment>
    // );
}