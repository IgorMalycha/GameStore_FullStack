import React, {FormEvent} from 'react';
import './Register.css';
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';

const Register: React.FC = () => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [firstNameError, setFirstNameError] = React.useState('');
    const [lastNameError, setLastNameError] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [passwordError, setPasswordError] = React.useState('');

    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        let isError = false;

        setEmailError('');
        setFirstNameError('');
        setLastNameError('');
        setPasswordError('');

        if (firstName.length < 3 || firstName.length > 100){
            setFirstNameError("Imie musi mieć od 3 do 100 liter");
            isError = true;
        }
        if (lastName.length < 3 || lastName.length > 100){
            setLastNameError("Nazwisko musi mieć od 3 do 100 liter");
            isError = true;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)){
            setEmailError("E-mail jest nie poprawny");
            isError = true;
        }
        if (password.length < 3 || password.length > 255){
            setPasswordError("Hasło musi mieć od 3 do 255 liter");
            isError = true;
        }

        if(isError){return}

        axios.post('http://localhost:3001/api/users/register', {firstName, lastName, email, password},
            { withCredentials: true })
            .then(result => {
                navigate('/auth/login');
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    setEmailError(error.response.data.error);
                } else {
                    console.log(error);
                }
            });
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First name:</label>
                <input
                    name="firstName"
                    type="text"
                    value={firstName}
                    className="inputField"
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <p className="errorMsg">{firstNameError}</p>

                <label htmlFor="firstName">Last name:</label>
                <input
                    name="lastName"
                    type="text"
                    value={lastName}
                    className="inputField"
                    onChange={(e) => setLastName(e.target.value)}
                />
                <p className="errorMsg">{lastNameError}</p>

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
                    type="text"
                    value={password}
                    className="inputField"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className="errorMsg">{passwordError}</p>

                <button type="submit" className="registerBtn">Register</button>
            </form>

            <p>Already have an account? <Link to="/auth/login" className="link-to-login">Login here</Link></p>
        </div>
    );
};

export default Register;
