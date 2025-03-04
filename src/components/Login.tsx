import React, { useState } from 'react';
import axios from 'axios';
import { buildPath } from './Path.tsx';
import * as tokenStorage from '../tokenStorage.ts';

// A simple JWT decoder for the browser
function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }
    // Decode the payload
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Pad with '=' if needed
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

function Login() {
  const [message, setMessage] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setPassword] = useState('');

  function handleSetLoginName(e: any): void {
    setLoginName(e.target.value);
  }

  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }

  async function doLogin(event: any): Promise<void> {
    event.preventDefault();
    const obj = { login: loginName, password: loginPassword };
    const js = JSON.stringify(obj);
    const config = {
      method: 'post',
      url: buildPath('api/login'),
      headers: { 'Content-Type': 'application/json' },
      data: js
    };
    axios(config)
      .then(function (response) {
        const res = response.data;
        if (res.error) {
          setMessage('User/Password combination incorrect');
        } else {
          tokenStorage.storeToken(res);
          const token = tokenStorage.retrieveToken() || '';
          const ud: any = decodeJWT(token);
          if (!ud) {
            setMessage("Failed to decode token");
            return;
          }
          const userId = ud.userId;
          const firstName = ud.firstName;
          const lastName = ud.lastName;
          const user = { firstName, lastName, id: userId };

          localStorage.setItem('user_data', JSON.stringify(user));
          window.location.href = '/cards';
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div id="loginDiv">
      <span id="inner-title">PLEASE LOG IN</span><br />
      <input type="text" id="loginName" placeholder="Username" onChange={handleSetLoginName} /><br />
      <input type="password" id="loginPassword" placeholder="Password" onChange={handleSetPassword} /><br />
      <input type="submit" id="loginButton" className="buttons" value="Do It" onClick={doLogin} />
      <span id="loginResult">{message}</span>
    </div>
  );
}

export default Login;
