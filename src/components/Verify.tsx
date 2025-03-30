//import React, { useState } from 'react';
import '../Login.css';

function Verify()
{
    return(
        <div className="container">
            <div className="form-box login"> 
                <div className="verification-box">
                    <i className='bx bxs-envelope'></i>
                    <h1>Verify your email</h1>
                    <h2>We've sent a verification link to your email address</h2>

                    <a href="https://yourucf.com/">
                        <h3>Back to login</h3>
                    </a>
                </div>
            </div>
            <div className="toggle-box">
                <div className="panel">
                    <img src="assets/ucf_constellation_logo.PNG" alt="UCF constellation logo"></img>
                    <h1>yourUCF</h1>
                    <h3>Chart your UCF path to</h3>
                    <h2>graduation</h2>
                </div>

            </div>
        </div>
    );
};
export default Verify;