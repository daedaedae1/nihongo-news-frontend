import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

import NavBar from './components/NavBar';

import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/dare', {
      method: 'POST',
      credentials: "include"
    })
    .then(response => response.ok? response.json() : null)
    .then(data => {
      if(data) setUserInfo(data);
    });
  }, []);

  return (
    <>
      <NavBar userInfo={userInfo}></NavBar>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUserInfo={setUserInfo}   />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
