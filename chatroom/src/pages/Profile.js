import React, { useState,useEffect } from 'react';
import Navbar from '../components/Navbar';
import { auth,database } from '../config';
import { updateProfile, updateEmail } from "firebase/auth";
import { ref, update,get } from "firebase/database";
import { encodeEmail } from "../DBfunc"; // 確保引入 encodeEmail 函數
// import { updateUserPhotoURL } from '../DBfunc';
import "../styles/style.css";

const Profile = () => {
  // 初始化各個欄位的狀態
  const [photoURL, setPhotoURL] = useState(auth.currentUser?.photoURL ?? "");
  const [username, setUsername] = useState(auth.currentUser?.displayName ?? "");
  const [email, setEmail] = useState(auth.currentUser?.email ?? "");
  const [phone, setPhone] = useState(auth.currentUser?.phoneNumber ?? "");
  const [addr, setAddr] = useState(""); 


  const updateAuth = async (username, email, photoURL) => {
    try {
      await updateProfile(auth.currentUser, { displayName: username, photoURL });
      await auth.currentUser.reload();
      if (email !== auth.currentUser?.email) {
        await updateEmail(auth.currentUser, email);
      }
    } 
    catch (error) {
      console.error("Error updating authentication data:", error);
    }
  };

  const updateFirebase = async (phone, addr) => {
    try {
      const email = auth.currentUser?.email;
      if (!email) throw new Error("No authenticated user email");
  
      const encodedEmail = encodeEmail(email);
      const userRef = ref(database, `users/${encodedEmail}`);
  
      await update(userRef, {
        phone,
        addr,
      });
  
      console.log("Updated phone and address in Realtime Database");
    } catch (error) {
      console.error("Error updating Firebase phone/addr:", error);
    }
  };

  useEffect(() => {
    if (!auth.currentUser) return; // Wait for auth to be ready
  
    const getAddr = async () => {
      const encodedEmail = encodeEmail(auth.currentUser.email);
      const userRef = ref(database, `users/${encodedEmail}`);
  
      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setAddr(data.addr ?? "");
          setPhone(data.phone ?? auth.currentUser?.phoneNumber ?? "");
        }
      } catch (error) {
        console.error("Error getting user address:", error);
      }
    };
  
    getAddr();
  }, [auth.currentUser]);


  const handleUpdate = async () => {
    try {
      await updateAuth(username, email, photoURL);
      await updateFirebase(phone, addr);
      alert("Profile updated successfully!");
    } 
    catch (error) {
      alert("Error updating profile:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        
        <h1 style={{fontSize:"1.5rem"}}>Profile</h1>
        {/* <h3>Welcome to your profile!</h3> */}
        <img 
          src={photoURL || "/user-3296.svg"} 
          alt="User Profile" 
          width="75px" 
          height="75px" 
          style={{ borderRadius: "50%" }}
        />

        <div>
          <div>
            <label>Profile Picture URL:</label>
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder={auth.currentUser?.photoURL ?? "Enter your profile picture URL"}
            />
          </div>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={auth.currentUser?.displayName ?? "Enter your username"}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              readOnly
              // onChange={(e) => setEmail(e.target.value)}
              placeholder={auth.currentUser?.email ?? "Enter your email"}
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={"Enter your phone number"}
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              placeholder="Enter your address"
            />
          </div>

          {/* 更新按鈕 */}
          <button onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;