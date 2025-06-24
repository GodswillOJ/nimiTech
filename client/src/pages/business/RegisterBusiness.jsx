import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, TextField, Typography, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { businessImages } from '../../assets/images.js';
import { dummyBusinessPosts } from '../../components/business/business_post/buisnessData.jsx';
import { BusinessPostItem } from '../../components/business/landing_page/BusinessItem';
const BusinessRegisterPage = () => {
  const search = useLocation().search;
  const postId = parseInt(new URLSearchParams(search).get('id'), 10);
  const post = dummyBusinessPosts.find((p) => p.id === postId);
  const otherPosts = Array.from(
    new Map(
      dummyBusinessPosts.filter((p) => p.id !== postId).map((p) => [p.id, p]) // Use ID as the key to remove duplicates
    ).values()
  );
  const isBelow1100 = useMediaQuery('(max-width:1100px)');
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [postId]);

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
            padding: '0 4rem 0 4rem',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <h2
            className="my-domine"
            style={{
              fontSize: isSmallScreen ? '1.8rem' : isMediumScreen ? '2.4rem' : '3.8rem',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Reliable Tech Solutions to Power Your Growth
          </h2>

          <button
            className="services-btn"
            style={{
              backgroundColor: '#88199a',
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
              href="/our-services"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: 'white',
                borderRadius: '30px',
                fontWeight: 'bold',
                fontSize: isSmallScreen ? '0.9rem' : isMediumScreen ? '1rem' : '1.2rem',
                textDecoration: 'none',
                fontFamily: 'Montserrat, sans-serif',
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
          padding: isSmallScreen ? '40px 0 20px 0' : isMediumScreen ? '20px 20px' : '40px 20px',
          gap: '20px',
        }}
      >
        {/* Right - Main Content */}
        <Box flex="2 1 300px" style={{ width: '100%' }}>
          {/* <Typography variant="h5" gutterBottom>
            {post.title}
          </Typography> */}
          <Typography variant="" paragraph>
            {post.content}
          </Typography>
        </Box>
      </div>

      {/* Right - Latest Posts */}
      <Box sx={{ margin: isSmallScreen ? '0' : '48px' }}>
        <Typography
          variant="h5"
          gutterBottom
          style={{
            textAlign: 'center',
            marginTop: '20px',
            marginBottom: '40px',
          }}
        >
          Other services
        </Typography>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center', // ⬅️ This centers the items
            gap: '20px',
          }}
        >
          {otherPosts.map((otherPost) => (
            <div key={otherPost.id} style={{ flex: '1 1 300px', maxWidth: '100%' }}>
              <BusinessPostItem
                id={otherPost.id}
                image={otherPost.image}
                title={otherPost.title}
                content={otherPost.content}
              />
            </div>
          ))}
        </div>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: 4,
          padding: isSmallScreen ? '0' : isMediumScreen ? '20px 10px' : '40px 20px',
          backgroundColor: '#f0f0f0',
          borderRadius: isSmallScreen ? '0' : isMediumScreen ? '5px' : '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          maxWidth: '1200px',
          margin: '40px auto',
        }}
      >
        {/* Left: Image with overlay text */}
        <Box
          sx={{
            flex: 1,
            minHeight: '400px',
            width: isSmallScreen ? '100%' : '0',
            backgroundImage: `url(${businessImages.hero2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: isSmallScreen ? '0' : isMediumScreen ? '5px' : '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              padding: 6,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: isSmallScreen ? '0' : isMediumScreen ? '5px' : '16px',
            }}
          >
            <Typography
              variant="h2"
              fontFamily="Montserrat, sans-serif"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                px: 2,
              }}
            >
              Reach out to us
            </Typography>
            <Typography
              variant="p"
              fontFamily="Montserrat, sans-serif"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '1.2rem',
                px: 2,
              }}
            >
              Schedule a free, no obligation consultation today.
            </Typography>
          </Box>
        </Box>

        {/* Right: Registration Form */}
        <Box
          sx={{
            flex: 1,
            background: 'none',
            padding: '40px 30px',
            borderRadius: '16px',
          }}
        >
          <Typography variant="h4" fontFamily="Montserrat, sans-serif" gutterBottom>
            Contact us
          </Typography>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <TextField
              className="text_area"
              label="Full Name"
              fontFamily="Montserrat, sans-serif"
              variant="outlined"
              required
            />
            <TextField
              className="text_area"
              label="Email"
              variant="outlined"
              type="email"
              fontFamily="Montserrat, sans-serif"
              required
            />
            <TextField
              className="text_area"
              fontFamily="Montserrat, sans-serif"
              label="Phone Number"
              variant="outlined"
              required
            />
            <TextField
              className="text_area"
              fontFamily="Montserrat, sans-serif"
              label="Location"
              variant="outlined"
              required
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#3b1647',
                borderRadius: '30px',
                padding: '10px 30px',
                textTransform: 'none',
                fontWeight: 'bold',
                fontFamily: 'Montserrat, sans-serif',
                '&:hover': {
                  backgroundColor: '#b71c1c',
                },
              }}
              type="submit"
            >
              Send
            </Button>
          </form>
        </Box>
      </Box>
    </div>
  );
};

export default BusinessRegisterPage;
