import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { businessImages } from '../../../assets/images';

const BusinessPostItem = ({ image, title, content }) => (
  <Card
    sx={{
      maxWidth: '445px',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Montserrat, sans-serif',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(141, 140, 140, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
      },
    }}
  >
    <CardMedia
      component="img"
      height="250"
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

    <Link
      to={{
        pathname: '/register',
      }}
      state={{
        post: { image, title, content, date: new Date().toLocaleDateString() },
      }}
      className="hover-link"
    >
      Enroll here
    </Link>
  </Card>
);

const SocialLinks = () => {
  const links = [
    {
      icon: (
        <FaYoutube
          style={{
            color: '#c00302',
          }}
        />
      ),
      url: 'https://youtube.com/yourchannel',
    },
    {
      icon: (
        <FaInstagram
          style={{
            color: '#c65216',
          }}
        />
      ),
      url: 'https://instagram.com/yourprofile',
    },
    {
      icon: (
        <FaFacebook
          style={{
            color: '#167ac6',
          }}
        />
      ),
      url: 'https://facebook.com/yourpage',
    },
    {
      icon: (
        <FaTwitter
          style={{
            color: '#01560e',
          }}
        />
      ),
      url: 'https://twitter.com/yourhandle',
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        justifyContent: 'center',
        fontSize: '1.5rem',
      }}
    >
      {links.map((link, idx) => (
        <a
          key={idx}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#333' }}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

const PartnerWithUs = ({ services }) => {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
      }}
    >
      <h2
        style={{
          fontSize: '2.4rem',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        Why Partner With Us
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Responsive row layout */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {/* Text container */}
          <div
            style={{
              flex: 1,
              minWidth: '300px',
              backgroundColor: '#f9f9f9',
              borderRadius: '16px',
              padding: '40px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '500px', // Match the image height
            }}
          >
            <h3
              style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#111',
              }}
            >
              Unlock Limitless Potential
            </h3>
            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.7',
                marginBottom: '20px',
                color: '#444',
              }}
            >
              Partnering with us means gaining access to a dedicated team of professionals who
              provide:
            </p>
            <ul style={{ paddingLeft: '20px', fontSize: '1rem', lineHeight: '1.6', color: '#333' }}>
              {services.slice(0, 6).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Image container with overlay text */}
          <div
            className="image-container"
            style={{
              flex: 1,
              minWidth: '300px',
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              height: '500px',
            }}
          >
            <img
              src={businessImages.hero2}
              alt="Partner with us"
              className="image-hover"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.6)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                padding: '30px',
                textAlign: 'left',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '500px',
              }}
            >
              <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>
                Your Success is Our Mission
              </h3>
              <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
                We go beyond services—we build long-lasting partnerships to elevate your business.
                Our aim is to deliver innovative, efficient, and scalable solutions that empower our
                clients to thrive in an ever-evolving digital landscape.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BusinessPostItem, PartnerWithUs, SocialLinks };
