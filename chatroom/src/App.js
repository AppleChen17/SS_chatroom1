import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Chatroom from './pages/Chatroom';
import Login from './pages/Login';
import ChatInput from './components/ChatInput';
import RoomList from './components/RoomList';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config";

function App() {

  // SOLVE: 刷新就登出 => 因為沒有 auth 的狀態 ! (useAuthState => 會自動監控 auth 狀態變化) => 所以 need 等 firebase !
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // if (loading) return <div>Loading...</div>;
  // 這可能讓 Hook 沒機會執行到 => 會報錯 !!!!!!
  useEffect(() => {
    if (!user && location.pathname !== "/") 
    {
      navigate("/");
    }
  }, [user, location, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App" style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* {location.pathname !== "/" && <Navbar />} */}

      <div>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/chatroom" element={<Chatroom />} />
          <Route path="/chatinput" element={<ChatInput />} />
          <Route path="/roomlist" element={<RoomList />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;
