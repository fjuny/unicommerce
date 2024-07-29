import React, { useState } from 'react';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const model = "EleutherAI/gpt-neo-2.7B"; // Smaller model

  async function query(data, retries = 3, backoff = 1000) {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          headers: {
            Authorization: "Bearer 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",  // Replace with your actual token
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (response.status === 503 && retries > 0) {
        // Retry with exponential backoff
        setTimeout(() => query(data, retries - 1, backoff * 2), backoff);
        return null;
      } else if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      } else {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => query(data, retries - 1, backoff * 2), backoff);
      } else {
        setError('Error querying the model. Please try again later.');
        console.error('Error querying the model:', error);
      }
      return null;
    }
  }

  const sendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setLoading(true);
    setError(null);

    try {
      const conversationContext = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') + `\nUser: ${inputMessage}\nBot:`;

      const response = await query({ inputs: conversationContext });

      if (response && response[0] && response[0].generated_text) {
        const botResponse = response[0].generated_text;
        const botMessage = botResponse.split('Bot:').pop().trim();
        setMessages([...messages, userMessage, { role: 'bot', content: botMessage }]);
      } else {
        console.error('Unexpected response format:', response);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      setError('Error generating message. Please try again later.');
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
