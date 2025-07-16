import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMediaQuery, Box } from '@mui/material';
import { lazy, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import donationImage1 from '../../assets/blog/images/donationImage1.webp';
import donationImage2 from '../../assets/blog/images/donationImage2.webp';
import { businessImages } from '../../assets/images.js';
import {
  dummyBusinessPosts,
  introSubtitle,
  introText,
  services,
} from '../../components/business/business_post/buisnessData.jsx';
import CeoMessage from '../../components/business/CeoMessage/CeoMessage';
import SEO from '../../components/SEO/SEO';
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

  // SEO Configuration
  const seoData = {
    title: 'Home - Transform Your Business with Innovative IT Solutions',
    description:
      'Discover how Nimitech IT helps businesses thrive with digital transformation, cybersecurity, web development, and cloud solutions. Unlock innovation and efficiency with our expert IT services. Contact us today to start your journey!',
    keywords:
      'IT solutions, digital transformation, cybersecurity, web development, cloud solutions, digital marketing, business innovation, technology consulting, Nimi Tech, IT services',
    canonical: 'https://nimitechit.com/',
    ogImage: 'https://nimitechit.com/images/home-og-image.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Nimi Tech',
      url: 'https://nimitechit.com',
      logo: 'https://nimitechit.com/images/logo.png',
      description:
        'Leading IT solutions provider specializing in digital transformation, cybersecurity, and innovative technology services',
      foundingDate: '2020',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-XXX-XXX-XXXX',
        contactType: 'customer service',
        availableLanguage: 'English',
      },
      sameAs: [
        'https://www.linkedin.com/company/nimitech',
        'https://twitter.com/nimitechit',
        'https://www.facebook.com/nimitech',
      ],
    },
  };

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
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={seoData.canonical}
        ogImage={seoData.ogImage}
        ogUrl={seoData.canonical}
        structuredData={seoData.structuredData}
      />
      {/* Preload critical images for better LCP */}
      <link rel="preload" as="image" href={businessImages.hero_background2} />

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
            height: '100vh',
            overflow: 'hidden',
            backgroundImage: `url(${businessImages.hero_background2})`,
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
        <motion.div
          style={{ position: 'relative', height: isSmallScreen ? 400 : 500 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <video
            src="/videos/nimiVid.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', marginTop: '0' }}
          />
          <Box position="absolute" top={0} left={0} width="100%" height="100%" />

          {/* Animated Text Overlay */}
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '40%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              textAlign: 'normal',
              zIndex: 2,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h2
              style={{
                fontWeight: 'bold',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: isSmallScreen ? '1.8rem' : '3rem',
                marginBottom: '1rem',
              }}
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  '2px 2px 8px rgba(0,0,0,0.3)',
                  '4px 4px 16px rgba(29, 25, 154, 0.6)',
                  '2px 2px 8px rgba(0,0,0,0.3)',
                  '2px 2px 4px rgba(0, 0, 0, 0.7)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            >
              Your Success is Our Mission
            </motion.h2>

            <motion.p
              style={{
                fontSize: isSmallScreen ? '1rem' : '1.25rem',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 'bold',
                marginTop: '1rem',
                lineHeight: 1.6,
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
              }}
              animate={{
                y: [0, -5, 0],
                opacity: [0.9, 1, 0.9],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: 0.5,
              }}
            >
              We go beyond services-we build long-lasting partnerships to elevate your business.
              <br />
              Our aim is to deliver innovative, efficient, and scalable solutions that empower our
              clients to thrive in an ever-evolving digital landscape.
            </motion.p>

            {/* Animated accent elements */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #88199a, #0e1c88ff)',
                opacity: 0.7,
              }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <motion.div
              style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '60px',
                height: '4px',
                borderRadius: '2px',
                background: 'linear-gradient(90deg, transparent, #fff, transparent)',
              }}
              animate={{
                scaleX: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
            />
          </motion.div>
        </motion.div>
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
            marginTop: isSmallScreen ? '30px' : '60px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          <motion.h1
            variants={fadeInUp}
            style={{
              textAlign: 'center',
              marginBottom: isSmallScreen ? '0' : '10px',
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
        {/* partner with us */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          {/* Partner With Us Section */}
          <PartnerWithUs services={services} />
        </motion.div>{' '}
        {/* Testimonials Infinite Slider - Lazy loaded for better performance */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <LazyTestimonialsSlider testimonials={testimonials} />
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
        {/* Youtube Channel Section */}
        <motion.div
          style={{
            position: 'relative',
            overflow: 'hidden',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          {/* Video Container - Full Width */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '60vh',
              minHeight: '400px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Enhanced YouTube Embed with proper sizing and functionality */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/fWk0YKyVGBk?controls=1&showinfo=0&rel=0&modestbranding=1&playsinline=1&origin=${window.location.origin}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px',
                  aspectRatio: '16/9',
                  position: 'relative',
                  zIndex: 2,
                }}
              />
            </div>

            {/* Background Gradient Overlay - Behind the video */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />

            {/* Floating Social Card */}
            <div
              style={{
                position: 'absolute',
                bottom: '32px',
                right: '32px',
                zIndex: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                transform: 'translateY(0)',
                transition: 'all 0.3s ease',
                maxWidth: '280px',
                // Mobile positioning
                ...(typeof window !== 'undefined' && window.innerWidth <= 768
                  ? {
                      display: 'none',
                      // position: 'static',
                      // margin: '20px auto',
                      // maxWidth: '100%',
                      // width: 'calc(100% - 40px)',
                    }
                  : {}),
              }}
            >
              <h3
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '600',
                  fontSize: '18px',
                  marginBottom: '16px',
                  color: '#fff',
                  textAlign: 'center',
                  letterSpacing: '0.5px',
                }}
              >
                Connect With Us
              </h3>
              <SocialLinks />
            </div>
          </div>
        </motion.div>
        {/* Enhanced Social Links Component */}
        <style>{`
          @media (max-width: 768px) {
            .floating-social-card {
              position: static !important;
              margin: 20px auto !important;
              bottom: auto !important;
              right: auto !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
              max-width: calc(100% - 40px) !important;
            }
          }

          @media (max-width: 480px) {
            .video-container {
              height: 50vh !important;
              min-height: 300px !important;
            }

            .floating-social-card {
              padding: 16px !important;
              border-radius: 12px !important;
            }
          }
        `}</style>
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
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
