import React, {Children, cloneElement, useEffect, useState} from "react";
import '../../styles/bootstrap.min.css'

export const Container = ({children}) => {
    const [elements, setElement] = useState([])

    useEffect(() => {
        setElement(
            (Children.map(children, child => {
                return cloneElement(child);
            }))
        )
    }, []);

    return (
        <div className="containter">
                {elements}
        </div>
    );
}