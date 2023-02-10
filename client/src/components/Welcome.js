import React from 'react';
import welcome from '../assets/welcome.gif';
import Logout from './Logout';

function Welcome({ currentUser }) {
    return (
        <>
            <div className="welcome-container">
                <div className="welcome-in-logout">
                    <Logout />
                </div>
                <div className="content">
                    <img src={welcome} alt="Welcome to TEXTit." />
                    <h2>Welcome, <span>{currentUser.username}!</span></h2>
                    <h3>Select the user to start conversation. Thank You!</h3>
                </div>
            </div>
        </>
    )
}

export default Welcome;