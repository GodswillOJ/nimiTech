import React, { useEffect, useState } from 'react';
import { useGetBusinessPostsQuery } from '../../services/api';
import BusinessPostItem from '../../components/business/BusinessItem.js';
import { businessImages } from '../../assets/images.js';

const images = [businessImages.hero1, businessImages.hero2, businessImages.hero3, businessImages.hero4];

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
    <div className="home-page-business"
      style={{
            backgroundImage: `url(${businessImages.heroBackImage2})`,
            backgroundSize: 'cover',
      }}
    >
      <div className="hero-container">
        <div
          className="hero-bg"
          style={{
            backgroundImage: `url(${images[currentImage]})`,
            opacity: fade ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            height: '800px',
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
