// components/YoutubeEmbed.js
import React from 'react';

const YoutubeEmbed = ({ videoId }) => {
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', height: 0, overflow: 'hidden' }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default YoutubeEmbed;
