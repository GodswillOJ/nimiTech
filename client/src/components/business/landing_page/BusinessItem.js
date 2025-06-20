import { Box, Card, CardContent, CardMedia, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { businessImages } from '../../../assets/images';

const BusinessPostItem = ({ id, image, title, content, summary }) => {
  const isBelow1100 = useMediaQuery('(max-width:1100px)');
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');
  // Truncate content to 15 words
  const getShortContent = (jsxContent) => {
    if (typeof jsxContent === 'string') {
      const words = jsxContent.split(' ');
      return words.length > 15 ? words.slice(0, 15).join(' ') + '...' : jsxContent;
    }

    if (React.isValidElement(jsxContent)) {
      const children = jsxContent.props?.children;

      // Find the first <p> tag in the JSX children
      const firstParagraph = Array.isArray(children)
        ? children.find((child) => React.isValidElement(child) && child.type === 'p')
        : React.isValidElement(children) && children.type === 'p'
          ? children
          : null;

      if (firstParagraph) {
        const paragraphText = firstParagraph.props?.children;

        // Extract plain text (even if it's nested inside arrays or fragments)
        let rawText = '';

        if (typeof paragraphText === 'string') {
          rawText = paragraphText;
        } else if (Array.isArray(paragraphText)) {
          rawText = paragraphText.filter((t) => typeof t === 'string').join(' ');
        }

        const words = rawText.split(' ');
        return words.length > 15 ? words.slice(0, 15).join(' ') + '...' : rawText;
      }
    }

    return 'Click to read more...';
  };
  return (
    <Card
      sx={{
        // maxWidth: '445px',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Montserrat, sans-serif',
        borderRadius: isSmallScreen ? '0' : isMediumScreen ? '10px' : '20px',
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
        sx={{
          borderTopLeftRadius: isSmallScreen ? '0' : isMediumScreen ? '10px' : '20px',
          borderTopRightRadius: isSmallScreen ? '0' : isMediumScreen ? '10px' : '20px',
        }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {summary ? summary : getShortContent(content)}
        </Typography>
      </CardContent>

      <Link to={`/services?id=${id}`} className="hover-link">
        Learn More
      </Link>
    </Card>
  );
};

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
  const isBelow1100 = useMediaQuery('(max-width:1100px)');
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isSmallScreen ? '0' : isMediumScreen ? '20px 10px' : '40px 20px',
      }}
    >
      <h2
        style={{
          fontSize: '2.4rem',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          padding: isSmallScreen
            ? '40px 60px 10px 60px'
            : isMediumScreen
              ? '20px 10px'
              : '40px 20px',
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
              borderRadius: isSmallScreen ? '0' : isMediumScreen ? '20px' : '40px',
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

const cyberImage = businessImages.hero1;
const aiImage = businessImages.hero2;
const marketingImage = businessImages.hero3;
const softwareImage = businessImages.hero4;

export const testimonials = [
  {
    image: cyberImage,
    course: 'Cybersecurity – United States',
    name: 'Jessica Moore, New York, USA',
    review:
      'Nimitech IT has been a game changer for our cybersecurity infrastructure. We were struggling with outdated protocols and frequent threats, but their team swiftly implemented advanced security measures and 24/7 monitoring. Since onboarding them, we’ve experienced zero breaches and complete peace of mind. Their professionalism and expertise are unmatched!',
  },
  {
    image: aiImage,
    course: 'AI & Machine Learning – Germany',
    name: 'Lukas Fischer, Berlin, Germany',
    review:
      'We partnered with Nimitech IT to integrate AI and machine learning into our logistics platform, and the results have been phenomenal. Their solutions have improved our forecasting accuracy and reduced delivery times. Their technical team was collaborative, agile, and truly understood our business needs. Highly recommended for innovation-driven projects!',
  },
  {
    image: marketingImage,
    course: 'Digital Marketing – Nigeria',
    name: 'Amaka Okonkwo, Lagos, Nigeria',
    review:
      'I cannot thank Nimitech IT enough for revamping our digital marketing strategy. From SEO to social media campaigns, their targeted efforts helped us reach new audiences and boost online sales by over 40% in just three months. Their analytics-driven approach really sets them apart from other agencies we’ve worked with.',
  },
  {
    image: softwareImage,
    course: 'Software Development & Graphic Design – Australia',
    name: 'Ethan Roberts, Sydney, Australia',
    review:
      'Nimitech developed a custom software solution for our real estate platform and provided end-to-end branding and graphic design. Their UI/UX work was stunning, and the software functions seamlessly. They delivered on time, within budget, and exceeded expectations at every turn. We’re already planning our next project with them.',
  },
];

const ClientReview = ({ image, course, name, review }) => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:1024px)');

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '25px',
        borderRadius: '16px',
        backgroundColor: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-10px) scale(1.02)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box
        component="img"
        src={image}
        alt={name}
        sx={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '4px solid #ccc',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      />

      <Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: isSmallScreen ? '1.2rem' : isMediumScreen ? '1.4rem' : '1.6rem',
            fontWeight: 'bold',
            color: '#3b1647',
            mb: 1,
          }}
        >
          {course}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#222', mb: 1 }}>
          {name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: '#555',
          }}
        >
          &ldquo;{review}&rdquo;
        </Typography>
      </Box>
    </Box>
  );
};

export { BusinessPostItem, ClientReview, PartnerWithUs, SocialLinks };
