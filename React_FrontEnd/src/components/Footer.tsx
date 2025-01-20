import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>Share us on:</p>
            <div className="footer-icons">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">📘 Facebook</a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">📸 Instagram</a>
            </div>
        </footer>
    );
};

export default Footer;
