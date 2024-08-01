import React, { useState } from 'react';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiEndpoint = "http://localhost:5038/api/chat";

  const query = async (data) => {
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
      if (!result || typeof result.content !== 'string') {
        throw new Error('Invalid response format');
      }
      return result;
    } catch (error) {
      console.error('Error in query:', error);
      throw error; 
    }
  };
  
  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;
  
    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setLoading(true);
    setError(null);
  
    try {
      const conversationContext = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') + `\nUser: ${inputMessage}\nBot:`;
  
      const response = await query({ text: conversationContext });
      setMessages(prevMessages => [...prevMessages, { role: 'bot', content: response.content }]);
    } catch (error) {
      setError(`Error generating message: ${error.message}`);
      console.error('Error generating message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>UniAId</h1>
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
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ChatBot;