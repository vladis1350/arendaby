import React, {useState} from 'react';
import "./popup.css";
import {FaMinus, FaPlus} from 'react-icons/fa';

const SelectGuestsComponent = ({hide, guestAdults, guestChildren}) => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const handleSelect = () => {
        guestAdults(adults);
        guestChildren(children);
    }

    return (
        <div className={`hide-block ${hide ? 'open' : 'close'}`}>
            <div className="hide-block-popup">
                <div className={"row"}>
                    <div className={"col"}>
                        <h4><strong>Гости</strong></h4>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-6"}>
                        <label><strong>Взрослые:</strong></label><br/>
                        <span>от 18 лет</span>
                    </div>
                    <div className={"col-6"}>
                        <button onClick={() => {
                            adults > 1 ? setAdults(adults - 1) : setAdults(1)
                        }}><FaMinus/></button>
                        <label>{adults}</label>
                        <button onClick={() => setAdults(adults + 1)}><FaPlus/></button>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col-6"}>
                        <label><strong>Дети:</strong></label><br/>
                        <span>от 0 до 17 лет</span>
                    </div>
                    <div className={"col-6"}>
                        <button onClick={() => {
                            children > 0 ? setChildren(children - 1) : setChildren(0)
                        }}><FaMinus/></button>
                        <label>{children}</label>
                        <button onClick={() => setChildren(children + 1)}><FaPlus/></button>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col"}>
                        <button onClick={handleSelect} className="btn btn-success count-guest-apply">Применить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectGuestsComponent;