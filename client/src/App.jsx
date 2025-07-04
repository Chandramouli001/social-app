import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import axios from 'axios';

// Initialize socket connection
const socket = io('https://social-app-back1.vercel.app/');

function App() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [sender, setSender] = useState('User');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false); // NEW

  useEffect(() => {
    axios.get('https://social-app-back1.vercel.app/api/messages')
      .then(res => setMessages(res.data.reverse()));

    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off('receiveMessage');
  }, []);

  const handleSend = async () => {
    const msg = { sender, content, image: imageUrl };
    await axios.post('https://social-app-back1.vercel.app/api/messages', msg);
    socket.emit('sendMessage', msg);
    setContent('');
    setImageUrl('');
    setShowImageInput(false); // Hide image input after send
  };

  return (
    <div className="chat-container">
      <div className="header">Social Chat</div>

      <input
        className="name-input"
        value={sender}
        onChange={e => setSender(e.target.value)}
        placeholder="Your name"
      />

      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className="message">
            <div className="avatar">{msg.sender?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="message-content">
              <div className="name">{msg.sender}</div>
              <div className="text">{msg.content}</div>
              {msg.image && <img src={msg.image} alt="Post" />}
            </div>
          </div>
        ))}
      </div>

      <div className="input-section">
        <input
          placeholder="Type your message"
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        {showImageInput && (
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
        )}

        <button onClick={() => setShowImageInput(prev => !prev)}>
          {showImageInput ? '×' : '+'}
        </button>

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
