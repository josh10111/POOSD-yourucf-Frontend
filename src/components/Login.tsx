import React, { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useLocation } from 'react-router-dom';
import '../Login.css';
import ucfLogo from '../assets/ucf-logo.png';

function Login() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const location = useLocation();

  // State to track error status for each input
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  // Check URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Check for verification success
    if (params.get('verified') === 'success') {
      setMessage('Email successfully verified! You can now log in.');
      setMessageType('success');
    } 
    // Check for verification errors
    else if (params.get('error')) {
      const errorType = params.get('error');
      switch(errorType) {
        case 'invalid_token':
          setMessage('Invalid verification link. Please request a new one.');
          break;
        case 'user_not_found':
          setMessage('User not found. Please register again.');
          break;
        case 'verification_failed':
          setMessage('Verification failed. Please try again later.');
          break;
        default:
          setMessage('An error occurred during verification.');
      }
      setMessageType('error');
    }
    
    // Clean up URL after processing params
    if (params.get('verified') || params.get('error')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  function is_valid_email_format(emailToCheck: string): boolean {
    const hasAt = emailToCheck.includes('@');
    const hasDot = emailToCheck.includes('.');
    return hasAt && hasDot;
  }

  async function doLogin(event: any): Promise<void> {
    event.preventDefault();

    let hasErrors = false;
    if (!username) {
      setUsernameError(true);
      hasErrors = true;
    } else {
      setUsernameError(false);
    }
    if (!password) {
      setPasswordError(true);
      hasErrors = true;
    } else {
      setPasswordError(false);
    }

    if (hasErrors) {
      setMessage('Username or password is empty');
      setMessageType('error');
      return;
    }

    var obj = { username: username, password: password };
    var js = JSON.stringify(obj);
    try
        {
            const response = await fetch('https://yourucf.com/api/users/login',
                {method:'POST',body:js,headers:{'Content-Type':
        'application/json'}});

            if(!response.ok)
            {
                setMessage("Invalid username or password");
                setMessageType('error');
                return;
            }
            var res = await response.json();
            if(!res.token){
                setMessage("Login failed: No token");
                setMessageType('error');
                return;
            }

            let decoded: any = jwtDecode(res.token);

            if(!decoded.id){
                setMessage("Login failed: Invalid token data");
                setMessageType('error');
            }
            var user ={
                id: decoded.id,
            };
            localStorage.setItem("user_data",JSON.stringify(user));
            window.location.href = "/dashboard";
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }
  }

  async function doRegister(event: any): Promise<void> {
    event.preventDefault();

    let hasErrors = false;
    if (!firstName) {
      setFirstNameError(true);
      hasErrors = true;
    } else {
      setFirstNameError(false);
    }
    if (!lastName) {
      setLastNameError(true);
      hasErrors = true;
    } else {
      setLastNameError(false);
    }
    if (!email) {
      setEmailError(true);
      hasErrors = true;
    } else if (!is_valid_email_format(email)) {
      setEmailError(true);
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return;
    } else {
      setEmailError(false);
    }
    if (!login) {
      setLoginError(true);
      hasErrors = true;
    } else {
      setLoginError(false);
    }
    if (!password ) {
      setPasswordError(true);
      hasErrors = true;
    }else if(!hasMinLength){
      setPasswordError(true);
       hasErrors = true;
  }else if(!hasUpperCase){
      setPasswordError(true);
       hasErrors = true;
  }else if(!hasLowerCase){
      setPasswordError(true);
       hasErrors = true;
  }else if(!hasSpecialChar){
      setPasswordError(true);
       hasErrors = true;
    } else {
      setPasswordError(false);
    }

    if (hasErrors) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    var obj = { firstName: firstName, lastName: lastName, username: login, password: password, email: email };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch('https://yourucf.com/api/users/register', {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
      var res = JSON.parse(await response.text());
      if (res.id <= 0) {
        setMessage('Registration failed');
        setMessageType('error');
      } else {
        setMessage(`${firstName} ${lastName} signed up successfully!`);
        setMessageType('success');
        window.location.href = '/verify';
        setIsLogin(true);
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  function handleSetUserName(e: any): void {
    setUsername(e.target.value);
    setUsernameError(false); 
  }

  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
    setPasswordError(false); 
  }

  function handleSetFirstName(e: any): void {
    setFirstName(e.target.value);
    setFirstNameError(false); 
  }

  function handleSetLastName(e: any): void {
    setLastName(e.target.value);
    setLastNameError(false); 
  }

  function handleSetEmail(e: any): void {
    setEmail(e.target.value);
    setEmailError(false); 
  }

  function handleSetLogin(e: any): void {
    setLogin(e.target.value);
    setLoginError(false); 
  }

  interface PasswordRequirementsProps {
    password: string;
  }
  
  const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  
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

  return (
    <div className="container">
      {(() => {
        if (isLogin) {
          return (
            <div className="form-box login">
              <form onSubmit={doLogin}>
                <div className="formTitle">
                  <span style={{ fontWeight: 500 }}>Welcome,</span>{' '}
                  <span style={{ fontWeight: 700, color: '#F1CA3B' }}>Knight!</span>
                </div>
                <div className={`inputBox ${usernameError ? 'error' : ''}`}>
                  <input type="text"id="username"placeholder="Username"onChange={handleSetUserName}/>
                  <i className='bx bxs-user'></i>
                </div>
                <div className={`inputBox ${passwordError ? 'error' : ''}`}>
                  <input type="password"id="password"placeholder="Password"onChange={handleSetPassword}/>
                  <i className='bx bxs-lock-alt'></i>
                </div>

                <div className={`message ${messageType === 'success' ? 'success-message' : ''}`}>
                  <span>{message}</span>
                </div>

                <div className="formText">
                  <span>Forgot password?</span>
                  <a href="/resetlink"> Reset</a>
                </div>

                <input type="submit" id="loginButton" value="Login" />

                <div className="spacer">
                  <span>____________</span>
                  <a href="https://github.com/josh10111/POOSD-yourucf-Frontend"target="_blank"rel="noopener noreferrer">
                    <i className='bx bxl-github'></i>
                  </a>
                  <span>____________</span>
                </div>
                <div className="formText2">
                  <span>Don't have an account? </span>
                  <a href="#" id="toggleForm" onClick={() => setIsLogin(!isLogin)}>{' '}Sign up</a>
                </div>
                <div className="links">
                  <a href="https://www.ucf.edu/" target="_blank" rel="noopener noreferrer">UCF</a>
                  <a href="https://webcourses.ucf.edu/" target="_blank" rel="noopener noreferrer">webcourses</a>
                  <a href="https://my.ucf.edu/" target="_blank" rel="noopener noreferrer">myUCF</a>
                </div>
              </form>
            </div>
          );
        } else {
          return (
            <div className="form-box register">
              <form onSubmit={doRegister}>
                <div className="formTitle">
                  <span style={{ fontWeight: 700, color: '#F1CA3B' }}>Create Account</span>
                </div>
                <div className={`inputBox ${firstNameError ? 'error' : ''}`}>
                  <input type="text"id="firstName"placeholder="First Name"value={firstName}onChange={handleSetFirstName}/>
                </div>
                <div className={`inputBox ${lastNameError ? 'error' : ''}`}>
                  <input type="text"id="lastName"placeholder="Last Name"value={lastName}onChange={handleSetLastName}/>
                </div>
                <div className={`inputBox ${emailError ? 'error' : ''}`}>
                  <input type="text"id="email"placeholder="Email"value={email}onChange={handleSetEmail}/>
                  <i className='bx bxs-envelope'></i>
                </div>
                <div className={`inputBox ${loginError ? 'error' : ''}`}>
                  <input type="text"id="login"placeholder="Username"value={login}onChange={handleSetLogin}/>
                  <i className='bx bxs-user'></i>
                </div>
                <div className={`inputBox ${passwordError ? 'error' : ''}`}>
                  <input type="password"id="password"placeholder="Password"value={password}onChange={handleSetPassword}/>
                  <i className='bx bxs-lock-alt'></i>
                </div>

                <div className="passBox">
                <text>Password must include:</text>
                <PasswordRequirements password={password} />
                </div>

                <div className={`message ${messageType === 'success' ? 'success-message' : ''}`}>
                  <span>{message}</span>
                </div>

                <input type="submit" id="registerButton" value="Create Account" />

                <div className="spacer">
                  <span>____________</span>
                    <a
                    href="https://github.com/josh10111/POOSD-yourucf-Frontend"target="_blank"rel="noopener noreferrer">
                    <i className='bx bxl-github'></i>
                    </a>
                  <span>____________</span>
                </div>
                <div className="formText2">
                  <span>Already have an account? </span>
                  <a href="#" id="toggleForm" onClick={() => setIsLogin(!isLogin)}>{' '}Login</a>
                </div>
              </form>
            </div>
          );
        }
      })()}

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
}

export default Login;