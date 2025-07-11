import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMediaQuery } from '@mui/material';
import { lazy, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import donationImage1 from '../../assets/blog/images/donationImage1.jpg';
import donationImage2 from '../../assets/blog/images/donationImage2.jpg';
import { businessImages } from '../../assets/images.js';
import {
  dummyBusinessPosts,
  introSubtitle,
  introText,
  services,
} from '../../components/business/business_post/buisnessData.jsx';
import CeoMessage from '../../components/business/CeoMessage/CeoMessage';
import {
  BusinessPostItem,
  ClientReview,
  PartnerWithUs,
  SocialLinks,
  testimonials,
} from '../../components/business/landing_page/BusinessItem';
import ServiceUpdateTicker from '../../components/business/landing_page/ServiceUpdateTicker';
import YoutubeEmbed from '../../components/business/landing_page/YoutubeEmbed';
import LogoSlider from '../../components/business/LogoSlider/LogoSlider';
import Faq from '../../components/Faqs/Faq';
import Footer from '../../components/Footer/Footer';
import { useGetBusinessPostsQuery } from '../../services/api';
import styles from '../blog/blog.module.scss';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));
// Lazy load heavy components for better performance
const LazyTestimonialsSlider = lazy(
  () => import('../../components/business/TestimonialsSlider/TestimonialsSlider')
);

const HomePage = () => {
  const { data: businessPosts = [], isLoading, isError } = useGetBusinessPostsQuery();
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  const isBelow1100 = useMediaQuery('(max-width:1100px)');
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');
  const postsToShow = !isError && businessPosts.length > 0 ? businessPosts : dummyBusinessPosts;
  const postsToDisplay = isSmallScreen
    ? postsToShow
    : showAllPosts
      ? postsToShow
      : postsToShow.slice(0, 6);

  // Framer Motion animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  // Testimonials Carousel Settings
  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: isSmallScreen ? 1 : isMediumScreen ? 2 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'ease-in-out',
    arrows: false,
  };
  return (
    <>
      {/* Preload critical images for better LCP */}
      <link rel="preload" as="image" href={businessImages.hero_background} />
      <link rel="preload" as="image" href={businessImages.nimi_hero1} />

      <div
        className="home-page-business"
        style={{
          height: isSmallScreen ? '635px' : isMediumScreen ? '800px' : '800px',
          margin: '0 auto',
          backgroundSize: 'cover',
          containIntrinsicSize: '100% auto', // Improve layout stability
        }}
      >
        {' '}
        {/* Hero Section - Optimized for LCP with animations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            position: 'relative',
            height: '800px',
            overflow: 'hidden',
            backgroundImage: `url(${businessImages.hero_background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform', // Optimize for animations
          }}
        >
          <div className="hero-overlay"></div>
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.25, 0.25, 0.75] }}
          >
            <motion.h1
              style={{ fontFamily: 'Montserrat, sans-serif' }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {' '}
              We Believe in Harnessing Technology to Drive Business Success.
            </motion.h1>
            <motion.p
              style={{
                color: 'white',
                fontSize: isSmallScreen ? '1rem' : isMediumScreen ? '1.2rem' : '1.5rem',
                textAlign: 'left',
                marginBottom: '20px',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Our aim is to deliver innovative, efficient, and scalable solutions that empower our
              clients to thrive in an ever-evolving digital landscape
            </motion.p>

            <motion.button
              className={`custom-button ${isSmallScreen ? 'small' : isMediumScreen ? 'medium' : 'large'}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.25, 0.25, 0.25, 0.75] }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/contact-us"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '20px 30px',
                  color: 'white',
                  borderRadius: '30px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 'bold',
                  fontSize: isSmallScreen ? '0.9rem' : isMediumScreen ? '1rem' : '1.2rem',
                  textDecoration: 'none',
                }}
              >
                BOOK A FREE CONSULTATION
                <ArrowBackIcon />
              </a>
            </motion.button>
          </motion.div>
        </motion.div>{' '}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={scaleIn}
        >
          <LogoSlider />
        </motion.div>{' '}
        {/* partner with us */}
        {/* Service updates */}
        {/* Courses */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: isSmallScreen ? '0' : isMediumScreen ? '10px' : '20px',
            width: '100%',
            margin: 0,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          <motion.h1
            variants={fadeInUp}
            style={{
              textAlign: 'center',
              marginBottom: isSmallScreen ? '0' : '60px',
              padding: isSmallScreen ? '20px' : '20px',
              color: '#433c4c',
            }}
          >
            Our Services
          </motion.h1>

          <div
            style={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : isMediumScreen ? 'column' : 'row',
              gap: '40px',
              // maxWidth: '1200px',
              padding: isSmallScreen ? '0' : isMediumScreen ? '30x' : '50px',
            }}
          >
            <div>
              <div
                className="business-posts-container"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isSmallScreen
                    ? '1fr'
                    : isMediumScreen
                      ? 'repeat(2, 2fr)'
                      : 'repeat(3, 1fr)',
                  gridAutoRows: 'minmax(200px, auto)',
                  gap: '20px',
                  justifyItems: 'center',
                  paddingTop: isSmallScreen ? '70px' : '0',
                }}
              >
                {postsToDisplay.map((post) => (
                  <BusinessPostItem
                    id={post.id}
                    key={post.id}
                    title={post.title}
                    content={post.content}
                    image={post.image}
                    summary={post.summary}
                  />
                ))}
              </div>
              {!isSmallScreen && postsToShow.length > 4 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    onClick={() => setShowAllPosts(!showAllPosts)}
                    style={{
                      background: 'none',
                      color: '#88199a',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: '16px',
                      marginTop: '16px',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      boxShadow: 'none',
                      borderRadius: '16px',
                    }}
                    className="contact-btn"
                  >
                    {showAllPosts ? 'Show Less' : 'click to view more'}
                  </button>
                </div>
              )}
            </div>
            {/* 📌 Left Side: Text & List Block */}
            {/* <div style={{ width: '100%' }}>
            <div style={{ padding: isSmallScreen ? '20px' : '0' }}>
              <ServiceHighlights />
            </div>
          </div> */}
          </div>
        </motion.div>
        {/* Services */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: isSmallScreen ? '0' : isMediumScreen ? '0' : '0',
            maxWidth: '100%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: isBelow1100 ? 'column' : 'column',
              gap: '40px',
            }}
          >
            {/* 📸 Right Side: Full-Size Image */}
            <div
              className="service-img-container"
              style={{
                position: 'relative',
                margin: isSmallScreen ? '0 0 2rem 0' : '0 0 4rem 0',
                borderRadius: isSmallScreen ? '0' : isMediumScreen ? '0' : '0',
                overflow: 'hidden',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              }}
            >
              <img
                src={businessImages.hero2}
                alt="Manager Section Visual"
                className="image-hover"
                style={{
                  width: '100%',
                  height: isSmallScreen ? '300px' : '500px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <h1
                  style={{
                    color: '#88199a',
                    background: 'rgba(255, 255, 255, 0.4)',
                    padding: '40px',
                    borderRadius: 5,
                    backdropFilter: 'blur(4px)',
                    fontSize: isSmallScreen ? '1.5rem' : '2.5rem',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                    fontFamily: 'Montserrat, sans-serif',
                    maxWidth: '90%',
                  }}
                >
                  Innovate. Grow. Thrive
                </h1>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Youtube Channel Section */}
        <motion.div
          style={{ position: 'relative', overflow: 'hidden' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          {/* Blurred Background Image */}
          <img
            src={businessImages.WD_image} // Replace with your image path
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
              <YoutubeEmbed videoId="fWk0YKyVGBk" />
            </div>

            <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
              <h3
                fontFamily="Montserrat, sans-serif"
                fontWeight="400px"
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
        </motion.div>
        {/* CEO Message Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <CeoMessage />
        </motion.div>
        <motion.section
          id="faq"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={scaleIn}
        >
          <Faq />
        </motion.section>
        {/* donate - Optimized to prevent CLS */}
        <motion.section
          className={styles.donation}
          style={{
            minHeight: '400px', // Prevent layout shift
            containIntrinsicSize: '100% 400px', // Reserve space
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <GradientCard
            imageSrc={donationImage2}
            imagePosition="left"
            loading="lazy" // Lazy load non-critical images
          />
          <DonateSection
            images={[donationImage1, donationImage2, donationImage1]}
            onDonateClick={() => window.open('https://gofund.me/a95d2b08', '_blank')}
          />
        </motion.section>
        {/* Testimonials Infinite Slider - Lazy loaded for better performance */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <Suspense
            fallback={
              <div style={{ height: '400px', backgroundColor: '#f5f5f5' }}>
                Loading testimonials...
              </div>
            }
          >
            <LazyTestimonialsSlider testimonials={testimonials} />
          </Suspense>
        </motion.div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
