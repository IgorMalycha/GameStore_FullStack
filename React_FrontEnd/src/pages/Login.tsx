import React, { FormEvent, useContext } from 'react';
import './Login.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Login: React.FC = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('UserContext must be used within a UserContextProvider');
    }
    const { fetchUser } = context;

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [emailError, setEmailError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');

    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');

        let isError = false;

        if (email.length < 3) {
            setEmailError("E-mail must be at least 3 characters long");
            isError = true;
        }
        if (password.length < 3) {
            setPasswordError("Password must be at least 3 characters long");
            isError = true;
        }

        if (isError) return;

        axios.post('http://localhost:3001/api/users/login',
            { email, password },
            { withCredentials: true }
        ).then((result) => {
            fetchUser();
            navigate('/home');
        }).catch((error) => {
            if (error.response && error.response.status === 400) {
                setEmailError(error.response.data.error);
            } else {
                console.error("Login error:", error);
            }
        });
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    name="email"
                    type="text"
                    value={email}
                    className="inputField"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p className="errorMsg">{emailError}</p>

                <label htmlFor="password">Password:</label>
                <input
                    name="password"
                    type="password"
                    value={password}
                    className="inputField"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className="errorMsg">{passwordError}</p>
                <button type="submit" className="login-button">Login</button>
            </form>

            <p>
                Don't have an account?{' '}
                <Link to="/auth/register" className="link-to-register">Register here</Link>
            </p>
            <Link to="/home" className="link-to-enter-without-login">Enter without loging in</Link>
        </div>
    );
};

export default Login;
