import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Bookmark from './pages/Bookmark';
import Wordbook from './pages/Wordbook';
import Guide from './pages/Guide';
import NewsDetail from './pages/NewsDetail';

import NavBar from './components/NavBar';

import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

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
      <ToastContainer position="bottom-center" autoClose={1500}/>
      <NavBar userInfo={userInfo} setUserInfo={setUserInfo}></NavBar>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home userInfo={userInfo} />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/wordbook" element={<Wordbook />} />
          <Route path="/guide" element={<Guide userInfo={userInfo} />} />
          <Route path="/news" element={<NewsDetail />} />
          <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile userInfo={userInfo} setUserInfo={setUserInfo} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
