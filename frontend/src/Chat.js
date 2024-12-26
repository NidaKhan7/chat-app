// import React, { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Replace with your backend URL

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [username, setUsername] = useState('');

//   useEffect(() => {
//     // Prompt user for a username
//     const user = prompt('Enter your username:');
//     setUsername(user);

//     // Listen for incoming messages
//     socket.on('receiveMessage', (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });

//     // Clean up on component unmount
//     return () => {
//       socket.off('receiveMessage');
//     };
//   }, []);

//   const handleSendMessage = () => {
//     if (input.trim()) {
//       const message = { sender: username, text: input };
//       socket.emit('sendMessage', message);
//       setMessages((prevMessages) => [...prevMessages, message]);
//       setInput('');
//     }
//   };

//   return (
//     <div>
//       <h2>Chat Room</h2>
//       <div>
//         {messages.map((msg, index) => (
//           <div key={index}>
//             <strong>{msg.sender}:</strong> {msg.text}
//           </div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Type a message..."
//       />
//       <button onClick={handleSendMessage}>Send</button>
//     </div>
//   );
// };

// export default Chat;
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('wss://chat-app-nida.onrender.com', {
  transports: ['websocket', 'polling'],
  });

const Chat = ({ username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch initial messages
    fetch('https://chat-app-nida.onrender.com/api/messages')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        return response.json();
      })
      .then((data) => setMessages(data))
      .catch((error) => console.error('Error fetching messages:', error));

    // Listen for incoming messages
    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { sender: username, text: message };
      socket.emit('sendMessage', newMessage);
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;

