
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import axios from 'axios';
import { MyContext } from '../App';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [typedText, setTypedText] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const fullText = 'Join Us Today!';

    const {setIsAuthenticated, setBoardName, setUsername, setuserId} = useContext(MyContext)

    const boardName = import.meta.env.VITE_BOARD_NAME;
    const navigate = useNavigate();

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

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!formData.name || !formData.username){
                setErrorMessage('All Fields are mandatory!');
                return;
            }
    
            if(formData.password.length < 6){
                setErrorMessage("Password must be atleast 6 character long!");
                return;
            }
    
            if (formData.password !== formData.confirmPassword) {
                setErrorMessage('Passwords do not match!');
                return;
            }
    
            const response = await axios.post("http://localhost:3000/api/auth/register", {
                name: formData.name,
                username: formData.username,
                password: formData.password,
                boardName
            })

            if(response.data.success){
                setIsAuthenticated(true);
                setBoardName(boardName);
                setUsername(response.data.user.username)
                setuserId(response.data.user._id);
                navigate("/todo")
            }

            console.log(response.data)
        } catch (error) {
            setErrorMessage(error.response.data.message);
            return;
        }




    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="typing-text">{typedText}<span className="cursor">|</span></h1>
                    <p className="auth-subtitle">Create your new account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                    {errorMessage && <p className='errormessage'>{errorMessage}</p>}

                    <button type="submit" className="auth-button">
                        Create Account
                    </button>
                </form>

                <div className="auth-links">
                    <p>Already have an account? <Link to="/login" className="link">Sign in</Link></p>
                    <Link to="/" className="link">← Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
