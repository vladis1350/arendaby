import {Link} from "react-router-dom";
import {Carousel} from "../carousel/Carousel";
import React from "react";

const ApartmentBody = ({apartmentList}) => {

    return (
        <div className="col-9 center-apart-block">
            {apartmentList.map(item => (
                <Link to={`/apartment/${item.id}`}>
                    <div className="row apartment-row-items">
                        <div className="col-4 apart-img-block">
                            <Carousel>
                                {item.images && item.images.length > 0 && (
                                    item.images.map((image, index) => (
                                            <img key={index} src={image.image} alt={`Image ${index}`}
                                                 className="d-block ap-img"/>
                                        )
                                    ))}
                            </Carousel>
                        </div>
                        <div className="col-6 apartment-info">
                            <p className={"apart-type"}>{item.type.type_name}</p>
                            <p className={"apart-title"}>{item.name}</p>
                            <p className={"apart-address"}>{item.address}</p>
                            {/*<p className={"apart-description"}>{item.descriptions}</p>*/}
                            <p className={"sleeping_places"}>Количество спальных
                                мест: {item.sleeping_places}</p>
                        </div>
                        <div className="col-2 apartment-price">
                            <span className={"apart-price"}>{item.price} за сутки</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default ApartmentBody;