import React from 'react';
import RoomList from '../components/RoomList';
import { createChatroom, addUserToChatroom } from '../DBfunc';
import { auth,database } from "../config";
import ChatInput from '../components/ChatInput';

const Chatroom = () => {
    // const oom = [
    //     { id: 1, name: 'General' },
    //     { id: 2, name: 'Technology' },
    //     { id: 3, name: 'Sports' },
    // ];

    return (
        <div className='Chatroom'>
            {/* here need to do "flex" ! (正常情況 -> 左右 | RWD -> 上下排列) */}
            <div className='List'>
                <h1>Chatroom</h1>
                <RoomList/>
            </div>

            <div className='Chat'>
                {/* 之後可以放 這個 chatroom 的名字 ! */}
                <h1>Chat</h1>
                <ChatInput/>
            </div>
            {/* <button onClick={() => createChatroom()}>Create Chatroom</button> */}
        </div>
    );
    // const [messages, setMessages] = useState([]);
    // const [input, setInput] = useState('');

    // useEffect(() => {
    //     // Simulate fetching initial messages
    //     const initialMessages = [
    //         { id: 1, user: 'Alice', text: 'Hello!' },
    //         { id: 2, user: 'Bob', text: 'Hi there!' },
    //     ];
    //     setMessages(initialMessages);
    // }, []);

    // const handleSendMessage = () => {
    //     if (input.trim()) {
    //         const newMessage = {
    //             id: messages.length + 1,
    //             user: 'You',
    //             text: input,
    //         };
    //         setMessages([...messages, newMessage]);
    //         setInput('');
    //     }
    // };

    // return (
    //     <div className="chatroom">
    //         <div className="chatroom-messages">
    //             {messages.map((message) => (
    //                 <div key={message.id} className="chatroom-message">
    //                     <strong>{message.user}:</strong> {message.text}
    //                 </div>
    //             ))}
    //         </div>
    //         <div className="chatroom-input">
    //             <input
    //                 type="text"
    //                 value={input}
    //                 onChange={(e) => setInput(e.target.value)}
    //                 placeholder="Type a message..."
    //             />
    //             <button onClick={handleSendMessage}>Send</button>
    //         </div>
    //     </div>
    // );
};

export default Chatroom;