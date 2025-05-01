// 底下輸入的部分 => 要負責把有打的文字內容寫入 msg 的array 裡面 !!!

import React, { useState,useEffect } from 'react';
import "../styles/style.css"
import { createMessage } from '../DBfunc'; 
import { useRoom } from '../RoomContext'; // useRoom => get the room id ! (is a HOOK !!!)
import { auth,database } from '../config'; 
import { ref, remove } from "firebase/database";
import { loadMessage } from '../DBfunc';
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import HoverTrashIcon from './HoverTrashIcon';

const ChatInput = () => {
    const { selectedRoomId } = useRoom();

    // messages => the array !! 
    const [allmessages, setallMessages] = useState([]);
    // newMessage => for the input section !!!   
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
      if (!selectedRoomId) return;
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

            if(newMessage.startsWith("$haha")) 
            {
              setTimeout(async () => {
                const botMsgObj = {
                    sender: "EchoBot HAHA 🤖",
                    time: Date.now(),
                    msg: `${newMessage.replace('$haha', '').trim()}`,
                };
      
                const botKey = await createMessage(selectedRoomId, botMsgObj.msg, botMsgObj.sender);
                botMsgObj.key = botKey;
      
                setallMessages(prev => [...prev, botMsgObj]);
              }, 500); // delay for realism
            }
        }
    };

    const handleUnsend = async (msgId) => {
      const updatedMessages = allmessages.filter(msg => msg.key !== msgId);

        // Delete the message from the database
        console.log("Message unsent:", msgId);
        try {
          const messageRef = ref(database, `chatrooms/${selectedRoomId}/Message/${msgId}`);
          await remove(messageRef);
          console.log("Message removed:", msgId);
        } 
        catch (error) {
            console.error("Remove failed:", error);
        }

      setallMessages(updatedMessages);
    }

    // const [isHovered, setIsHovered] = useState(false);

    return (
      <div className="chat-container">
        <div className="msg">

          {auth.currentUser && 
            allmessages.map((msgObj) => (
              <div
                key={msgObj.key}
                className={
                  msgObj.sender === auth.currentUser.email
                    ? 'my-message'
                    : msgObj.sender === 'EchoBot HAHA 🤖'
                    ? 'bot-message'
                    : 'other-message'
                }
              >
                <div className="msg-header" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem" }}>
                  <span>{new Date(msgObj.time).toLocaleTimeString()}</span>
                  <button style={{ background: "none", border: "none" }}>
                    {msgObj.sender === auth.currentUser.email && (
                      <HoverTrashIcon onClick={() => handleUnsend(msgObj.key)} />
                    )}
                  </button>
                </div>

                <div style={{ fontSize: "0.8rem" }}>
                  {msgObj.sender === auth.currentUser.email
                    ? (auth.currentUser.displayName || auth.currentUser.email)
                    : msgObj.sender}
                  : {msgObj.msg}
                </div>
            </div>
          ))
        }
        </div>
        <div className="input-msg">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message : D"
          disabled={!selectedRoomId}
          style={{ fontSize: "0.8rem" }}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            if (!selectedRoomId) 
            {
              alert("Choose a room first!");
              return;
            }
            handleSend();
          }}
          disabled={!selectedRoomId}
        >
          <img className="send" src="/paper-plane-regular.svg" alt="send" style={{width:"15px",height:"15px",}}/>
        </button>
        </div>
      </div>
  );
};

export default ChatInput;