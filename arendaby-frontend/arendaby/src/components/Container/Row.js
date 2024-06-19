import React, {Children, cloneElement, useEffect, useState} from "react";
import '../../pages/Rent/Rent.css'
export const Row = ({children}) => {
    const [elements, setElement] = useState([])

    useEffect(() => {
        setElement(
            (Children.map(children, child => {
                return cloneElement(child);
            }))
        )
    }, []);

    return (
        <div className={"row"}>
            {elements}
        </div>
    );
}