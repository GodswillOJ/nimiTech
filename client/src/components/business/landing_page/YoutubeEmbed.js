import React, { useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const YoutubeEmbed = ({ videoId }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlay = () => {
    setIsLoading(true);
    // Small delay to show loading state
    setTimeout(() => {
      setIsLoaded(true);
      setIsLoading(false);
    }, 500);
  };

  if (isLoaded) {
    return (
      <div
        style={{
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          overflow: 'hidden',
          margin: '0 auto',
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3`}
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
  }

  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        margin: '0 auto',
        cursor: 'pointer',
        backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
      }}
      onClick={handlePlay}
    >
      {/* Dark overlay for better contrast */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1,
          borderRadius: '8px',
        }}
      />

      {/* Play button or loading spinner */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          backgroundColor: isLoading ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          borderRadius: '50%',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        {isLoading ? (
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #ff0000',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        ) : (
          <PlayArrowIcon
            style={{
              fontSize: '40px',
              color: '#ff0000',
              marginLeft: '4px', // Slight offset to center the triangle visually
            }}
          />
        )}
      </div>

      {/* Video title overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          zIndex: 2,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: '600',
            fontSize: '18px',
            margin: 0,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
          }}
        >
          Watch Our Company Overview
        </h3>
      </div>

      {/* Add keyframes for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default YoutubeEmbed;
