import React, {useState} from 'react';
import "./popup.css";
import {FaMinus, FaPlus} from 'react-icons/fa';

const PopupComponent = ({onClose, count_guest, isFilter = false}) => {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const childrenAges = Array.from({length: 17}, (_, idx) => idx + 1);

    const handleCloseBlock = (e) => {
        e.stopPropagation();
        onClose(adults, children);
    }

    return (
        <div className="overlay">
            <div className="popup">
                <div className={"row"}>
                    <div className={"col"}>
                        <h4><strong>Гости</strong></h4>
                        <span>Жильё вмещает максимум {count_guest} гостей</span>
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
                    {children > 0 &&
                        <div className={'row row-children-age'}>
                            <div className={"col"}>
                                <select className={"children-age"}>
                                    <option>Выберите возраст</option>
                                    {childrenAges.map(age => (
                                        <option key={age} value={age}>{age} лет</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    }
                </div>
                <div className={"row"}>
                    <div className={"col"}>
                        {isFilter === false && (adults + children) <= count_guest ?
                            (<button onClick={handleCloseBlock}
                                     className="btn btn-success count-guest-apply">Применить</button>) : isFilter === true ? (
                                    <button onClick={handleCloseBlock}
                                            className="btn btn-success count-guest-apply">Применить</button>
                                ) :
                                (<p className={"text-danger"}>Внимание! Жильё вмещает
                                    максимум {count_guest} гостей.
                                    Уменьшите их
                                    количество или найдите более вместительный объект.</p>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupComponent;