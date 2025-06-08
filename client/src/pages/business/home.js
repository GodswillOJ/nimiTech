import React, { useEffect, useState } from 'react';
import { useGetBusinessPostsQuery } from '../../services/api';
import BusinessPostItem from '../../components/business/BusinessItem.js';

import img1 from '../../assets/ment_wellness.jpg';
import img2 from '../../assets/ment2.jpg';
import img3 from '../../assets/ment3.jpg';
import img4 from '../../assets/ment5.jpg';

const images = [img1, img2, img3, img4];

const dummyBusinessPosts = [
  {
    id: 1,
    title: 'Boost Your Local Business with These 5 Tips',
    content: 'Learn how to attract more customers and grow your local business effectively...',
  },
  {
    id: 2,
    title: 'Effective Marketing Strategies for Startups',
    content: 'Explore practical marketing tactics tailored for startup success...',
  },
];

const HomePage = () => {
  const { data: businessPosts = [], isLoading, isError } = useGetBusinessPostsQuery();

  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const postsToShow = !isError && businessPosts.length > 0 ? businessPosts : dummyBusinessPosts;

  return (
    <div>
      <div className="hero-container">
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url(${images[currentImage]})`,
            opacity: fade ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            height: '300px',
            backgroundSize: 'cover',
          }}
        />
        <div className="hero-overlay"></div>
        <div className="hero-text">
          <h1>Business Posts</h1>
        </div>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching posts. Showing dummy content.</p>}

      {postsToShow.map((post) => (
        <BusinessPostItem key={post.id} title={post.title} content={post.content} />
      ))}
    </div>
  );
};

export default HomePage;
