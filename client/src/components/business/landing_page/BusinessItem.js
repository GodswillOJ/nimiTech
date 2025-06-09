import React from 'react';
import { Card, CardContent, Typography, Button, CardMedia } from '@mui/material';

const BusinessPostItem = ({ image, title, content }) => (
  <Card
    sx={{
      maxWidth: 345,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
      },
    }}
  >
    <CardMedia
      component="img"
      height="180"
      image={image}
      alt={title}
      sx={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}
    />

    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {content}
      </Typography>
    </CardContent>

    <Button
      variant="contained"
      href="/register"
      sx={{
        m: 2,
        alignSelf: 'center',
        borderRadius: '50px',
        textTransform: 'none',
        padding: '10px 30px',
        backgroundColor: '#3b1647',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#b71c1c',
        },
      }}
    >
      Register Here
    </Button>
  </Card>
);

export default BusinessPostItem;
