import React, { useState } from 'react';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiEndpoint = "http://localhost:5038/api/chat"; // Ensure this matches your backend server

  const query = async (data, retries = 3, backoff = 1000) => {
    try {
      const response = await fetch(apiEndpoint, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => query(data, retries - 1, backoff * 2), backoff);
      } else {
        setError(`Error querying the model: ${error.message}`);
        console.error('Error querying the model:', error);
      }
      return null;
    }
  };
  

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setLoading(true);
    setError(null);

    try {
      const conversationContext = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') + `\nUser: ${inputMessage}\nBot:`;

      const response = await query({ text: conversationContext });

      if (response && response.content) {
        const botResponse = response.content;
        setMessages([...messages, userMessage, { role: 'bot', content: botResponse }]);
      } else {
        console.error('Unexpected response format:', response);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError(`Error generating message: ${error.message}`);
      console.error('Error generating message:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>ChatBot</h1>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <p key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <strong>{msg.role}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ChatBot;
