import React from 'react';
import RoomList from '../components/RoomList';
import ChatInput from '../components/ChatInput';
import Navbar from '../components/Navbar';

const Chatroom = () => {
    // const oom = [
    //     { id: 1, name: 'General' },
    //     { id: 2, name: 'Technology' },
    //     { id: 3, name: 'Sports' },
    // ];

    // const { selectedRoomId } = useRoom(); // 這個是 HOOK ! (useRoom 是一個 HOOK)
    // const [chatroomName, setChatroomName] = useState('');

    return (
        // 靠著 flex 來控制解決了 ! 好像是因為像 Navbar 這種 component 的空間是不計算在裡面的，所以那樣條不行
        // 啊這樣設成 flex 讓底下自己解決就可以了 !

        // <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' , backgroundColor: '#FAEBD7'}}>
        // <div style={{ display: 'flex', flexDirection: 'column', height: '100vh'}}>
        //     {/* here need to do "flex" ! (正常情況 -> 左右 | RWD -> 上下排列) */}
        //     <Navbar/>

        //     <div className="Chatroom" style={{ display: 'flex', flex: 1 }}>
        //         <div className='List' style={{}}>
        //             <h2 style={{ textAlign: 'center',borderBottom:"3px solid black", backgroundColor :"#F5F5F5"}}>Chatroom List</h2>
        //             <RoomList/>
        //         </div>

        //         <div className='Chat'>
        //             {/* 之後可以放 這個 chatroom 的名字 ! */}
        //             <h2 style={{ textAlign: 'center' ,borderBottom:"3px solid black", backgroundColor :"#F5F5F5"}}>ChatRoom</h2>
        //             <ChatInput/>
        //         </div>
        //         {/* <button onClick={() => createChatroom()}>Create Chatroom</button> */}
        //     </div>
        // </div>

        <div className="chatroom-container">
            <Navbar />
            <div className="chatroom">
                <div className="chatroom-list">
                <h2 className="section-header"> Chatroom List </h2>
                <div className="scrollable">
                    <RoomList />
                </div>
                </div>
                <div className="chatroom-main">
                <h2 className="section-header">ChatRoom</h2>
                <div className="scrollable">
                    <ChatInput />
                </div>
                </div>
            </div>
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