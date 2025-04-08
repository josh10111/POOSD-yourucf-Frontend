//import React, { useState } from 'react';
import '../Login.css';
import ucfLogo from '../assets/ucf-logo.png';

function Verify()
{
    return(
        <div className='fake-body'>
        <div className="container">
            <div className="form-box login"> 
                <div className="verification-box">
                    <i className='bx bxs-envelope'></i>
                    <h1>Verify your email</h1>
                    <h2>We've sent a verification link to your email address</h2>

                    <a href="/">
                        <h3>Back to login</h3>
                    </a>
                </div>
            </div>
            <div className="toggle-box">
                <div className="panel">
                <img src={ucfLogo} alt="UCF constellation logo"></img>
                    <h1>yourUCF</h1>
                    <h3>Chart your UCF path to</h3>
                    <h2>graduation</h2>
                </div>

            </div>
        </div>
        </div>
    );
};
export default Verify;