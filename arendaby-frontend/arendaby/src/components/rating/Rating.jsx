import React from 'react';
import {useSelector} from "react-redux";
import {createRating, getRating} from '../../services/Api';
import {useNavigate} from "react-router-dom";
import "./rating.css";

const Rating = ({apartmentId, userRating}) => {
    const {isLoggedIn, userId} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleRating = async (value) => {
        if (isLoggedIn) {
            try {
                const response = await getRating(apartmentId, userId);
                if (response.status === 200) {
                    if (!response.data.rating) {
                        const formDataToSend = new FormData();
                        formDataToSend.append('client', userId);
                        formDataToSend.append('apartment', apartmentId);
                        formDataToSend.append('rating', value);
                        await createRating(formDataToSend);
                    }
                }
            } catch (error) {
                console.error('Ошибка при сохранении оценки:', error);
            }
        } else {
            navigate("/login")
        }
    };

    return (
        <div className={"rating-block"}>
            <h4><strong>Оцените апартамент:</strong></h4>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => handleRating(star)}
                    style={{
                        cursor: 'pointer',
                        color: star <= userRating ? '#FFD700' : '#ccc', // Золотые звезды для оцененных
                        fontSize: '30px'
                    }}
                >
                    ★
                </span>
            ))}
            {userRating === 0 || userRating === null ? <p>Вы еще не поставили свою оценку</p> :
                <p>Вы оценили: {userRating} {userRating === 1 ? 'звезда' : 'звезд'}</p>}

        </div>
    );
};

export default Rating;