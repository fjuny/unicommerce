import React, { useState, useEffect } from 'react';
import List from './CRUD/List';
import './Promotions.css';

const googleApiKey = 'AIzaSyCyRV16sJwHzAdU75NFdYYOXyrw1RbMbNI'; 

function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [activeTab, setActiveTab] = useState('vouchers');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [productName, setProductName] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    fetchPromotions();
  }, [activeTab]);

  const fetchPromotions = async () => {
    try {
      const response = await fetch(`/fyp/unicommerceapp/GetPromotions?type=${activeTab}`);
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const editPromotion = async (id, promotion) => {
    try {
      await fetch(`/fyp/unicommerceapp/EditPromotion/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promotion)
      });
      fetchPromotions();
    } catch (error) {
      console.error('Error editing promotion:', error);
    }
  };

  const deletePromotion = async (id) => {
    try {
      await fetch(`/fyp/unicommerceapp/DeletePromotion?id=${id}`, {
        method: 'DELETE'
      });
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const generateCaption = async () => {
    try {
      const response = await fetch('/fyp/unicommerceapp/GenerateCaption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, keyword })
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const caption = await response.json();
      setGeneratedCaption(caption);
  
      // Use Google's Cloud Natural Language API to generate a caption
      const googleResponse = await fetch('https://language.googleapis.com/v1/documents:analyzeEntities?key=' + googleApiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document: {
            type: 'PLAIN_TEXT',
            content: `${productName} ${keyword}`
          },
          encodingType: 'UTF8'
        })
      });
  
      if (!googleResponse.ok) {
        throw new Error(`Google API Error: ${googleResponse.status} ${googleResponse.statusText}`);
      }
  
      const googleCaption = await googleResponse.json();
      console.log(googleCaption); // Check the response data
  
      if (googleCaption.entities && googleCaption.entities.length > 0) {
        setGeneratedCaption(googleCaption.entities[0].description);
      } else {
        console.log('No entities found');
      }
    } catch (error) {
      console.error('Error generating caption:', error);
    }
  };
  

  return (
    <div className="promotions-container">
      <h1>Promotions</h1>
      <div className="nav-tabs">
        <button
          className={activeTab === 'vouchers' ? 'active' : ''}
          onClick={() => setActiveTab('vouchers')}
        >
          Vouchers
        </button>
        <button
          className={activeTab === 'discounts' ? 'active' : ''}
          onClick={() => setActiveTab('discounts')}
        >
          Discounts
        </button>
        <button
          className={activeTab === 'ai-copywriting' ? 'active' : ''}
          onClick={() => setActiveTab('ai-copywriting')}
        >
          AI Copywriting
        </button>
      </div>
      <div className="promotions-list">
        {activeTab !== 'ai-copywriting' && (
          <List
            items={promotions}
            onEdit={editPromotion}
            onDelete={deletePromotion}
            onGenerateCaption={generateCaption}
          />
        )}
      </div>
      {activeTab === 'ai-copywriting' && (
        <div className="ai-copywriting-container">
          <h2>AI Copywriting</h2>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <p>Generated Caption: {generatedCaption}</p>
          <button onClick={generateCaption}>Generate Caption</button>
        </div>
      )}
    </div>
  );
}

export default Promotions;
