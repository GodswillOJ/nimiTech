import React from 'react';
import { useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { BusinessPostItem } from '../../components/business/landing_page/BusinessItem';

const RegisterPage = () => {
  const location = useLocation();
  const post = location.state?.post;

  if (!post) return <p>No post data provided.</p>;

  return (
    <div>
      {/* Hero Image */}
      <div
        style={{
          backgroundImage: `url(${post.image})`,
          height: '400px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            padding: '20px',
          }}
        >
          <Typography variant="h4">{post.title}</Typography>
          <Typography variant="subtitle1">{post.date}</Typography>
        </div>
      </div>

      {/* Content & Latest Posts Section */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          padding: '40px 20px',
        }}
      >
        {/* Left - Main Content */}
        <Box flex="2" minWidth="300px" paddingRight="20px">
          <Typography variant="h5" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>
        </Box>

        {/* Right - Latest Posts */}
        <Box flex="1" minWidth="300px">
          <Typography variant="h6" gutterBottom>
            Latest Posts
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[...Array(3)].map((_, i) => (
              <BusinessPostItem
                key={i}
                image={post.image}
                title={`More Insight ${i + 1}`}
                content="Another update you may want to explore."
              />
            ))}
          </div>
        </Box>
      </div>

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
