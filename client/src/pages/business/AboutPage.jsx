import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import Fade from '@mui/material/Fade';
import { lazy } from 'react';
import donationImage1 from '../../assets/blog/images/donationImage1.jpg';
import donationImage2 from '../../assets/blog/images/donationImage2.jpg';
import { businessImages } from '../../assets/images';
import styles from '../blog/blog.module.scss';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const About = () => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" height={isSmallScreen ? 500 : 500} overflow="hidden">
        <video
          src="/videos/nimiVid.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', marginTop: '4rem' }}
        />
        <Box position="absolute" top={0} left={0} width="100%" height="100%" />
        <Box
          position="absolute"
          top="50%"
          left="40%"
          sx={{
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            textAlign: 'normal',
            zIndex: 2,
          }}
        >
          <Typography variant="h2" fontWeight="bold" fontFamily="Montserrat, sans-serif">
            About Us
          </Typography>
          <Typography
            variant="h4"
            mt={2}
            fontSize={isSmallScreen ? '1rem' : '1.25rem'}
            sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}
          >
            Learn who we are, what drives us, and where we’re making an impact.
          </Typography>
        </Box>
      </Box>

      {/* Mission and Info */}
      <Box py={8} px={isSmallScreen ? 0 : 0}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant="h4"
                  style={{
                    padding: isSmallScreen ? '0 10px' : '0 40px',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  About Us | Nimitech IT – Driving Your Digital Transformation
                </Typography>
                <Typography
                  mb={3}
                  lineHeight={1.7}
                  color="textSecondary"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    padding: isSmallScreen ? '0 10px' : '10px 40px',
                  }}
                >
                  At Nimitech IT, we’re passionate about empowering businesses to thrive in an ever
                  evolving digital landscape. As a full service technology partner, we deliver
                  custom software development, cybersecurity, AI & machine learning, digital
                  marketing, graphic design, and cloud solutions—all designed to meet your unique
                  challenges and fuel sustainable growth.
                </Typography>
                <Grid item xs={12} m={2}>
                  <Fade in timeout={1500}>
                    <Box
                      component="img"
                      src={businessImages.hero2}
                      alt="Team Working"
                      width="100%"
                      borderRadius={0}
                      boxShadow={4}
                    />
                  </Fade>
                </Grid>
                <Typography
                  mt={6}
                  variant="body1"
                  color="textSecondary"
                  lineHeight={1.7}
                  style={{
                    fontSize: '1rem',
                    fontFamily: 'Montserrat, sans-serif',
                    padding: isSmallScreen ? '0 10px' : '10px 40px',
                  }}
                >
                  Founded on a commitment to innovation and client success, our team of certified
                  developers, security specialists, data scientists, and creative designers
                  collaborates closely with you to craft solutions that:
                </Typography>

                {/* ✔ Bullet List */}
                <ul
                  style={{
                    fontSize: '1rem',
                    lineHeight: '2',
                    padding: '0 60px',
                    marginBottom: 30,
                    fontFamily: 'Montserrat, sans-serif',
                    listStyle: 'none',
                  }}
                >
                  {[
                    'Optimize Workflows: From bespoke ERP and CRM platforms to workflow automation apps, we build scalable software that streamlines operations and maximizes efficiency.',
                    'Secure Your Assets: Our enterprise grade cybersecurity services protect your data and IT infrastructure 24/7, ensuring business continuity and regulatory compliance.',
                    'Leverage Intelligent Insights: Through AI powered analytics and machine learning models, we help you uncover actionable insights and stay ahead of the competition.',
                    'Grow Your Brand Online: With targeted SEO, PPC, social media strategy, and compelling content, our digital marketing experts boost your visibility, engagement, and customer acquisition.',
                    'Elevate Your Visual Identity: Our graphic design and branding services create memorable logos, cohesive brand guidelines, and striking marketing collateral that resonate with your audience.',
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      style={{ display: 'flex', alignItems: 'flex-start', color: '#333' }}
                    >
                      <span style={{ marginRight: '8px', lineHeight: '1.6' }}>✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Grid item xs={12} m={2}>
                  <Fade in timeout={1500}>
                    <Box
                      component="img"
                      src={businessImages.RM_image}
                      alt="Services Visual"
                      width="100%"
                      borderRadius={0}
                      boxShadow={3}
                    />
                  </Fade>
                </Grid>

                <Typography
                  mt={6}
                  variant="body1"
                  style={{
                    fontSize: '1rem',
                    padding: isSmallScreen ? '0 10px' : '10px 40px',
                    lineHeight: '2',
                    color: '#555',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  Based in Raleigh, North Carolina, and serving clients across the United States and
                  beyond, Nimitech IT combines deep industry expertise with transparent
                  communication and 24/7 support. We believe in one time development investments—no
                  hidden subscriptions—so you retain full ownership and control of your technology.
                  Partner with Nimitech IT for affordable, future ready IT solutions that transform
                  challenges into opportunities. Let’s build your competitive edge together.
                  Schedule a free consultation
                </Typography>
              </Box>
            </Fade>
          </Grid>

          <section className={styles.donation}>
            <GradientCard imageSrc={donationImage2} imagePosition="left" />
            <DonateSection
              images={[donationImage1, donationImage2, donationImage1]}
              onDonateClick={() => window.open('https://www.example.com/donate', '_blank')}
            />
          </section>
        </Grid>
      </Box>
    </Box>
  );
};

export default About;
