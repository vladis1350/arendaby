import React from 'react';
import './Footer.css'; // Импортируем CSS файл для стилизации

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-item">
                        <h3>Контакты</h3>
                        <p>Email: info@example.com</p>
                        <p>Телефон: +1 234 567 890</p>
                    </div>
                    <div className="footer-item">
                        <h3>Социальные сети</h3>
                        <ul className="social-links">
                            <li><a href="#" className="social-icon">Facebook</a></li>
                            <li><a href="#" className="social-icon">Twitter</a></li>
                            <li><a href="#" className="social-icon">Instagram</a></li>
                        </ul>
                    </div>
                    <div className="footer-item">
                        <h3>О нас</h3>
                        <p>Мы предоставляем лучшие услуги в индустрии. Узнайте больше о нашей компании.</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Ваша Компания. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;