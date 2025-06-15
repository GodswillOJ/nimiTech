import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { TextField, Button, Typography, Box, useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BusinessPostItem } from '../../components/business/landing_page/BusinessItem';
import { businessImages } from '../../assets/images.js';
const RegisterPage = () => {
  const location = useLocation();
  const post = location.state?.post;
  const isBelow1100 = useMediaQuery('(max-width:1100px)');
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  if (!post) return <p>No post data provided.</p>;

  return (
    <div>
      {/* Hero Image */}
      <div className="background-container">
        <div
          className="background-image"
          style={{
            backgroundImage: `url(${post.image})`,
          }}
        ></div>
        <div className="hero-overlay"></div>
        <div
          style={{
            position: 'relative',
            top: isSmallScreen ? 250 : isMediumScreen ? 250 : 300,
            background: 'none',
            color: '#fff',
            padding: isSmallScreen ? '10px' : '20px',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <Typography
            variant="h1"
            style={{
              fontSize: isSmallScreen ? '1.8rem' : isMediumScreen ? '3.5rem' : '4.5rem',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
            }}
          >
            NimiTech IT Solutions LLC
          </Typography>
          <Typography
            variant="h2"
            style={{
              fontSize: isSmallScreen ? '1.8rem' : isMediumScreen ? '2.5rem' : '3.5rem',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
            }}
          >
            Solutions LLC
          </Typography>

          <button
            className="services-btn"
            style={{
              backgroundColor: '#3b82f6',
              borderRadius: '10px',
              padding: isSmallScreen ? '10px 20px' : '12px 28px',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: isSmallScreen ? '0.9rem' : isMediumScreen ? '1rem' : '1.2rem',
              fontWeight: 'bold',
            }}
          >
            <Link
              href="/blogs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: 'white',
                borderRadius: '30px',
                fontWeight: 'bold',
                fontSize: isSmallScreen ? '0.9rem' : isMediumScreen ? '1rem' : '1.2rem',
                textDecoration: 'none',
              }}
            >
              More services
              <ArrowBackIcon />
            </Link>
          </button>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            padding: isSmallScreen ? '10px' : isMediumScreen ? '15px' : '20px',
            zIndex: 1,
            textAlign: 'left',
          }}
        >
          <Typography
            variant="h4"
            style={{
              fontSize: isSmallScreen ? '1.2rem' : isMediumScreen ? '1.5rem' : '2rem',
              fontWeight: 'bold',
            }}
          >
            {post.title}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{
              fontSize: isSmallScreen ? '0.8rem' : isMediumScreen ? '0.95rem' : '1.1rem',
              opacity: 0.9,
            }}
          >
            {post.date}
          </Typography>
        </div>
      </div>

      {/* Content & Latest Posts Section */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '40px 20px',
          gap: '20px',
        }}
      >
        {/* Left - Image */}
        <div
          className="image-container"
          style={{
            flex: '1 1 400px',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          <img
            src={businessImages.hero2}
            alt="Manager Section Visual"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '700px',
              objectFit: 'cover',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}
          />
        </div>

        {/* Right - Main Content */}
        <Box flex="2 1 300px" minWidth="280px" paddingRight="20px" style={{ width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>
        </Box>
      </div>

      {/* Right - Latest Posts */}
      <Box sx={{ m: 6 }}>
        <Typography variant="h6" gutterBottom>
          Other services you may like
        </Typography>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                flex: '1 1 300px', // Responsive flex shrink/grow with min size
                maxWidth: '100%',
              }}
            >
              <BusinessPostItem
                image={post.image}
                title={`More Insight ${i + 1}`}
                content="Another update you may want to explore."
              />
            </div>
          ))}
        </div>
      </Box>
      {/* Registration Form */}
      <Box
        sx={{
          background: '#f9f9f9',
          padding: '40px 20px',
          maxWidth: '800px',
          margin: 'auto',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register with Us
        </Typography>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TextField label="Full Name" variant="outlined" required />
          <TextField label="Email" variant="outlined" type="email" required />
          <TextField label="Phone Number" variant="outlined" required />
          <TextField label="Location" variant="outlined" required />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#3b1647',
              borderRadius: '30px',
              padding: '10px 30px',
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#b71c1c',
              },
            }}
            type="submit"
          >
            Register
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default RegisterPage;
