import React, { useState, useEffect } from 'react';
import List from './CRUD/List';
import EducationHub from './EduHub'; 
import './Promotions.css';
import TextGenerator from './TextGenerator';

function Promotions() {
  const [activeTab, setActiveTab] = useState('vouchers');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [productName, setProductName] = useState('');
  const [keyword, setKeyword] = useState('');

  const [influencers, setInfluencers] = useState([]);
  const [influencerProfile, setInfluencerProfile] = useState({
    name: '',
    socialMediaHandles: {
      Instagram: '',
      YouTube: '',
      TikTok: ''
    },
    followerCount: '',
    engagementRate: '',
    niche: '',
    averageLikes: '',
    averageComments: '',
    location: '',
    contactEmail: ''
  });

  const niches = ['Fashion', 'Tech', 'Beauty', 'Fitness', 'Travel', 'Food', 'Lifestyle', 'Gaming', 'Parenting', 'Others'];

  useEffect(() => {
    if (activeTab === 'influencers') {
      
      fetchInfluencers();
    } 
  }, [activeTab]);

  const fetchInfluencers = async () => {
    try {
      console.log('Fetching influencers...');
      const response = await fetch('http://localhost:5038/fyp/unicommerceapp/GetInfluencers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched influencers:', data);
      setInfluencers(data);
    } catch (error) {
      console.error('Failed to fetch influencers:', error);
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
    setInfluencers([...influencers, { ...influencerProfile, _id: Date.now().toString() }]);
    setInfluencerProfile({
      name: '',
      socialMediaHandles: {
        Instagram: '',
        YouTube: '',
        TikTok: ''
      },
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
    if (name in influencerProfile.socialMediaHandles) {
      setInfluencerProfile({
        ...influencerProfile,
        socialMediaHandles: { ...influencerProfile.socialMediaHandles, [name]: value }
      });
    } else {
      setInfluencerProfile({ ...influencerProfile, [name]: value });
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      const formatted = (num / 1000000).toFixed(2);
      return formatted.endsWith('.00') ? `${(num / 1000000).toFixed(0)}M` : `${formatted}M`;
    } else if (num >= 1000) {
      const formatted = (num / 1000).toFixed(2);
      return formatted.endsWith('.00') ? `${(num / 1000).toFixed(0)}K` : `${formatted}K`;
    } else {
      return num;
    }
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
          className={activeTab === 'ai-copywriting' ? 'active' : ''}
          onClick={() => setActiveTab('ai-copywriting')}
        >
          UniAId
        </button>
        <button
          className={activeTab === 'influencers' ? 'active' : ''}
          onClick={() => setActiveTab('influencers')}
        >
          Influencers
        </button>
        <button
          className={activeTab === 'education-hub' ? 'active' : ''}
          onClick={() => setActiveTab('education-hub')}
        >
          Education Hub
        </button>
      </div>
      <div className="promotions-list">
        {activeTab !== 'ai-copywriting' && activeTab !== 'influencers' && activeTab !== 'education-hub' && (
          <TextGenerator/>
        )}
      </div>
      {activeTab === 'ai-copywriting' && (
        <TextGenerator/>
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
            name="Instagram"
            placeholder="Instagram Handle"
            value={influencerProfile.socialMediaHandles.Instagram}
            onChange={handleInfluencerChange}
          />
          <input
            type="text"
            name="YouTube"
            placeholder="YouTube Channel"
            value={influencerProfile.socialMediaHandles.YouTube}
            onChange={handleInfluencerChange}
          />
          <input
            type="text"
            name="TikTok"
            placeholder="TikTok Handle"
            value={influencerProfile.socialMediaHandles.TikTok}
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
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Social Media</th>
                  <th>Follower Count</th>
                  <th>Engagement Rate</th>
                  <th>Niche</th>
                  <th>Average Likes</th>
                  <th>Average Comments</th>
                  <th>Location</th>
                  <th>Contact Email</th>
                </tr>
              </thead>
              <tbody>
                {influencers.map((influencer, index) => (
                  <tr key={index}>
                    <td>{influencer.name}</td>
                    <td>
                      {influencer.socialMediaHandles.Instagram && (
                        <a 
                          href={`https://instagram.com/${influencer.socialMediaHandles.Instagram.replace(/^@/, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: '#E4405F', fontSize: '20px', margin: '0 5px' }}
                        >
                          <i className="fab fa-instagram"></i>
                        </a>
                      )}
                      {influencer.socialMediaHandles.YouTube && (
                        <a 
                          href={`https://youtube.com/${influencer.socialMediaHandles.YouTube.replace(/\s+/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: '#FF0000', fontSize: '20px', margin: '0 5px' }}
                        >
                          <i className="fab fa-youtube"></i>
                        </a>
                      )}
                      {influencer.socialMediaHandles.TikTok && (
                        <a 
                          href={`https://tiktok.com/${influencer.socialMediaHandles.TikTok}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: '#000000', fontSize: '20px', margin: '0 5px' }}
                        >
                          <i className="fab fa-tiktok"></i>
                        </a>
                      )}
                    </td>
                    <td>{formatNumber(influencer.followerCount)}</td>
                    <td>{influencer.engagementRate.toFixed(2).replace(/\.00$/, '')}%</td>
                    <td>{influencer.niche}</td>
                    <td>{formatNumber(influencer.averageLikes)}</td>
                    <td>{formatNumber(influencer.averageComments)}</td>
                    <td>{influencer.location}</td>
                    <td>
                      {influencer.contactEmail && (
                        <a 
                          href={`mailto:${influencer.contactEmail}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ color: '#000000', fontSize: '20px' }}
                        >
                          <i className="fas fa-envelope"></i>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === 'education-hub' && <EducationHub />}
    </div>
  );
}

export default Promotions;
