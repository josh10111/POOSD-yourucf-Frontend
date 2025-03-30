import React, { useState } from 'react';
import '../Login.css';
function Login()
{   
    const [, setMessage] = useState('');
    const [username,setUsername] = React.useState('');
    const [password,setPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = React.useState('');
    const [login, setLogin] = React.useState('');

    function is_valid_email_format(emailToCheck: string): boolean {
        const hasAt = emailToCheck.includes('@');
        const hasDot = emailToCheck.includes('.');
        return hasAt && hasDot;
      }

    async function doLogin(event:any) : Promise<void>
    {
        event.preventDefault();

        var obj = {username:username, password:password};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch('https://yourucf.com/api/users/login',
                {method:'POST',body:js,headers:{'Content-Type':
        'application/json'}});
            var res = JSON.parse(await response.text());
            if( res.id <= 0 )
            {
                setMessage('User/Password combination incorrect');
            }
            else
            {
                var user ={
                    firstName:res.firstName,
                    lastName:res.lastName,
                    id:res.id
                };
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/home';
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }

    }
    async function doRegister(event:any) : Promise<void>
    {
        event.preventDefault();

        if (!is_valid_email_format(email)) {
            setMessage('Please enter a valid email address (e.g., user@example.com)');
            return; // Stop the registration process
          }

        var obj = {firstName: firstName, lastName: lastName, login: login, password:password, email: email};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch('https://yourucf.com/api/users/register',
                {method:'POST',body:js,headers:{'Content-Type':
        'application/json'}});
            var res = JSON.parse(await response.text());
            if( res.id <= 0 )
            {
                setMessage('Registration failed');
            }
            else
            {
                setMessage(`${firstName} ${lastName} signed up successfully!`)
                window.location.href = '/verify';
                setIsLogin(true);
            }
        }
        catch(error:any)
        {
            alert(error.toString());
            return;
        }

            
    }

    function handleSetUserName( e: any ) : void
    {
        setUsername( e.target.value );
    }

    function handleSetPassword( e: any ) : void
    {
        setPassword( e.target.value );
    }
  
    function handleSetFirstName( e: any ) : void
    {
        setFirstName( e.target.value );
    }
    function handleSetLastName( e: any ) : void
    {
        setLastName( e.target.value );
    }
    
    function handleSetEmail( e: any ) : void
    {
        setEmail( e.target.value );
    }

    function handleSetLogin( e: any ) : void
    {
        setLogin( e.target.value );
    }
    
    return(
        <div className="container">
            {/* determines which form is used*/}
            {(() =>
            {
                {/* login form*/}
                if(isLogin)
                {
                    return(
                        <form onSubmit={doLogin}>
                            <div className="formTitle">
                                <span style={{fontWeight: 500}}>Welcome,</span> <span style= {{fontWeight: 700, color: '#F1CA3B'}}>Knight!</span>
                             </div>
                            <div className="inputBox">
                                <input type="text" id="username" placeholder="Username" onChange={handleSetUserName} />
                                <i className='bx bxs-user'></i>
                            </div>
                            <div className='inputBox'>
                                <input type="password" id="password" placeholder="Password" onChange={handleSetPassword} />
                                <i className='bx bxs-lock-alt'></i>
                            </div>
                            
                            <input type="submit" id="loginButton" value="Login" />

                            <div className="spacer">
                                <span>____________</span>
                                    <a href="https://github.com/josh10111/POOSD-yourucf-Frontend" target="_blank" rel="noopener noreferrer">
                                    <i className='bx bxl-github'></i>
                                    </a>
                                <span>____________</span> 
                            </div>
                            <div className ="formText2">
                                <span>Don't have an account?</span>
                                <a href="#">Sign up</a>
                            </div>
                            <div className="links">
                                <a href="https://www.ucf.edu/" target="_blank" rel="noopener noreferrer">UCF</a>
                                <a href="https://webcourses.ucf.edu/" target="_blank" rel="noopener noreferrer">webcourses</a>
                                <a href="https://my.ucf.edu/" target="_blank" rel="noopener noreferrer">myUCF</a>
                            </div>
                        </form>
                    );
                }
                else {/* register form*/}
                {
                    return(
                        <form onSubmit={doRegister}>
                            <div className="formTitle">
                                <span style={{fontWeight: 700, color: '#F1CA3B'}}>Create Account</span>
                            </div>
                            <div className='inputBox'>
                                <input type="text" id="firstName" placeholder="First Name" value={firstName} onChange={handleSetFirstName} />
                            </div>
                            <div className='inputBox'>
                                <input type="text" id="lastName" placeholder="Last Name" value={lastName} onChange={handleSetLastName} />
                            </div>
                            <div className='inputBox'>
                                <input type="text" id="email" placeholder="Email" value={firstName} onChange={handleSetEmail} />
                                <i className='bx bxs-envelope' ></i>
                            </div>
                            <div className='inputBox'>
                                <input type="text" id="login" placeholder="Username" value={login} onChange={handleSetLogin} />
                                <i className='bx bxs-user'></i>
                            </div>
                            <div className='inputBox'>
                                <input type="password" id="password" placeholder="Password" value={password} onChange={handleSetPassword} />
                                <i className='bx bxs-lock-alt'></i>
                            </div>
                            
                            <input type="submit" id="registerButton" value="Register" />

                            <div className="spacer">
                                <span>____________</span>
                                    <a href="https://github.com/josh10111/POOSD-yourucf-Frontend" target="_blank" rel="noopener noreferrer">
                                    <i className='bx bxl-github'></i>
                                    </a>
                                <span>____________</span> 
                            </div>
                            <div className ="formText2">
                                <span>Already have an account?</span>
                            <a href="#">Login</a>
                            </div>
                            <div className="links">
                                <a href="https://www.ucf.edu/" target="_blank" rel="noopener noreferrer">UCF</a>
                                <a href="https://webcourses.ucf.edu/" target="_blank" rel="noopener noreferrer">webcourses</a>
                                <a href="https://my.ucf.edu/" target="_blank" rel="noopener noreferrer">myUCF</a>
                            </div>
                        </form>
                    );
                }
            })()}

            {/*left side of box*/}
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
export default Login;