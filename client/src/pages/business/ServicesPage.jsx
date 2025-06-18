import React from 'react';
import { Box, Typography, Grid, Button, useMediaQuery } from '@mui/material';
import Fade from '@mui/material/Fade';
import { businessImages } from '../../assets/images';

const servicesSummary = [
  {
    title: 'Digital Marketing',
    text: 'Boost your online presence with SEO, social media, and targeted campaigns that drive real results.',
    img: businessImages.hero2,
  },
  {
    title: 'Cybersecurity',
    text: 'Protect your data with tailored, affordable security solutions for all industries.',
    img: businessImages.hero3,
  },
  {
    title: 'AI & Machine Learning',
    text: 'Leverage AI/ML to automate processes, gain insights, and power smarter decisions.',
    img: businessImages.hero4,
  },
  {
    title: 'Custom Software & Web Development',
    text: 'Build scalable apps and websites tailored to your business—no subscriptions required.',
    img: businessImages.hero1,
  },
];

const Services = () => {
  const isSmall = useMediaQuery('(max-width:900px)');

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" height={isSmall ? 300 : 500} overflow="hidden">
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
          top="50%"
          left="50%"
          sx={{
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            px: 2,
            textAlign: isSmall ? 'center' : 'left',
          }}
        >
          <Typography variant={isSmall ? 'h4' : 'h2'} fontWeight="bold">
            Explore Our Expert Services
          </Typography>
          <Typography mt={2} fontSize={isSmall ? '1rem' : '1.25rem'}>
            From marketing and security to AI and custom development — tailored solutions to help
            your business thrive.
          </Typography>
        </Box>
      </Box>

      {/* Why Choose Us */}
      <Box py={8} px={4} bgcolor="#f9f9f9">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Why Choose Nimitech IT?
                </Typography>
                <Typography lineHeight={1.7} mb={4} color="textSecondary">
                  Nimitech IT empowers businesses through cost-effective and expert IT solutions —
                  from 24/7 support to secure, scalable systems. We reduce your IT costs without
                  compromising quality.
                </Typography>
                <Button variant="contained" color="primary" size="large">
                  Talk to a Digital Marketing Expert
                </Button>
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade in timeout={1500}>
              <Box
                component="img"
                src={businessImages.hero3}
                alt="Services Visual"
                width="100%"
                borderRadius={2}
                boxShadow={3}
              />
            </Fade>
          </Grid>
        </Grid>
      </Box>

      {/* Services List */}
      <Box px={4} py={8}>
        <Grid container spacing={4}>
          {servicesSummary.map((svc, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Fade in timeout={500 + i * 300}>
                <Box
                  display="flex"
                  borderRadius={2}
                  overflow="hidden"
                  boxShadow={4}
                  sx={{
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
                    transition: '0.3s',
                  }}
                >
                  <Box flex="1" p={3} bgcolor="#fff">
                    <Typography variant="h5" fontWeight="bold" mb={2}>
                      {svc.title}
                    </Typography>
                    <Typography>{svc.text}</Typography>
                  </Box>
                  <Box flex="1.2">
                    <Box
                      component="img"
                      src={svc.img}
                      alt={svc.title}
                      width="100%"
                      height="100%"
                      sx={{ objectFit: 'cover' }}
                    />
                  </Box>
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Services;
