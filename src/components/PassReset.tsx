import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Login.css';
import ucfLogo from '../assets/ucf-logo.png';


interface PasswordRequirementsProps {
    password: string;
  }
  
  const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
    const [hasMinLength, setHasMinLength] = useState(false);
    const [hasUpperCase, setHasUpperCase] = useState(false);
    const [hasLowerCase, setHasLowerCase] = useState(false);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);
  
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const specialCharRegex = /[^\w\s]/; 
  
    React.useEffect(() => {
      setHasMinLength(password.length >= 8);
      setHasUpperCase(uppercaseRegex.test(password));
      setHasLowerCase(lowercaseRegex.test(password));
      setHasSpecialChar(specialCharRegex.test(password));
    }, [password]);
  
    const requirements = [
      { text: 'At least 8 characters', isMet: hasMinLength },
      { text: 'At least 1 uppercase letter', isMet: hasUpperCase },
      { text: 'At least 1 lowercase letter', isMet: hasLowerCase },
      { text: 'At least 1 special character', isMet: hasSpecialChar },
    ];
  
    return (
        <div className="password-requirements">
        {requirements.map((req, index) => (
          <li key={index} className={req.isMet ? 'met' : 'not-met'}>
            {!req.isMet && <i className='bx bx-x not-met-icon'></i>}
            {req.isMet && <i className='bx bx-check'></i>}
            <span>{req.text}</span>
          </li>
        ))}
      </div>
    );
  };

  function PassReset() 
  {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    // extract token from URL on component mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get('token');
        
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            setMessage('Invalid or missing reset token');
        }
    }, [location]);
    
    // check if the passwords match and meet requirements
    const validatePasswords = () => {
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const specialCharRegex = /[^\w\s]/;
        
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return false;
        }
        
        if (password.length < 8 || 
            !uppercaseRegex.test(password) || 
            !lowercaseRegex.test(password) || 
            !specialCharRegex.test(password)) {
            setMessage('Please meet all password requirements');
            return false;
        }
        
        return true;
    };

    async function handleResetPassword(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        
        if (!validatePasswords()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await fetch('https://yourucf.com/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setIsSuccess(true);
                setMessage(data.message || 'Password successfully reset');
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                setMessage(data.error || 'Failed to reset password');
            }
        } catch (error: unknown) {
            // Using unknown instead of any
            setMessage('An error occurred. Please try again.');
            console.error('Password reset error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleSetPassword(e: React.ChangeEvent<HTMLInputElement>): void {
        setPassword(e.target.value);
    }
    
    function handleSetConfirmPassword(e: React.ChangeEvent<HTMLInputElement>): void {
        setConfirmPassword(e.target.value);
    }

    return(
        <div className='fake-body'>
        <div className="container">
            <div className="form-box login"> 
                <form onSubmit={handleResetPassword}>
                    <div className="formTitle">
                        <span style={{ fontWeight: 500 }}>Set New</span>{' '}
                        <span style={{ fontWeight: 700, color: '#F1CA3B' }}>Password</span>
                    </div>
                    <div className="message-text">
                        <span>Enter a new password below to change your password</span>
                    </div>
                    
                    <div className="inputBox">
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="New Password" 
                            onChange={handleSetPassword}
                            disabled={isSuccess}
                        />
                        <i className='bx bxs-lock-alt'></i>
                    </div>
                    <div className="inputBox">
                        <input 
                            type="password" 
                            id="repassword" 
                            placeholder="Re-enter New Password" 
                            onChange={handleSetConfirmPassword}
                            disabled={isSuccess}
                        />
                        <i className='bx bxs-lock-alt'></i>
                    </div>

                    <div className="passBox">
                        <text>Password must include:</text>
                        <PasswordRequirements password={password} />
                    </div>

                    {message && (
                        <div className={`message ${isSuccess ? 'success' : ''}`}>
                            <span>{message}</span>
                        </div>
                    )}
    
                    <input 
                        type="submit" 
                        id="button" 
                        value={isLoading ? "Processing..." : "Reset Password"} 
                        disabled={isLoading || isSuccess || !token}
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
}

export default PassReset;