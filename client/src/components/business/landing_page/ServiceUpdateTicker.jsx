import React, { useEffect, useState } from 'react';

const ServiceUpdateTicker = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 6000); // Display each post for 6s

    return () => clearInterval(interval);
  }, [posts.length]);

  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <div
        key={currentIndex}
        style={{
          whiteSpace: 'nowrap',
          width: '100%',
          animation: 'scroll-single 10s linear',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#333',
          padding: '5px 0',
        }}
      >
        {posts[currentIndex].title}
      </div>
    </div>
  );
};

export default ServiceUpdateTicker;
