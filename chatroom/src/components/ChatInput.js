// 底下輸入的部分 => 要負責把有打的文字內容寫入 msg 的array 裡面 !!!

import React, { useState,useEffect } from 'react';
import "../styles/style.css"
import { createMessage } from '../DBfunc'; 
import { useRoom } from '../RoomContext'; // useRoom => get the room id ! (is a HOOK !!!)
import { auth } from '../config'; 
import { loadMessage } from '../DBfunc';

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
    <div>
      {/* the upper message part ! */}
      <div className='msg' key="msg">
      {allmessages.map((msgObj) => (
        <div key={msgObj.key}>
            At {new Date(msgObj.time).toLocaleTimeString()} {msgObj.sender}: {msgObj.msg}
        </div>
        ))}
      </div>

      {/* input message */}
      <div className = "input-msg">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message : D"
        />

        {/* send ! */}
        {/* <button onClick={handleSend} className='send'>
            <img src='../'></img>
        </button >*/}

        <button type="button" class="btn btn-primary" onClick={handleSend}>
        <i class="bi bi-send-fill"></i>Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;