import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import {Icon} from 'react-icons-kit';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const userData = {
      username: username,
      password: password
    }

    try {
      const response = await axios.post(`http://10.8.26.88/login.php`, userData);
      const responseData = response.data;
      if(responseData.success){
        onLogin();
        navigate('/calculator/');
      }else{
        setMessage(responseData.message);
      }
    } catch (error) {  
        console.error('Login error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='login-container'>
      <div className="login-form">
        <h2>Авторизация</h2>
        {message && <p style={{color: 'red', fontSize: '15px'}}>{message}</p>}
        <div className="input-container">
          <input type="text" placeholder="Введите логин CDN" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input-container">
          <input id="password" type={passwordVisible ? 'text' : 'password'} placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="toggle-password-icon" onClick={togglePasswordVisibility}>
            <Icon icon={passwordVisible ? eyeOff : eye} size={20} />
          </span>
        </div>
        <button className="login-button" type = "button" onClick={handleLogin}>Войти</button>
      </div>
    </div>
  );
}

export default LoginPage;