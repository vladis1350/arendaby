import React, {Fragment, useState} from "react";
import {useNavigate} from "react-router-dom";
import {api} from "../services/Api"
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../constants";
import Navbar from "./navbar/navbar";
import "../styles/bootstrap.min.css";
import "../styles/login.css";
import LoadingIndicator from "./LoadingIndicator";

export default function Form({route, method}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, {username, password})
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    };

    return (
        <Fragment>
            <Navbar/>
            <div className="col-md-4 login-form">
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        <legend className='login-form-title'>{name}</legend>
                        <div>
                            <label className="form-label mt-4">Username</label>
                            <input type="text" className="form-control"
                                   value={username}
                                   onChange={(e) => setUsername(e.target.value)}
                                   placeholder="Username"/>
                        </div>
                        <div>
                            <label className="form-label mt-4">Password</label>
                            <input type="password" className="form-control"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   placeholder="Password"/>
                        </div>
                    </fieldset>
                    <br/>
                    {loading && <LoadingIndicator />}
                    <button type="submit" className="btn btn-success btn-login-form">{name}</button>
                </form>
            </div>
        </Fragment>
    );
}