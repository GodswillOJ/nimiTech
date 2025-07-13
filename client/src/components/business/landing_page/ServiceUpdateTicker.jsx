import React, { useEffect, useState } from 'react';

const ServiceUpdateTicker = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 6000); // 6 seconds per post

    return () => clearInterval(interval);
  }, [posts.length]);

  return (
    <div className="ticker-wrapper">
      <div key={currentIndex} className="ticker-slide">
        {posts[currentIndex].title}
      </div>
    </div>
  );
};

export default ServiceUpdateTicker;
