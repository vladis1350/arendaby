import React, {useEffect, useState} from "react";
import "../../styles/bootstrap.min.css"
import api from "../../api";

function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        getMenu();
    }, []);

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

    const getStatus = () => {
        api.get("/api/token")
            .then(res => {
                setStatus(res.status)
            })
            .catch((err) => console.log(err))
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
                        {menuItems.map(item => {
                            getStatus()
                                if (status === 200 && item.name === "Войти")
                                    return <li className="nav-item">
                                                <a className="nav-link" href="/logout">Выйти</a>
                                            </li>
                                return <li className="nav-item">
                                            <a className="nav-link" key={item.id} href={item.link}>{item.name}</a>
                                        </li>
                            }
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Menu;