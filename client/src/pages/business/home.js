import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { useGetBusinessPostsQuery } from '../../services/api';
import {
  BusinessPostItem,
  SocialLinks,
  PartnerWithUs,
} from '../../components/business/landing_page/BusinessItem';
import ManagerMessage from '../../components/business/landing_page/ManagerMessage';
import ServiceUpdateTicker from '../../components/business/landing_page/ServiceUpdateTicker';
import { businessImages } from '../../assets/images.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import YoutubeEmbed from '../../components/business/landing_page/YoutubeEmbed';
import Footer from '../../components/footer';
import { Link } from 'react-router-dom';

const images = [
  businessImages.hero1,
  businessImages.hero2,
  businessImages.hero3,
  businessImages.hero4,
];

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
      {/* Hero section */}
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
            Our aim is to deliver innovative, efficient, and scalable solutions that empower our
            clients to thrive in an ever-evolving digital landscape
          </p>

          <button
            className={`custom-button ${isSmallScreen ? 'small' : isMediumScreen ? 'medium' : 'large'}`}
            style={{
              position: 'absolute',
              top: isSmallScreen ? '460px' : isMediumScreen ? '450px' : '590px',
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
              BOOK A FREE CONSULTATION
              <ArrowBackIcon />
            </a>
          </button>
        </div>
      </div>

      {/* Service updates */}
      <div
        style={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : isMediumScreen ? 'row' : 'row',
          alignItems: 'center',
          background: '#66666621', // semi-transparent white
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          margin: '20px 0',
          gap: '20px',
          flexWrap: 'wrap', // Ensures wrapping on small screens
        }}
      >
        <span
          className="bounce-on-hover"
          style={{
            padding: '10px 20px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: 'rgb(103,88,88)',
            backgroundColor: '#fff',
            border: 'none',
            borderRadius: '30px 30px 0 30px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Latest Updates
        </span>

        <div
          style={{
            flex: 1,
            background: 'linear-gradient(to right,rgb(246, 246, 247),rgb(217, 219, 220))',
            borderRadius: '12px',
            padding: '10px 20px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Ensure content is centered
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            marginTop: '10px',
            flexWrap: 'wrap', // Allow content to adjust for mobile
          }}
        >
          <ServiceUpdateTicker posts={postsToShow} />
        </div>
      </div>

      {/* Youtube Channel Section */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '40px',
          background: 'linear-gradient(to right,rgb(245, 246, 247),rgb(237, 237, 237))',
          padding: '40px 20px',
          borderRadius: '16px',
          margin: '20px auto',
          maxWidth: '1200px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
          {/* <div style={{ marginBottom: '20px' }}>
            <img
              src={businessImages.logo}
              alt="Company Logo"
              style={{
                maxWidth: '150px',
                height: 'auto',
                margin: '0 auto',
                display: 'block',
              }}
            />
          </div> */}

          <YoutubeEmbed videoId="dQw4w9WgXcQ" />
        </div>

        <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
          <h3
            style={{
              marginTop: isSmallScreen ? '10px' : isMediumScreen ? '0' : '0',
              marginBottom: '10px',
              color: '#000',
            }}
          >
            Follow us on
          </h3>
          <SocialLinks />
        </div>
      </div>

      {/* Services */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '40px 20px',
          maxWidth: '100%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isBelow1100 ? 'column' : 'row',
            alignItems: 'flex-start',
            gap: '40px',
          }}
        >
          {/* 📌 Left Side: Text & List Block */}
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: isSmallScreen ? '1.4rem' : '2rem',
                color: '#7b7979',
                marginBottom: '10px',
              }}
            >
              {introTitle}
            </h2>
            <h1
              style={{
                fontSize: isSmallScreen ? '1.8rem' : '2.4rem',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '20px',
              }}
            >
              {introSubtitle}
            </h1>
            <p
              style={{
                fontSize: isSmallScreen ? '1rem' : '1.2rem',
                lineHeight: '1.7',
                color: '#444',
                marginBottom: '30px',
              }}
            >
              {introText}
            </p>

            <div>
              <h3 style={{ color: '#000', marginBottom: '10px' }}>Our Services</h3>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.6' }}>
                {services.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 📸 Right Side: Full-Size Image */}
          <div className="image-container" style={{ flex: 1 }}>
            <img
              src={businessImages.hero2}
              alt="Manager Section Visual"
              className="image-hover"
              style={{
                width: '100%',
                height: '800px',
                objectFit: 'cover',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Courses */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          maxWidth: '100%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          className="business-posts-container"
          style={{
            display: 'flex',
            flexDirection: isBelow1100 ? 'column' : 'row',
            gap: '20px',
            padding: '20px',
          }}
        >
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
              gridTemplateColumns: isSmallScreen
                ? '1fr'
                : isMediumScreen
                  ? 'repeat(2, 1fr)'
                  : 'repeat(2, 1fr)',
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

      {/* partner with us */}
      <div>
        {/* Partner With Us Section */}
        <PartnerWithUs services={services} />
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
