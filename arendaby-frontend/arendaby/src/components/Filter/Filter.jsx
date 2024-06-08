import React, {useEffect, useState} from "react";
import api from "../../api";

export default function Filter() {
    const [apartment_type, setApartmentType] = useState([])

    useEffect(() => {
        getApartmentType();
    }, []);

    const getApartmentType = () => {
        api.get("/api/apartment-type/list")
            .then(res => setApartmentType(res.data))
            .catch(err => {console.log(err)});
    };

    return (
        <div className="col left-block">
            <div className="placement">
                <span><strong>Варианты размещения:</strong></span>
            </div>
            {apartment_type.map(item => (
                <p><input type="checkbox" value={item.id}/>  {item.type_name}</p>
            ))}
        </div>
    );
}