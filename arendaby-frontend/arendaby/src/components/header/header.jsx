import React from "react";
import "../../bootstrap.min.css"
import "./header.css"

export default function HeaderInfo() {
    return (
        <div className="container header-info">
            <div className="row">
                <div className="col-sm col-item ">
                    <div className="alert alert-dismissible alert-light alert-block">
                        <img src="http://localhost:8000/media/places/briefly-1.webp"
                             className="d-block user-select-none img-head-info" alt="aaa"/>
                        <strong>280 тысяч вариантов: квартиры, отели, гостевые дома</strong>
                    </div>
                </div>
                <div className="col-sm">
                    <div className="alert alert-dismissible">
                        <img src="http://localhost:8000/media/places/briefly-2.webp"
                             className="d-block user-select-none img-head-info" alt=""/>
                        <strong>Цены напрямую от хозяев жилья</strong>
                    </div>
                </div>
                <div className="col-sm">
                    <div className="alert alert-dismissible">
                        <img src="http://localhost:8000/media/places/briefly-3.webp"
                             className="d-block user-select-none img-head-info" alt=""/>
                        <strong>Кэшбэк бонусами после
                            каждой поездки</strong>
                    </div>
                </div>
                <div className="col-sm">
                    <div className="alert alert-dismissible">
                        <img src="http://localhost:8000/media/places/briefly-4.webp"
                             className="d-block user-select-none img-head-info" alt=""/>
                        <strong>Круглосуточная служба
                            поддержки</strong>
                    </div>
                </div>
            </div>
        </div>
    )
}

