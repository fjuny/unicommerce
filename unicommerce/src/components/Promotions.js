import React, { useState, useEffect } from 'react';
import List from './CRUD/List';
import './Promotions.css';


function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [activeTab, setActiveTab] = useState('vouchers');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [productName, setProductName] = useState('');
  const [keyword, setKeyword] = useState('');

  const [influencers, setInfluencers] = useState([]);
  const [influencerProfile, setInfluencerProfile] = useState({
    name: '',
    socialMediaHandles: '',
    followerCount: '',
    engagementRate: '',
    niche: '',
    averageLikes: '',
    averageComments: '',
    location: '',
    contactEmail: ''
  });
  const [sortKey, setSortKey] = useState('');

  const niches = ['Fashion', 'Tech', 'Beauty', 'Fitness', 'Travel', 'Food', 'Lifestyle', 'Gaming', 'Parenting', 'Others'];

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
      console.log('Generating caption for:', productName, keyword);
  
      const response = await fetch('http://localhost:5038/fyp/unicommerceapp/GenerateCaption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, keyword })
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const { caption } = await response.json();
      setGeneratedCaption(caption);
    } catch (error) {
      console.error('Error generating caption:', error);
    }
  };

  const addInfluencer = () => {
    setInfluencers([...influencers, influencerProfile]);
    setInfluencerProfile({
      name: '',
      socialMediaHandles: '',
      followerCount: '',
      engagementRate: '',
      niche: '',
      averageLikes: '',
      averageComments: '',
      location: '',
      contactEmail: ''
    });
  };

  const handleInfluencerChange = (e) => {
    const { name, value } = e.target;
    setInfluencerProfile({ ...influencerProfile, [name]: value });
  };

  const sortInfluencers = (key) => {
    const sortedInfluencers = [...influencers].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
    setInfluencers(sortedInfluencers);
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
        <button
          className={activeTab === 'influencers' ? 'active' : ''}
          onClick={() => setActiveTab('influencers')}
        >
          Influencers
        </button>
      </div>
      <div className="promotions-list">
        {activeTab !== 'ai-copywriting' && activeTab !== 'influencers' && (
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
      {activeTab === 'influencers' && (
        <div className="influencer-profile-container">
          <h2>Influencer Profile</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={influencerProfile.name}
            onChange={handleInfluencerChange}
          />
          <input
            type="text"
            name="socialMediaHandles"
            placeholder="Social Media Handles"
            value={influencerProfile.socialMediaHandles}
            onChange={handleInfluencerChange}
          />
          <input
            type="number"
            name="followerCount"
            placeholder="Follower Count"
            value={influencerProfile.followerCount}
            onChange={handleInfluencerChange}
          />
          <input
            type="number"
            step="0.01"
            name="engagementRate"
            placeholder="Engagement Rate (%)"
            value={influencerProfile.engagementRate}
            onChange={handleInfluencerChange}
          />
          <select
            name="niche"
            value={influencerProfile.niche}
            onChange={handleInfluencerChange}
          >
            <option value="">Select Niche</option>
            {niches.map(niche => (
              <option key={niche} value={niche}>{niche}</option>
            ))}
          </select>
          <input
            type="number"
            name="averageLikes"
            placeholder="Average Likes"
            value={influencerProfile.averageLikes}
            onChange={handleInfluencerChange}
          />
          <input
            type="number"
            name="averageComments"
            placeholder="Average Comments"
            value={influencerProfile.averageComments}
            onChange={handleInfluencerChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={influencerProfile.location}
            onChange={handleInfluencerChange}
          />
          <input
            type="email"
            name="contactEmail"
            placeholder="Contact Email"
            value={influencerProfile.contactEmail}
            onChange={handleInfluencerChange}
          />
          <button onClick={addInfluencer}>Add Influencer</button>
          <div className="influencers-list">
            <h3>Influencers</h3>
            <button onClick={() => sortInfluencers('name')}>Sort by Name</button>
            <button onClick={() => sortInfluencers('followerCount')}>Sort by Followers</button>
            <button onClick={() => sortInfluencers('engagementRate')}>Sort by Engagement Rate</button>
            <ul>
              {influencers.map((influencer, index) => (
                <li key={index}>
                  <p>Name: {influencer.name}</p>
                  <p>Social Media Handles: {influencer.socialMediaHandles}</p>
                  <p>Follower Count: {influencer.followerCount}</p>
                  <p>Engagement Rate: {influencer.engagementRate}%</p>
                  <p>Niche: {influencer.niche}</p>
                  <p>Average Likes: {influencer.averageLikes}</p>
                  <p>Average Comments: {influencer.averageComments}</p>
                  <p>Location: {influencer.location}</p>
                  <p>Contact Email: {influencer.contactEmail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Promotions;
