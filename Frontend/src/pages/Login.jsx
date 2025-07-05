
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [typedText, setTypedText] = useState('');
    const [errorMessage, setErrorMessage] = useState("")
    const fullText = 'Welcome Back!';

    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTypedText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!username || !password){
                setErrorMessage("All fields are required!");
                return;
            }

            const response = await axios.post("http://localhost:3000/api/auth/login", {
                username, 
                password
            })

            console.log(response.data)

        } catch (error) {
            setErrorMessage(error.response.data.message);
            console.log(error)
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="typing-text">{typedText}<span className="cursor">|</span></h1>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {errorMessage && <p className='errormessage'>{errorMessage}</p>}

                    <button type="submit" className="auth-button">
                        Sign In
                    </button>
                </form>

                <div className="auth-links">
                    <p>Don't have an account? <Link to="/register" className="link">Sign up</Link></p>
                    <Link to="/" className="link">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
