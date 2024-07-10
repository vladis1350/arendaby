import React, {useEffect, useState} from "react";
import "../../styles/bootstrap.min.css";
import {api, getUser} from "../../services/Api";
import {useSelector} from "react-redux";
import Loader from "../Loader/ClipLoader";
import ProfileUserImage from "../navbar/ProfileImage";

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const {isLoggedIn, userId} = useSelector(
        (state) => state.auth);

    useEffect(() => {
        try {
            setLoading(true);
            if (isLoggedIn) {
                getUserById();
            }
            getMenu();
        } catch (err) {
            console(err);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    const getMenu = () => {
        api
            .get("/api/menu/")
            .then((res) => res.data)
            .then((data) => {
                setMenuItems(data);
                console.log(data);
            })
            .catch((err) => alert(err))
    }

    const getUserById = async () => {
        const response = await getUser(userId);
        if (response.status === 200) {
            setUser(response.data);
        } else {
            alert("Error Authorization");
        }
    }

    return (
        <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">ArendaBy</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor02">
                    <ul className="navbar-nav me-auto">
                        {menuItems.map(item => (
                            isLoggedIn && item.name === "Войти" ?
                                (<>
                                    <li className="nav-item">
                                        <a className="nav-link" href={"/logout"}>Выйти</a>
                                    </li>
                                    {user ?
                                        (<li className="nav-item">
                                            <a className="nav-link profile-link"
                                               href={"/profile"}>
                                                {user.profile.firstname} {user.profile.secondname}
                                                <ProfileUserImage/></a>
                                        </li>

                                        ) : (<Loader loading={loading}/>)
                                    }
                                </>) :
                                (<li className="nav-item">
                                    <a className="nav-link" key={item.id} href={item.link}>{item.name}</a>
                                </li>))
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Menu;