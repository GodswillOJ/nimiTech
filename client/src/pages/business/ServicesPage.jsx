import { Box, Button, Link, Typography, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { lazy, useState, useEffect } from 'react';

import donationImage1 from '../../assets/blog/images/donationImage1.webp';
import donationImage2 from '../../assets/blog/images/donationImage2.webp';
import { businessImages } from '../../assets/images';
import styles from '../blog/blog.module.scss';
import SEO from '../../components/SEO/SEO';
import logoText from '../../assets/NimiTechLogo2.png';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const Services = () => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:1024px)');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(null);
  const [counterValue, setCounterValue] = useState(0);
  const [isCounterVisible, setIsCounterVisible] = useState(false);
  const [isClickedOpen, setIsClickedOpen] = useState(false);

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
      }
    };
  }, [hoverTimer]);

  // Animated counter effect
  useEffect(() => {
    if (isCounterVisible) {
      const targetValue = 95;
      const duration = 2000; // 2 seconds
      const steps = 60; // Number of animation steps
      const stepValue = targetValue / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setCounterValue(Math.floor(stepValue * currentStep));
        } else {
          setCounterValue(targetValue);
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isCounterVisible]);

  // SEO Configuration
  const seoData = {
    title: 'Our Services - Innovative IT Solutions for Your Business Needs',
    description:
      "Explore Nimitech IT's comprehensive services designed to drive business success. From digital transformation to cybersecurity, we offer tailored solutions including web development, cloud services, and digital marketing. Get in touch today!",
    keywords:
      'IT services, digital transformation, cybersecurity, web development, cloud solutions, digital marketing, SEO, software development, IT consulting, managed IT services, Nimi Tech',
    canonical: 'https://nimitechit.com/our-services',
    ogImage: 'https://nimitechit.com/images/services-og-image.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Nimi Tech IT Services',
      description:
        'Comprehensive IT solutions including digital transformation, cybersecurity, web development, and digital marketing',
      provider: {
        '@type': 'Organization',
        name: 'Nimi Tech',
        url: 'https://nimitechit.com',
      },
      serviceType: [
        'IT Consulting',
        'Web Development',
        'Digital Marketing',
        'Cybersecurity',
        'Cloud Solutions',
      ],
      areaServed: 'Worldwide',
      url: 'https://nimitechit.com/our-services',
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const services = [
    {
      title: 'Custom Software & Web Development',
      description: 'ERP & CRM Platforms, Workflow Automation Apps, Responsive Web & Mobile Apps',
      items: [
        'ERP & CRM Platforms for unified resource and customer management',
        'Workflow Automation Apps to eliminate manual tasks',
        'Responsive Web & Mobile Apps built with modern frameworks',
        'One Time Development—full ownership, zero recurring fees',
      ],
      image: businessImages.WD_image1,
      alt: 'Web Development',
      gridArea: 'web-dev',
      backgroundColor: '#f8f9fa',
      textColor: '#2c3e50',
    },
    {
      title: 'Digital Marketing',
      description: 'SEO & Content Strategy, PPC & Targeted Advertising, Social Media Management',
      items: [
        'SEO & Content Strategy to boost organic search rankings',
        'PPC & Targeted Advertising on Google, Facebook, LinkedIn',
        'Social Media Management for consistent brand engagement',
        'Email Marketing & Automation to nurture leads and retain customers',
        'Analytics & Reporting with clear ROI metrics',
      ],
      image: businessImages.DM_image,
      alt: 'Digital Marketing',
      gridArea: 'digital-marketing',
      backgroundColor: '#fff',
      textColor: '#2c3e50',
    },
    {
      title: 'Cybersecurity Solutions',
      description: '24/7 Threat Detection, Vulnerability Assessments, Network Security',
      items: [
        '24/7 Threat Detection & Monitoring',
        'Vulnerability Assessments & Pen Testing',
        'Network Security (firewalls, VPNs, intrusion prevention)',
        'Compliance & Risk Management (HIPAA, PCI, GDPR)',
        'Incident Response & Recovery',
      ],
      image: businessImages.CS_image2,
      alt: 'Cybersecurity',
      gridArea: 'cybersecurity',
      backgroundColor: '#f8f9fa',
      textColor: '#2c3e50',
    },
    {
      title: 'AI & Machine Learning',
      description: 'Custom ML Model Development, Predictive Analytics, Computer Vision & NLP',
      items: [
        'Custom ML Model Development (classification, regression, deep learning)',
        'Predictive Analytics & Data Visualization',
        'Computer Vision & NLP for image, video, and text automation',
        'Seamless Integration with your existing systems and cloud platforms',
      ],
      image: businessImages.AI_image1,
      alt: 'AI & ML',
      gridArea: 'ai-ml',
      backgroundColor: '#fff',
      textColor: '#2c3e50',
    },
    {
      title: 'Cloud Infrastructure',
      description:
        'Cloud Migration & Management, Infrastructure as Code, Backup & Disaster Recovery',
      items: [
        'Cloud Migration & Management (AWS, Azure, Google Cloud)',
        'Infrastructure as Code for automated, repeatable deployments',
        'Backup & Disaster Recovery to protect critical data',
        'Cost Optimization to maximize your IT budget',
      ],
      image: businessImages.cloud2,
      alt: 'Cloud',
      gridArea: 'cloud',
      backgroundColor: '#f8f9fa',
      textColor: '#2c3e50',
    },
    {
      title: 'IT Support',
      description: 'Remote Troubleshooting, 24/7 Help Desk, Certified Technicians',
      items: [
        'Remote Troubleshooting for software, networks, and devices',
        '24/7 Help Desk via phone, email, and chat',
        'Certified Technicians skilled in Windows, macOS, Linux, and more',
        'Service Level Agreements guaranteeing timely response',
      ],
      image: businessImages.IT_image,
      alt: 'Remote IT Support',
      gridArea: 'it-support',
      backgroundColor: '#fff',
      textColor: '#2c3e50',
    },
  ];

  const renderServiceCard = (service, index) => (
    <motion.div
      key={index}
      variants={itemVariants}
      onClick={() => {
        // Handle click for both mobile and desktop
        setHoveredCard(service);
        setShowModal(true);
        setIsClickedOpen(true);

        // Clear any existing hover timer since user clicked
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          setHoverTimer(null);
        }
      }}
      onMouseEnter={() => {
        if (!isMediumScreen && !isSmallScreen && !isClickedOpen) {
          // Clear any existing timer
          if (hoverTimer) {
            clearTimeout(hoverTimer);
          }

          // Set the hovered card immediately for potential visual feedback
          setHoveredCard(service);

          // Set a 3-second timer before showing the modal
          const timer = setTimeout(() => {
            setShowModal(true);
          }, 3000);

          setHoverTimer(timer);
        }
      }}
      onMouseLeave={() => {
        if (!isMediumScreen && !isSmallScreen && !isClickedOpen) {
          // Clear the timer if mouse leaves before 3 seconds
          if (hoverTimer) {
            clearTimeout(hoverTimer);
            setHoverTimer(null);
          }

          setHoveredCard(null);
          setShowModal(false);
        }
      }}
      whileHover={{
        scale: isSmallScreen || isMediumScreen ? 1.02 : 1.05,
        zIndex: isSmallScreen || isMediumScreen ? 1 : 10,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      style={{
        borderRadius: isSmallScreen ? '16px' : '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e9ecef',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${service.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Overlay for text readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: isSmallScreen ? '20px' : '24px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          borderRadius: isSmallScreen ? '16px' : '20px',
          border: '1px solid #89199a5b',
        }}
      >
        {/* Service Header */}
        <Box sx={{ mb: isSmallScreen ? 2 : 3 }}>
          <Typography
            variant={isSmallScreen ? 'h6' : 'h5'}
            sx={{
              fontWeight: 700,
              color: service.textColor,
              mb: 1,
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: 1.2,
              textShadow: '0 1px 3px rgba(255,255,255,0.8)',
            }}
          >
            {service.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#5a5a5a',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: isSmallScreen ? '0.85rem' : '0.9rem',
              lineHeight: 1.4,
              textShadow: '0 1px 2px rgba(255,255,255,0.6)',
            }}
          >
            {service.description}
          </Typography>
        </Box>

        {/* Service Items */}
        <Box sx={{ flex: 1, mb: 2 }}>
          {service.items.slice(0, 3).map((item, itemIndex) => (
            <Box
              key={itemIndex}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: '#007bff',
                  borderRadius: '50%',
                  mt: '6px',
                  mr: 1.5,
                  flexShrink: 0,
                  boxShadow: '0 0 4px rgba(0, 123, 255, 0.4)',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: isSmallScreen ? '0.8rem' : '0.85rem',
                  color: '#3a3a3a',
                  fontFamily: 'Montserrat, sans-serif',
                  lineHeight: 1.4,
                  textShadow: '0 1px 2px rgba(255,255,255,0.6)',
                  fontWeight: 500,
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
          {service.items.length > 3 && (
            <Typography
              variant="body2"
              sx={{
                fontSize: '0.8rem',
                color: '#007bff',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(255,255,255,0.8)',
              }}
            >
              +{service.items.length - 3} more features
            </Typography>
          )}
        </Box>

        {/* Service Icon Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: isSmallScreen ? 16 : 20,
            right: isSmallScreen ? 16 : 20,
            width: isSmallScreen ? 50 : 60,
            height: isSmallScreen ? 50 : 60,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            border: '2px solid rgba(0, 123, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            zIndex: 1,
            overflow: 'hidden',
            opacity: 0.8,
          }}
        >
          <img
            src={service.image}
            alt={service.alt}
            style={{
              width: '70%',
              height: '70%',
              objectFit: 'cover',
              borderRadius: '50%',
              filter: 'contrast(1.1) saturate(1.2)',
            }}
          />
        </Box>
      </Box>
    </motion.div>
  );

  // Hover Card Modal Component
  const HoverCardModal = ({ service, isVisible }) => (
    <AnimatePresence>
      {isVisible && service && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            pointerEvents: 'auto',
          }}
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setHoveredCard(null);
              setIsClickedOpen(false);
            }
          }}
        >
          <div
            style={{
              width: isSmallScreen ? '95vw' : '500px',
              maxWidth: '95vw',
              maxHeight: '90vh',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              overflow: 'hidden',
              pointerEvents: 'auto',
              position: 'relative',
            }}
          >
            {/* Close Button for Mobile */}
            {(isSmallScreen || isMediumScreen) && (
              <button
                onClick={() => {
                  setShowModal(false);
                  setHoveredCard(null);
                  setIsClickedOpen(false);
                }}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 1001,
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#666',
                }}
              >
                ×
              </button>
            )}
            {/* Card Header with Image */}
            <Box
              sx={{
                position: 'relative',
                height: 200,
                backgroundImage: `url(${service.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  p: 3,
                  color: 'white',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontFamily: 'Montserrat, sans-serif',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {service.title}
                </Typography>
              </Box>
            </Box>

            {/* Card Content */}
            <Box sx={{ p: 3, maxHeight: 'calc(80vh - 200px)', overflowY: 'auto' }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#6c757d',
                  fontFamily: 'Montserrat, sans-serif',
                  mb: 3,
                  fontSize: '1rem',
                  lineHeight: 1.6,
                }}
              >
                {service.description}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#495057',
                  mb: 2,
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Features:
              </Typography>

              {/* All Service Items */}
              <Box sx={{ mb: 2 }}>
                {service.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: itemIndex * 0.1, duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#007bff',
                          borderRadius: '50%',
                          mt: '8px',
                          mr: 2,
                          flexShrink: 0,
                          boxShadow: '0 0 6px #007bff85',
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.9rem',
                          color: '#495057',
                          fontFamily: 'Montserrat, sans-serif',
                          lineHeight: 1.5,
                          fontWeight: 500,
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>

              {/* Casino-style decorative elements */}
              <Box
                sx={{
                  mt: 3,
                  pt: 2,
                  borderTop: '2px solid #89199a32',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src={logoText}
                  alt="Nimitech IT Solutions"
                  style={{
                    height: '40px',
                    maxWidth: '200px',
                    objectFit: 'contain',
                    // filter:
                    //   'brightness(0) saturate(100%) invert(21%) sepia(72%) saturate(1829%) hue-rotate(267deg) brightness(91%) contrast(99%)',
                  }}
                />
              </Box>
            </Box>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

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

      {/* Hover Card Modal with Backdrop */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            pointerEvents: 'auto',
          }}
        />
      )}

      <HoverCardModal service={hoveredCard} isVisible={showModal} />

      <Box sx={{ fontFamily: 'Montserrat, sans-serif', backgroundColor: '#f8f9fa' }}>
        {/* Hero Section */}
        <Box position="relative" height={isSmallScreen ? 400 : 500} overflow="hidden">
          <video
            src="/videos/nimiVid.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bgcolor="rgba(0,0,0,0.4)"
          />
          <Box
            position="absolute"
            top="60%"
            left="50%"
            sx={{
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              px: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant={isSmallScreen ? 'h4' : 'h2'} fontWeight="bold">
              Our Services
            </Typography>
            <Typography mt={2} fontSize={isSmallScreen ? '1rem' : '1.25rem'}>
              Comprehensive IT solutions tailored to drive your business forward
            </Typography>
          </Box>
        </Box>

        {/* Bento Grid Services Section */}
        <Box
          sx={{
            maxWidth: '1400px',
            margin: '0 auto',
            px: isSmallScreen ? 2 : 4,
            py: isSmallScreen ? 4 : 8,
          }}
        >
          {/* Section Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <Typography
              variant={isSmallScreen ? 'h4' : 'h3'}
              sx={{
                fontWeight: 700,
                color: '#2c3e50',
                textAlign: 'center',
                mb: isSmallScreen ? 4 : 6,
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              {/* What We Offer */}
            </Typography>
          </motion.div>

          {/* Bento Grid Layout */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            style={{
              display: 'grid',
              gap: isSmallScreen ? '16px' : '20px',
              gridTemplateColumns: isSmallScreen
                ? '1fr'
                : isMediumScreen
                  ? 'repeat(2, 1fr)'
                  : 'repeat(4, 1fr)',
              gridTemplateRows: isSmallScreen
                ? 'repeat(6, auto)'
                : isMediumScreen
                  ? 'repeat(4, 280px)'
                  : 'repeat(3, 240px)',
              gridTemplateAreas: isSmallScreen
                ? `
                  "web-dev"
                  "digital-marketing"
                  "cybersecurity"
                  "ai-ml"
                  "cloud"
                  "it-support"
                `
                : isMediumScreen
                  ? `
                  "web-dev web-dev"
                  "digital-marketing cybersecurity"
                  "ai-ml ai-ml"
                  "cloud it-support"
                `
                  : `
                  "web-dev web-dev digital-marketing cybersecurity"
                  "ai-ml cloud it-support cybersecurity"
                  "ai-ml cloud it-support ."
                `,
            }}
          >
            {services.map((service, index) => (
              <Box
                key={index}
                sx={{
                  gridArea: service.gridArea,
                }}
              >
                {renderServiceCard(service, index)}
              </Box>
            ))}

            {/* Stats Card - Only on desktop */}
            {!isMediumScreen && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                onViewportEnter={() => setIsCounterVisible(true)}
                style={{
                  gridArea: '. / 4 / 4 / 5',
                  backgroundColor: '#88199a',
                  borderRadius: '20px',
                  padding: '24px',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {counterValue}
                  </Typography>
                </motion.div>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'Montserrat, sans-serif',
                    opacity: 0.9,
                  }}
                >
                  % Client Satisfaction
                </Typography>
              </motion.div>
            )}
          </motion.div>
        </Box>

        {/* CTA Section */}
        <Box
          textAlign="center"
          sx={{
            background: 'linear-gradient(to right, #1976d2, #0d47a1)',
            color: '#fff',
            py: 6,
            px: isSmallScreen ? 2 : 6,
            borderRadius: 6,
            mt: 10,
            mx: isSmallScreen ? 2 : 4,
          }}
        >
          <Box
            sx={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
              background: businessImages.bg,
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Ready to Elevate Your Business?
            </Typography>
            <Typography fontSize="1.1rem" mb={4}>
              Partner with Nimitech IT for scalable, future-ready tech solutions tailored to your
              goals.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#fff',
                color: '#1976d2',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 10,
                fontSize: '1rem',
                '&:hover': { backgroundColor: '#e3f2fd' },
              }}
            >
              <Link href="/contact-us" style={{ color: 'inherit', textDecoration: 'none' }}>
                Contact Us
              </Link>
            </Button>
          </Box>
        </Box>

        {/* Donation Section */}
        <section className={styles.donation}>
          <GradientCard imageSrc={donationImage2} imagePosition="left" />
          <DonateSection
            images={[donationImage1, donationImage2, donationImage1]}
            onDonateClick={() => window.open('https://gofund.me/a95d2b08', '_blank')}
          />
        </section>
      </Box>
    </>
  );
};

export default Services;
