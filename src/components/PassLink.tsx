import React, { useState } from 'react';
import '../Login.css';
import ucfLogo from '../assets/ucf-logo.png';

function PassLink()
{
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        
        if (!email) {
            setMessage('Please enter your email address');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await fetch('https://yourucf.com/api/request-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            setMessage(data.message || 'Reset link sent. Please check your email.');
            setEmail('');
        } catch (error: unknown) {
            setMessage('An error occurred. Please try again later.');
            console.error('Password reset error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleSetEmail(e: React.ChangeEvent<HTMLInputElement>): void {
        setEmail(e.target.value);
    }

    return(
        <div className='fake-body'>
        <div className="container">
        <div className="form-box login"> 
            <form onSubmit={handleSubmit} >
                <div className="formTitle">
                <span style={{ fontWeight: 500 }}>Reset your</span>{' '}
                <span style={{ fontWeight: 700, color: '#F1CA3B' }}>Password</span>
                </div>
                <div className="message-text">
                    <span>Enter the email associated with your account and we'll send you a link to reset your password</span>
                </div>
                <div className="inputBox">
                    <input 
                        type="text" 
                        placeholder="Email" 
                        value={email}
                        onChange={handleSetEmail}
                        required 
                    />
                    <i className='bx bxs-envelope'></i>
                </div>
                {message && (
                    <div className="message">
                        <span>{message}</span>
                    </div>
                )}

                <input 
                    type="submit" 
                    id="button" 
                    value={isLoading ? "Sending..." : "Send Email"} 
                    disabled={isLoading} 
                />
    
            </form>
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

export default PassLink;