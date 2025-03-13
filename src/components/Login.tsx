import React, { useState } from 'react';
import '../Login.css';
function Login()
{   
    const [message,setMessage] = useState('');
    const [username,setUsername] = React.useState('');
    const [password,setPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const[isLogin, setIsLogin] = useState(true);

    async function doLogin(event:any) : Promise<void>
    {
        event.preventDefault();

        var obj = {username:username, password:password};
        var js = JSON.stringify(obj);
        try
        {
            const response = await fetch('http://yourucf.com/api/login',
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
            const response = await fetch('http://yourucf.com/api/register',
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
    return(
        <div id="loginDiv">
            <span id="inner-title">
                {(() =>
                {
                    if(isLogin)
                    {
                        return 'Welcome back, Knight!';
                    }
                    else
                    {
                        return 'Create Account';
                    }
                })()}
            </span>

            {(() =>
            {
                if(isLogin)
                {
                    return(
                        <form onSubmit={doLogin}>
                            <input type="text" id="username" placeholder="Username" onChange={handleSetUserName} />
                            <input type="password" id="password" placeholder="Password" onChange={handleSetPassword} />
                            <a href="/forgot-password" id="forgotPassword">Forgot password? Reset</a>
                            <input type="submit" id="loginButton" value="Login" />
                        </form>
                    );
                }
                else
                {
                    return(
                        <form onSubmit={doRegister}>
                            <input type="text" id="firstName" placeholder="First Name" value={firstName} onChange={handleSetFirstName} />
                            <input type="text" id="lastName" placeholder="Last Name" value={lastName} onChange={handleSetLastName} />
                            <input type="text" id="userName" placeholder="Username" value={username} onChange={handleSetUserName} />
                            <input type="password" id="password" placeholder="Password" value={password} onChange={handleSetPassword} />
                            <input type="submit" id="registerButton" value="Register" />
                        </form>
                    );
                }
            })()}

            <a href="#" id="toggleForm"onClick={() => setIsLogin(!isLogin)}
            >
                {(() => {
                    if (isLogin) {
                        return "Don't have an account? Sign up";
                    } else {
                        return "Already have an account? Login";
                    }
                })()}
            </a>
        </div>

        );
};
export default Login;