import {Fragment, useEffect} from "react";
import Navbar from "../../components/navbar/navbar";
import UserActivity from "../../components/user-activity/UserActivity";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

export default function Favorites() {
    const {token} = useSelector(
        (state) => state.auth);

    const styleBlock = {
        display: "inline-block",
        margin: "0 5px",
        width: "350px"
    }

    return (
        <Fragment>
            <Navbar/>
            <div className="container">
                <div className="row">
                    <div className="col-lg">
                        <h1>Favorites</h1>
                        {token ? (<UserActivity style={styleBlock}/>) : (<a href={"/login"}>Авторизоваться</a>)}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}