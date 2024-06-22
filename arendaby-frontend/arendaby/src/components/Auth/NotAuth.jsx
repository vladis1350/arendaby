import React from "react";
import "./AuthStyle.css";

export const NotAuth = () => {
    return (
        <div className={"container not-auth-block"}>
            <div className={"row"}>
                <div className={"col"}>
                    <h3>Не авторизован</h3>
                </div>
            </div>
        </div>
    );
}