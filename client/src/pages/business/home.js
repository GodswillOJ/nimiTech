import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useGetBusinessPostsQuery } from '../../services/api';
import BusinessPostItem from '../../components/business/landing_page/BusinessItem';
import ManagerMessage from '../../components/business/landing_page/ManagerMessage';
import { businessImages } from '../../assets/images.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const images = [businessImages.hero1, businessImages.hero2, businessImages.hero3, businessImages.hero4];

const dummyBusinessPosts = [
  {
    id: 1,
    title: 'Boost Your Local Business with These 5 Tips',
    content: 'Learn how to attract more customers and grow your local business effectively...',
    image: businessImages.hero1,
  },
  {
    id: 2,
    title: 'Effective Marketing Strategies for Startups',
    content: 'Explore practical marketing tactics tailored for startup success...',
    image: businessImages.hero2,
  },
  {
    id: 2,
    title: 'Effective Marketing Strategies for Startups',
    content: 'Explore practical marketing tactics tailored for startup success...',
    image: businessImages.hero2,
  },
  {
    id: 2,
    title: 'Effective Marketing Strategies for Startups',
    content: 'Explore practical marketing tactics tailored for startup success...',
    image: businessImages.hero2,
  },
];

const services = [
  'Digital Marketing',
  'Custom Software Development',
  'Website Design & Development',
  'Artificial Intelligence (AI) & Machine Learning (ML)',
  'Cybersecurity Solutions',
  'Cloud Infrastructure & Solutions',
  'Remote IT Support & Helpdesk',
  'Graphic Design – Logos, Branding & Identity',
];

const courses = [
  'Frontend & Backend Web Development',
  'Python Programming & Automation',
  'Cloud Engineering (AWS, Azure, GCP)',
  'DevOps & CI/CD Pipelines',
  'Data Analysis & Visualization (Excel, Python, Power BI)',
  'Machine Learning & AI with Python',
  'Cybersecurity & Ethical Hacking',
  'Database Management (SQL, PostgreSQL)',
  'Remote IT Career Readiness Training',
];

const introTitle = 'From the manager",';
const introSubtitle = 'We offer a wide range of services best fit for your business projects.';
const introText = `Our team is dedicated to empowering your business with top-tier digital solutions. From online presence to backend operations, we provide scalable and tailored services designed to meet modern business needs. Whether you're a startup, SME, or enterprise, our goal is to help you grow, innovate, and lead in your industry.`;



const HomePage = () => {
  const { data: businessPosts = [], isLoading, isError } = useGetBusinessPostsQuery();

  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  const isBelow1100 = useMediaQuery('(max-width:1100px)');
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

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
    <div
      className="home-page-business"
      style={{
        backgroundImage: `url(${businessImages.heroBackImage2})`,
        height: isSmallScreen ? '635px' : isMediumScreen ? '800px' : '800px',
        margin: '0 auto',
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
          <h1
            style={{
              color: 'white',
              fontSize: isSmallScreen ? '1.8rem' : isMediumScreen ? '2.5rem' : '3.5rem',
              textAlign: 'left',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            }}
          >
            We believe in harnessing technology to drive business success.
          </h1>
          
          <p
            style={{
              color: 'white',
              fontSize: isSmallScreen ? '1rem' : isMediumScreen ? '1.2rem' : '1.5rem',
              textAlign: 'left',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            }}
          >
            Our aim is to deliver innovative, efficient, and scalable solutions that empower our clients to thrive in an ever-evolving digital landscape
          </p>

          <button
            style={{
                position: 'absolute',
                padding: isSmallScreen ? '2px 5px' : isMediumScreen ? '10px 10px' : '10px 20px',
                background: '#da2721',
                color: 'white',
                border: 'none',
                top: isSmallScreen ? '460px' : isMediumScreen ? '450px' : '590px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: isSmallScreen ? '0.8rem' : isMediumScreen ? '1rem' : '1.2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
          <a
            href="/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '20px 30px',
              color: 'white',
              borderRadius: '30px',
              fontWeight: 'bold',
              fontSize: isSmallScreen ? '0.9rem' : isMediumScreen ? '1rem' : '1.2rem',
              textDecoration: 'none',
            }}
          >
            find Out More
            <ArrowBackIcon />
          </a>

          </button>
        </div>
      </div>
      
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          maxWidth: '100%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: isSmallScreen ? '1.5rem' : isMediumScreen ? '2rem' : '2.5rem',
            color: '#333',
          }}
        >
          Latest Business Posts
        </h2>
        
        <div className="business-posts-container" style={{ 
            display: 'flex', 
            flexDirection: isBelow1100 ? 'column' : 'row', 
            gap: '20px', 
            padding: '20px'
           }}>
          
            <ManagerMessage
              isSmallScreen={isSmallScreen}
              services={services}
              courses={courses}
              introTitle={introTitle}
              introSubtitle={introSubtitle}
              introText={introText}
            />

          <div
            className="business-posts-container"
            style={{
              display: 'grid',
              // flexDirection: isSmallScreen ? 'column' : 'row',
              gridTemplateColumns: isSmallScreen ? '1fr' : isMediumScreen ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
              //flexWrap: 'wrap', // allow wrapping
              gap: '20px',
              padding: '20px',
            }}
          >

              {postsToShow.map((post) => (
                <BusinessPostItem
                  key={post.id}
                  title={post.title}
                  content={post.content}
                  image={post.image}
                />
              ))}
            </div>

        </div>
      </div>

    </div>
  );
};

export default HomePage;
