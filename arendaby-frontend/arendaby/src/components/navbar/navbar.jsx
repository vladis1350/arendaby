import React, {useEffect, useState} from "react";
import "../../bootstrap.min.css"

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/menu/')
            .then(response => response.json())
            .then(data => setMenuItems(data));
    }, []);

    return (
        <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="">ArendaBy</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor02">
                    <ul className="navbar-nav me-auto">
                        {menuItems.map(item => (
                            <li className="nav-item">
                                <a className="nav-link" key={item.id} href={item.link}>{item.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Menu;