
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { MyContext } from '../App';

const Home = () => {
    const [typedText, setTypedText] = useState('');
    const [subtitleText, setSubtitleText] = useState('');
    const fullText = 'Cross-Border Collaboration made simple';
    const subtitle = 'Organize your work, boost productivity, achieve your goals';
    const {isAuthenticated} = useContext(MyContext)

    useEffect(() => {
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTypedText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                // Start typing subtitle after main text is done
                setTimeout(() => {
                    let subtitleIndex = 0;
                    const subtitleInterval = setInterval(() => {
                        if (subtitleIndex <= subtitle.length) {
                            setSubtitleText(subtitle.slice(0, subtitleIndex));
                            subtitleIndex++;
                        } else {
                            clearInterval(subtitleInterval);
                        }
                    }, 50);
                }, 500);
            }
        }, 80);

        return () => clearInterval(typingInterval);
    }, []);

    return (
        <div>
            <nav className="home-nav">
                <div className="nav-brand">TaskBoard</div>
                <div className="nav-links">
                    <button className='nav-link'>+ Create Board</button>
                    <Link to="/login" className="nav-link">Login</Link>
                </div>
            </nav>
            <div className='hero-section'>
                <div className='hero-section-left'>
                    <h1 className="hero-title">
                        {typedText}<span className="cursor">|</span>
                    </h1>
                    <p className="hero-subtitle">
                        {subtitleText}<span className="subtitle-cursor">|</span>
                    </p>

                    <div className="hero-buttons">
                        <Link to={isAuthenticated ? "/todo" : "/login"} className="hero-button primary">
                            Start Managing Tasks
                        </Link>
                        <Link to="/register" className="hero-button secondary">
                            Create Account
                        </Link>
                    </div>
                </div>
                <div className='hero-section-left-bg'></div>
                <div className='hero-image-bg'></div>
                <div className='hero-section-right'>
                    <img className='hero-image' src="/todo.png" alt="Hero Image" />
                </div>
            </div>
        </div>
    );
};

export default Home;
