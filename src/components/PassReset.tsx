import React, { useState } from 'react';
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

    function handleSetPassword(e: any): void {
        setPassword(e.target.value);
      }


    return(
    <div className="container">
        <div className="form-box login"> 
            <form action="">
                <div className="formTitle">
                    <span style={{ fontWeight: 500 }}>Set New</span>{' '}
                    <span style={{ fontWeight: 700, color: '#F1CA3B' }}>Password</span>
                </div>
                <div className="message-text">
                    <span>Enter a new password below to change your password
                        
                    </span>
                </div>
                
                <div className="inputBox">
                  <input type="password"id="password"placeholder="New Password"onChange={handleSetPassword}/>
                  <i className='bx bxs-lock-alt'></i>
                </div>
                <div className="inputBox">
                <input type="password"id="repassword"placeholder="Re-enter New Password"onChange={handleSetPassword}/>
                <i className='bx bxs-lock-alt'></i>
                </div>

                <div className="passBox">
                <text>Password must include:</text>
                <PasswordRequirements password={password} />
                </div>

    
                <input type="submit" id="button" value="Reset Password" />
    
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
    );
};

export default PassReset;