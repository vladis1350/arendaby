import {Fragment, useEffect, useState} from "react";
import {getApartmentTypes} from "../../services/Api";

export default function ApartmentTypes({group_id}) {
    const [apartmentType, setApartmentType] = useState([])

    const fetchApartmentType = async () => {
        try {
            const response = await getApartmentTypes(group_id);
            if (response.status === 200) {
                setApartmentType(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchApartmentType()
    }, []);

    return (
        <Fragment>
            {apartmentType.map(type => (
                <div className="col-3">
                    <input type='radio' value={type.type_name}/>{type.type_name}
                </div>
            ))
            }
        </Fragment>
    );
}