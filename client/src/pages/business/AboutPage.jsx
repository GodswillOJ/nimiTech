import React from 'react';
import { Box, Typography, Grid, useMediaQuery } from '@mui/material';
import { businessImages } from '../../assets/images';
import Fade from '@mui/material/Fade';

const countries = ['Nigeria', 'Kenya', 'Canada', 'Germany', 'Australia'];

const About = () => {
  const isSmall = useMediaQuery('(max-width:900px)');

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" height={isSmall ? 300 : 500} overflow="hidden">
        <Box
          component="img"
          src={businessImages.hero1}
          alt="About Nimitech"
          width="100%"
          height="100%"
          sx={{ objectFit: 'cover' }}
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
            textAlign: 'center',
          }}
        >
          <Typography variant="h2" fontWeight="bold">
            About Us
          </Typography>
          <Typography mt={2} fontSize={isSmall ? '1rem' : '1.25rem'}>
            Learn who we are, what drives us, and where we’re making an impact.
          </Typography>
        </Box>
      </Box>

      {/* Mission and Contact Info */}
      <Box py={8} px={4}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                <Typography variant="h4">Our Mission & Objectives</Typography>
                <Typography mb={3} lineHeight={1.7} color="textSecondary">
                  Nimitech IT delivers expert, affordable solutions to streamline business
                  operations and boost security. Our goals:
                </Typography>
                <ul style={{ marginLeft: 20, color: '#555' }}>
                  <li>Deliver world-class IT support and digital services</li>
                  <li>Secure business data and systems 24/7</li>
                  <li>Empower clients with AI-driven innovation</li>
                  <li>Build long-term, cost-effective partnerships</li>
                </ul>
                <Typography mt={4} variant="subtitle1">
                  Office:
                </Typography>
                <Typography color="textSecondary">123 Tech Avenue, Lagos, Nigeria</Typography>
                <Typography mt={2} variant="subtitle1">
                  Contact:
                </Typography>
                <Typography color="textSecondary">+234 800 123 4567</Typography>
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade in timeout={1500}>
              <Box
                component="img"
                src={businessImages.hero2}
                alt="Team Working"
                width="100%"
                borderRadius={2}
                boxShadow={4}
              />
            </Fade>
          </Grid>
        </Grid>
      </Box>

      {/* Global Presence */}
      <Box py={8} px={4} bgcolor="#f4f4f4">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              position="relative"
              height={isSmall ? 200 : 300}
              sx={{
                backgroundImage: `url(${businessImages.hero4})`,
                backgroundSize: 'cover',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                position="absolute"
                bottom={0}
                width="100%"
                bgcolor="rgba(0,0,0,0.6)"
                px={2}
                py={1}
              >
                <Typography color="#fff" fontSize="1.5rem" fontWeight="bold">
                  Find us around the globe
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              justifyContent="center"
              height="100%"
            >
              {countries.map((c, idx) => (
                <Fade in timeout={600 + idx * 200} key={c}>
                  <Typography variant="h6" color="textPrimary" sx={{ px: 2 }}>
                    🌍 {c}
                  </Typography>
                </Fade>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default About;
