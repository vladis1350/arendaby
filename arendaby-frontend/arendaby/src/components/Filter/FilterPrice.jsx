import {useState} from "react";
import {FaRubleSign, FaStar} from 'react-icons/fa';

const FilterPrice = () => {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [minRange, setMinRange] = useState(2000); // Начальное значение "от"
    const [maxRange, setMaxRange] = useState(8000); // Начальное значение "до"

    // Обработка изменения ползунка "от"
    const handleMinChange = (e) => {
        const value = Math.min(e.target.value, maxRange); // Условие для минимального значения
        setMinRange(value);
    };

    // Обработка изменения ползунка "до"
    const handleMaxChange = (e) => {
        const value = Math.max(e.target.value, minRange); // Условие для максимального значения
        setMaxRange(value);
    };

    return (
        <div className={"filter_price_range"}>
            <hr/>
            <h4>Цена</h4>
            <div>
                <label>
                    Цена от: {minRange} <FaRubleSign/>
                    <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={100}
                        value={minRange}
                        onChange={handleMinChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Цена до: {maxRange} <FaRubleSign/>
                    <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={100}
                        value={maxRange}
                        onChange={handleMaxChange}
                    />
                </label>
            </div>
            <div>
                <p>Выбранный диапазон: <br/>{minRange} <FaRubleSign/>- {maxRange} <FaRubleSign/></p>
            </div>
        </div>
    );
}

export default FilterPrice;