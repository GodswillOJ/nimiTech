// src/pages/Success.jsx
import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material';
import Fade from '@mui/material/Fade';
import { useNavigate } from 'react-router-dom';
import { businessImages } from '../../assets/images';

const Success = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  //   // 🔒 Redirect if user tries to visit this page directly
  //   useEffect(() => {
  //     if (!location.state?.fromForm) {
  //       navigate('/');
  //     }
  //   }, [location.state, navigate]);

  return (
    <Box
      minHeight="80vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={2}
      py={10}
      sx={{
        background: 'linear-gradient(to bottom right, #f5f5f5, #ffffff)',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {/* Image */}
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          mt: isSmallScreen ? 15 : isMediumScreen ? 15 : 15,
          ml: isSmallScreen ? 4 : 8,
          mr: isSmallScreen ? 4 : 8,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 6px 30px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.4s ease-in-out',
          position: 'relative',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        }}
      >
        <Fade in timeout={1500}>
          <Box position="relative">
            {/* Background Image */}
            <img
              src={businessImages.Success__}
              alt="Services Visual"
              style={{
                width: '100%',
                height: '400px',
                display: 'block',
                objectFit: 'cover',
                borderRadius: 4,
              }}
            />

            {/* Purple Overlay Text */}
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                color: '#fff',
                textAlign: 'center',
                px: 3,
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(6px)',
                  px: 3,
                  py: 2,
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{
                    fontSize: isSmallScreen ? '1.1rem' : '1.5rem',
                    lineHeight: 1.4,
                    color: '#fff',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.4)',
                  }}
                >
                  Empowering Businesses Through
                  <br />
                  Innovation and Technology
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Grid>
      <Box
        style={{
          margin: '2rem',
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Thank You for Reaching Out!
        </Typography>
        <Typography variant="body1" maxWidth="600px" mb={4}>
          We’ve received your message. Our support team will contact you shortly to assist you
          further.
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{
          backgroundColor: '#9b07ad',
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          borderRadius: 2,
          fontFamily: 'Montserrat, sans-serif',
          '&:hover': {
            backgroundColor: '#7c0691',
          },
        }}
      >
        Go Back to Home
      </Button>
    </Box>
  );
};

export default Success;
