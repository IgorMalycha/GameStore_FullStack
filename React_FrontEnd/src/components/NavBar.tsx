import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { UserContext } from "../context/UserContext";
import { LoggedUser } from "../types/LoggedUser";

const Navbar: React.FC = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('UserContext must be used within a UserContextProvider');
    }
    const { user, setUser } = context;

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [userData, setUserData] = useState<LoggedUser | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:3001/api/users/${user?.id}`, {
                method: 'GET',
                credentials: 'include',
            })
                .then(res => res.json())
                .then(data => setUserData(data))
                .catch(error => console.log(error));
        }
    }, [user]);

    const handlePopupOpen = () => setIsPopupOpen(true);
    const handlePopupClose = () => setIsPopupOpen(false);

    const handleSubmit = () => {
        fetch(`http://localhost:3001/api/users/${user?.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ firstName, lastName }),
        })
            .then(async res => {
                const updatedUser = await res.json();
                setUserData(updatedUser);
            })
            .catch(err => console.log(err));

        handlePopupClose();
    };

    const handleLogout = () => {
        fetch('http://localhost:3001/api/users/logout', {
            method: 'POST',
            credentials: 'include',
        })
            .then(res => {
                if (res.ok) {
                    setUser(null);
                    navigate('/auth/login');
                }
            })
            .catch(err => console.error('Error logging out:', err));
    };

    return (
        <div className="navbar">
            <div className="navbar-logo">🎮 GameStore</div>
            <div className="navbar-links">
                <Link to="/home" className="navbar-link">
                    <div>Home</div>
                </Link>
                <Link to="/games" className="navbar-link">
                    <div>Games</div>
                </Link>
                <Link to="/cart" className="navbar-link">
                    <div>Cart</div>
                </Link>
                {user?.id === 1 && (
                    <Link to="/editGames" className="navbar-link">
                        <div>Edit game</div>
                    </Link>
                )}
            </div>
            <div className="navbar-user">
                {user ? (
                    <>
                        <div className="user-info">
                            <span>👤</span>
                            <p>{userData?.firstName} {userData?.lastName}</p>
                        </div>
                        <div className="user-actions">
                            <button onClick={handlePopupOpen}>Change Name</button>
                            <button onClick={handleLogout} className="logout-link">Log out</button>
                        </div>
                    </>
                ) : (
                    <Link to="/auth/login" className="login-link">Login</Link>
                )}
            </div>

            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Change Name</h3>
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <button onClick={handleSubmit}>Save</button>
                        <button onClick={handlePopupClose}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
