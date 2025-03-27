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
    //const [email, setEmail] = React.useState('');

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

        var obj = {firstName: firstName, lastName: lastName, username: username, password:password, };
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
    /*
    function handleSetEmail( e: any ) : void
    {
        setEmail( e.target.value );
    }
    */
    return( 
        <div className="form">
            {/* shows either Welcome back, Knight OR Create Account*/}
            <div className="formTitle">
                {isLogin ? (
                    <>
                        <span style={{ fontWeight: 500 }}>Welcome back,</span>{' '}
                        <span style={{ fontWeight: 700, color: '#F1CA3B' }}>Knight!</span>
                    </>
                    ) : (
                        <span style={{ fontWeight: 700, color: '#F1CA3B' }}>Create Account</span>
                )}
            </div>

            {/* determines which form is used*/}
            {(() =>
            {
                {/* login form*/}
                if(isLogin)
                {
                    return(
                        <form onSubmit={doLogin}>
                            <div className='inputBox'>
                                <input type="text" id="username" placeholder="Username" onChange={handleSetUserName} />
                                <i className='bx bx-user'></i>
                            </div>
                            <div className='inputBox'>
                                <input type="password" id="password" placeholder="Password" onChange={handleSetPassword} />
                                <i className='bx bx-lock-alt'></i>
                            </div>

                            <div className='formText'>
                                <span>Forgot password?</span>
                                <a href="/forgot-password" id="forgotPassword">Reset</a>
                            </div>
                            
                            <input type="submit" id="loginButton" value="Login" />
                        </form>
                    );
                }
                else {/* register form*/}
                {
                    return(
                        <form onSubmit={doRegister}>
                            <div className='inputBox'>
                                <input type="text" id="firstName" placeholder="First Name" value={firstName} onChange={handleSetFirstName} />
                                <i className='bx bx-first-page'></i>
                            </div>
                            <div className='inputBox'>
                                <input type="text" id="lastName" placeholder="Last Name" value={lastName} onChange={handleSetLastName} />
                                <i className='bx bx-first-page'></i>
                            </div>
                            {/*
                            <div className='inputBox'>
                                <input type="text" id="email" placeholder="Email" value={firstName} onChange={handleSetEmail} />
                                <i className='bx bx-envelope' ></i>
                            </div>
                            */}
                            <div className='inputBox'>
                                <input type="text" id="userName" placeholder="Username" value={username} onChange={handleSetUserName} />
                                <i className='bx bx-user'></i>
                            </div>
                            <div className='inputBox'>
                                <input type="password" id="password" placeholder="Password" value={password} onChange={handleSetPassword} />
                                <i className='bx bx-lock-alt'></i>
                            </div>
                            
                            <input type="submit" id="registerButton" value="Register" />
                        </form>
                    );
                }
            })()}

            {/* spacer w/ git link*/}
            <div className='spacer'>
                <span>____________</span>
                <a href="https://github.com/josh10111/POOSD-yourucf-Frontend"></a>
                <i className='bx bxl-github'></i>
                <span>____________</span>
            </div>

            {/* determins bottom text of form*/}
            <div className='formText2'>
                {isLogin ? (
                        <>
                            <span>Don't have an account?</span>
                            <a href="#" id="toggleForm"onClick={() => setIsLogin(!isLogin)}>Sign up</a>
                        </>
                    ) : (
                        <>
                            <span>Already have an account?</span>
                            <a href="#" id="toggleForm"onClick={() => setIsLogin(!isLogin)}>Login</a>
                        </>
                )}
            </div>

            {/* links to other resources users may need*/}
            <div className="links">
                <a href="https://www.ucf.edu/">UCF</a>
                <a href="https://webcourses.ucf.edu/">webcourses</a>
                <a href="https://my.ucf.edu/">myUCF</a>
            </div>
        </div>

        );
};
export default Login;