import React, { useEffect, useState, lazy } from 'react';
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
import donationImage1 from '../../assets/blog/images/donationImage1.jpg';
import donationImage2 from '../../assets/blog/images/donationImage2.jpg';
import Footer from '../../components/Footer/Footer';
import styles from '../blog/blog.module.scss';
import {
  dummyBusinessPosts,
  services,
  courses,
  ceoMessage,
  introTitle,
  introSubtitle,
  introText,
} from '../../components/business/business_post/buisnessData.jsx';

// const images = [
//   businessImages.hero1,
//   businessImages.hero2,
//   businessImages.hero3,
//   businessImages.hero4,
// ];
const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const HomePage = () => {
  const { data: businessPosts = [], isLoading, isError } = useGetBusinessPostsQuery();

  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  const isBelow1100 = useMediaQuery('(max-width:1100px)');
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFade(false);
  //     setTimeout(() => {
  //       setCurrentImage((prev) => (prev + 1) % images.length);
  //       setFade(true);
  //     }, 1000);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  const postsToShow = !isError && businessPosts.length > 0 ? businessPosts : dummyBusinessPosts;

  return (
    <div
      className="home-page-business"
      style={{
        height: isSmallScreen ? '635px' : isMediumScreen ? '800px' : '800px',
        margin: '0 auto',
        backgroundSize: 'cover',
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          position: 'relative',
          height: '800px',
          overflow: 'hidden',
        }}
      >
        <video
          className="hero-bg"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '800px',
            objectFit: 'cover',
            zIndex: -1,
            opacity: fade ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          <source src="/videos/nimiVid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-text">
          <h1> We believe in harnessing technology to drive business success.</h1>
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
            // style={{
            //   position: 'absolute',
            //   top: isSmallScreen ? '460px' : isMediumScreen ? '450px' : '590px',
            // }}
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

      {/* partner with us */}
      <div>
        {/* Partner With Us Section */}
        <PartnerWithUs services={services} />
      </div>

      {/* Service updates */}
      <div
        style={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : isMediumScreen ? 'row' : 'row',
          alignItems: 'center',
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
            fontSize: '0.8rem',
            fontWeight: 'bold',
            color: '#fff',
            backgroundColor: 'rgb(0, 8, 10, 93%)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            border: 'none',
            borderRadius: '30px 30px 0 30px',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Latest on Service
        </span>

        <div
          style={{
            flex: 1,
            background: 'none',
            border: '1px solid #ccc',
            borderRadius: '12px',
            // padding: '10px 20px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center', // Ensure content is centered
            boxShadow: '0 8px 16px rgba(48, 48, 48, 0.1)',
            marginTop: '10px',
            flexWrap: 'wrap', // Allow content to adjust for mobile
          }}
        >
          <ServiceUpdateTicker posts={postsToShow} />
        </div>
      </div>

      {/* Services */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: isSmallScreen ? '1rem 3rem 1rem 3rem' : '1rem 5rem 1rem 5rem',
          maxWidth: '100%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          Our Services
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: isBelow1100 ? 'column' : 'row',
            alignItems: 'flex-start',
            gap: '40px',
          }}
        >
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
          {/* 📌 Left Side: Text & List Block */}
          <div style={{ flex: 1 }}>
            <div>
              <h3 style={{ color: '#000', marginBottom: '10px' }}>Our Services</h3>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '1.6' }}>
                {services.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <h2
              style={{
                fontSize: isSmallScreen ? '1.4rem' : '2rem',
                color: '#7b7979',
                marginTop: '20px',
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
          </div>
        </div>
      </div>

      {/* Courses */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '20px',
          margin: 0,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          className="business-posts-container"
          style={{
            display: 'flex',
            flexDirection: isBelow1100 ? 'column' : 'row',
            gap: '20px',
            // maxWidth: '1200px',
            padding: '50px',
          }}
        >
          <div
            className="business-posts-container"
            style={{
              display: 'grid',
              gridTemplateColumns: isSmallScreen
                ? '1fr'
                : isMediumScreen
                  ? 'repeat(2, 2fr)'
                  : 'repeat(2, 1fr)',
              gridAutoRows: 'minmax(200px, auto)',
              gap: '20px',
              alignItems: 'center',
              justifyItems: 'center',
              paddingTop: isSmallScreen ? '70px' : '0',
            }}
          >
            {postsToShow.map((post) => (
              <BusinessPostItem
                id={post.id}
                key={post.id}
                title={post.title}
                content={post.content}
                image={post.image}
              />
            ))}
          </div>
          <ManagerMessage
            isSmallScreen={isSmallScreen}
            services={services}
            courses={courses}
            introTitle={introTitle}
            introSubtitle={introSubtitle}
            introText={introText}
          />
        </div>
      </div>

      {/* Youtube Channel Section */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
        {/* Blurred Background Image */}
        <img
          src={businessImages.hero4} // Replace with your image path
          alt="background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(8px)',
            zIndex: 0,
          }}
        />

        {/* Foreground Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '40px',
            background: 'none', // Optional: semi-transparent layer for contrast
            padding: '40px 20px',
            borderRadius: '16px',
            margin: '20px auto',
            maxWidth: '1200px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
            <YoutubeEmbed videoId="S8oq8Zz2y5c" />
          </div>

          <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
            <h3
              style={{
                marginTop: isSmallScreen ? '10px' : isMediumScreen ? '0' : '0',
                marginBottom: '10px',
                color: '#fff',
              }}
            >
              Follow us on
            </h3>
            <SocialLinks />
          </div>
        </div>
      </div>

      {/* message from the ceo */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          margin: '40px 20px',
        }}
      >
        {/* Foreground Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '40px 30px',
            borderRadius: '16px',
            maxWidth: '1000px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <img
            src={businessImages.hero1}
            alt="CEO Busay Bright"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '20px',
              border: '3px solid #4a4a4a',
            }}
          />
          <h2
            style={{
              fontSize: '24px',
              marginBottom: '10px',
              color: '#333',
            }}
          >
            A Message from Our CEO
          </h2>

          {ceoMessage.map((text, index) => (
            <p
              key={index}
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: index === 2 ? '#444' : '#222',
                maxWidth: '800px',
                margin: index === 2 ? '30px auto 0' : '20px auto 0',
                fontWeight: index === 2 ? 'bold' : 'normal',
              }}
            >
              {text}
            </p>
          ))}
        </div>
      </div>

      {/* Support Our Mission Section */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '60px 20px',
          borderRadius: '16px',
          margin: '40px auto',
          maxWidth: '1000px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '30px',
          }}
        >
          Support Our Mission
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: '#555',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto 20px',
          }}
        >
          Nimitech IT is committed to providing impactful digital solutions and empowering
          businesses with the tools to succeed. Your support helps us grow and serve more
          communities. You can support us through the details below.
        </p>
        {/* Additional Mission */}
        <div
          style={{
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            marginBottom: '30px',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'left',
          }}
        >
          <h3 style={{ color: '#4a4a4a', fontWeight: '600', marginBottom: '15px' }}>
            Help Feed Hungry Kids in Africa — Support Nimitech’s Fight Against Malnutrition
          </h3>
          <p style={{ color: '#555', lineHeight: '1.6', fontSize: '16px' }}>
            At <strong>Nimitech IT</strong>, we believe in using technology and community to make a
            real difference. Every day, millions of children in Africa suffer from hunger and
            malnutrition, threatening their health and future. By donating as little as{' '}
            <strong>$1 a day</strong>, you can help provide nutritious meals and essential support
            to vulnerable kids, giving them a chance to thrive.
          </p>
          <p style={{ color: '#555', lineHeight: '1.6', fontSize: '16px', marginTop: '10px' }}>
            Join us in this vital mission—your small contribution can create a big impact. Together,
            we can fight hunger, nourish hope, and build brighter futures.
          </p>
          <p style={{ fontWeight: 'bold', color: '#444', marginTop: '15px' }}>
            Donate today and be a part of the change. Every dollar counts!
          </p>
        </div>
      </div>
      <section className={styles.donation}>
        <GradientCard imageSrc={donationImage2} imagePosition="left" />
        <DonateSection
          images={[donationImage1, donationImage2, donationImage1]}
          onDonateClick={() => window.open('https://www.example.com/donate', '_blank')}
        />
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
