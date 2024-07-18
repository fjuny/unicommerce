import React, { useState, useEffect } from 'react';
import { TalkJSChat } from 'react-talkjs';
import { VideoSDKLivePlayer, VideoSDKLiveStreamer } from '@videosdk.live/react-sdk';
import { StreamVideoClient, StreamVideo, User, StreamCall, LivestreamPlayer } from '@stream-io/video-react-sdk';

const SyncPlus = () => {
  const [selectedChannel, setSelectedChannel] = useState('');
  const [talkJSUser, setTalkJSUser] = useState(null);
  const [videoSDKClient, setVideoSDKClient] = useState(null);
  const [streamVideoClient, setStreamVideoClient] = useState(null);
  const [streamCall, setStreamCall] = useState(null);
  const [syncSettings, setSyncSettings] = useState({
    facebook: true,
    messenger: true,
    googleAds: false,
    whatsApp: true,
    line: false,
    instagram: true,
    shopee: false,
    lazada: true,
    referralMarketing: true,
    telegram: false,
  });

  useEffect(() => {
    const talkJSUser = new talkjs.User({
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      photoUrl: 'https://example.com/avatar.jpg'
    });
    setTalkJSUser(talkJSUser);

    const client = new VideoSDKLiveClient({
      region: 'us',
      token: 'your-videosdk-token'
    });
    setVideoSDKClient(client);

    const streamClient = new StreamVideoClient({
      apiKey: 'your-stream-api-key',
      user: { id: 'user-id', name: 'John Doe' },
      token: 'your-stream-token'
    });
    setStreamVideoClient(streamClient);
    const call = streamClient.call('livestream', 'call-id');
    call.join({ create: true });
    setStreamCall(call);
  }, []);

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };

  const handleToggleSync = (platform) => {
    setSyncSettings((prevSettings) => ({
      ...prevSettings,
      [platform]: !prevSettings[platform],
    }));
  };

  const renderChat = () => {
    if (selectedChannel === 'talkjs') {
      return (
        <TalkJSChat
          me={talkJSUser}
          other={new talkjs.User({
            id: 'other-user-id',
            name: 'Jane Doe',
            email: 'jane@example.com',
            photoUrl: 'https://example.com/other-avatar.jpg'
          })}
        />
      );
    } else if (selectedChannel === 'videosdk') {
      return (
        <VideoSDKLiveStreamer
          client={videoSDKClient}
          config={{
            name: 'John Doe',
            mode: 'CONFERENCE',
            tag: 'your-tag'
          }}
        />
      );
    } else if (selectedChannel === 'stream') {
      return (
        <StreamVideo client={streamVideoClient}>
          <StreamCall call={streamCall}>
            <LivestreamPlayer callType="livestream" callId="call-id" />
          </StreamCall>
        </StreamVideo>
      );
    }
    return null;
  };

  return (
    <div>
      <h1>Multi-Channel App</h1>
      <div>
        <button onClick={() => handleChannelSelect('talkjs')}>TalkJS Chat</button>
        <button onClick={() => handleChannelSelect('videosdk')}>VideoSDK Live Streaming</button>
        <button onClick={() => handleChannelSelect('stream')}>Stream Live Streaming</button>
      </div>
      {renderChat()}
      <MultiChannelSync
        syncSettings={syncSettings}
        onToggleSync={handleToggleSync}
      />
    </div>
  );
};

const MultiChannelSync = ({ syncSettings, onToggleSync }) => {
  return (
    <div>
      <h2>Multi-Channel Sync</h2>
      <div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={syncSettings.facebook}
              onChange={() => onToggleSync('facebook')}
            />
            Facebook
          </label>
        </div>
      </div>
    </div>
  );
};

export default SyncPlus;