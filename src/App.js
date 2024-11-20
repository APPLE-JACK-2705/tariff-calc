import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
    <Router>
        <div className='App'>
          <Routes>
            <Route path="/calculator" element={<LoginPage onLogin={handleLogin}/>}/>
            <Route path='/calculator/' element={isAuthenticated ? <HomePage onLogout={handleLogout}/> : <LoginPage onLogin={handleLogin}/>}/>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
