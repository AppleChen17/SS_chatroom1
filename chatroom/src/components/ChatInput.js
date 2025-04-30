// 底下輸入的部分 => 要負責把有打的文字內容寫入 msg 的array 裡面 !!!

import React, { useState,useEffect } from 'react';
import "../styles/style.css"
import { createMessage } from '../DBfunc'; 
import { useRoom } from '../RoomContext'; // useRoom => get the room id ! (is a HOOK !!!)
import { auth,database } from '../config'; 
import { loadMessage } from '../DBfunc';
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons' // import icon from fontawesome

const ChatInput = () => {
    const { selectedRoomId } = useRoom();

    // messages => the array !! 
    const [allmessages, setallMessages] = useState([]);
    // newMessage => for the input section !!!   
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        console.log("selectedRoomId = ", selectedRoomId);
        const historyMessages = async () => {
            const messages = await loadMessage(selectedRoomId);
            if (messages) {
                setallMessages(messages);
            }
            else setallMessages([]);
        };

        historyMessages();
    }, [selectedRoomId]); // dependency : selected RoomID

    const handleSend = async () => {
        if (newMessage.trim() !== '') 
        {
            const newMsgObj = 
            {
                sender: auth.currentUser.email,
                time: Date.now(),
                msg: newMessage,
            };
             
            // get UNIQUE id !!! => 這樣才可以得到他在那裏的 id 代號 !
            const msgKey = await createMessage(selectedRoomId, newMessage, newMsgObj.sender);
            newMsgObj.key = msgKey;

            setallMessages(prevMessages => [...prevMessages, newMsgObj]);
            setNewMessage('');
        }
    };

    return (
      <div className="chat-container">
        <div className="msg">
          {allmessages.map((msgObj) => (
            <div key={msgObj.key} className={msgObj.sender === auth.currentUser.email ? 'my-message' : 'other-message'}>
              <span>{new Date(msgObj.time).toLocaleTimeString()}</span>
              <div>{msgObj.sender}: {msgObj.msg}</div>
            </div>
          ))}
        </div>
        <div className="input-msg">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message : D"
          />
          <button type="button" className="btn btn-primary" onClick={handleSend}>
            {/* <i className="bi bi-send-fill"></i>Send */}
            <img className='send' src="/paper-plane-regular.svg" alt="send"  />
            {/* <FontAwesomeIcon icon="fa-solid fa-paper-plane" /> */}
          </button>
        </div>
      </div>
  );
};

export default ChatInput;