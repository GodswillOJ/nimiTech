import { Box, Card, CardContent, CardMedia, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
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
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontWeight: '400', fontFamily: 'Montserrat, sans-serif' }}
        >
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
      url: 'https://www.youtube.com/@NimiTechITConsultantsLLC-IT',
    },
    {
      icon: (
        <FaInstagram
          style={{
            color: '#c65216',
          }}
        />
      ),
      url: 'https://instagram.com/nimi.techit/',
    },
    {
      icon: (
        <FaFacebook
          style={{
            color: '#1877f2',
          }}
        />
      ),
      url: 'https://www.facebook.com/profile.php?id=61577287182430',
    },
    {
      icon: (
        <FaLinkedin
          style={{
            color: '#2e52f5',
          }}
        />
      ),
      url: 'https://www.linkedin.com/company/nimi-tech-consultants-llc/?viewAsMember=true',
    },
    {
      icon: (
        <FaXTwitter
          style={{
            color: '#cc9af0',
          }}
        />
      ),
      url: 'https://x.com/Nimitechitinsta',
    },
    {
      icon: (
        <FaWhatsapp
          style={{
            color: '#1bcc2a',
          }}
        />
      ),
      url: 'https://wa.me/12529039651',
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
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const stepData = [
    {
      number: 1,
      title: 'Unlock Limitless Potential',
      description:
        'Partnering with us means gaining access to a dedicated team of professionals who provide results-driven digital marketing services, tailored software development solutions, and cutting-edge technology implementations.',
      color: '#2d5a3d',
    },
    {
      number: 2,
      title: 'Comprehensive Solutions',
      description:
        'We provide professional website design & development, AI & machine learning solutions for business growth, advanced cybersecurity services, and scalable cloud infrastructure to meet all your digital needs.',
      color: '#546875',
    },
    {
      number: 3,
      title: 'Your Success is Our Mission',
      description:
        'We go beyond services—we build long-lasting partnerships to elevate your business. Our aim is to deliver innovative, efficient, and scalable solutions that empower our clients to thrive in an ever-evolving digital landscape.',
      color: '#b8860b',
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: isSmallScreen ? '40px 20px' : isMediumScreen ? '60px 40px' : '80px 60px',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {/* Main Title */}
      <motion.h2
        variants={itemVariants}
        style={{
          fontSize: isSmallScreen ? '1.8rem' : isMediumScreen ? '2.2rem' : '2.8rem',
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          marginBottom: isSmallScreen ? '40px' : '60px',
          lineHeight: 1.2,
        }}
      >
        Why Partner With Us
      </motion.h2>

      {/* Content Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          gap: isSmallScreen ? '0' : '60px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Side - Professional Image */}
        <motion.div
          variants={itemVariants}
          style={{
            flex: isSmallScreen ? 'none' : '1',
            width: isSmallScreen ? '100%' : 'auto',
            maxWidth: isSmallScreen ? '100%' : '500px',
            marginBottom: isSmallScreen ? '40px' : '0',
          }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              height: isSmallScreen ? '300px' : '500px',
            }}
          >
            <img
              src={businessImages.partnerWithUs}
              alt="Professional team collaboration"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
            {/* Subtle overlay for better text contrast if needed */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%)',
              }}
            />
          </div>
        </motion.div>

        {/* Right Side - Numbered Steps */}
        <motion.div
          variants={itemVariants}
          style={{
            flex: isSmallScreen ? 'none' : '1',
            width: isSmallScreen ? '100%' : 'auto',
            paddingLeft: isSmallScreen ? '0' : '20px',
          }}
        >
          {stepData.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: isSmallScreen ? '35px' : '45px',
                position: 'relative',
              }}
            >
              {/* Number Circle */}
              <div
                style={{
                  minWidth: isSmallScreen ? '50px' : '60px',
                  height: isSmallScreen ? '50px' : '60px',
                  borderRadius: '50%',
                  backgroundColor: step.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: isSmallScreen ? '16px' : '24px',
                  marginTop: '4px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                  border: '3px solid white',
                }}
              >
                <span
                  style={{
                    color: 'white',
                    fontSize: isSmallScreen ? '1.4rem' : '1.6rem',
                    fontWeight: 'bold',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: isSmallScreen ? '1.3rem' : '1.5rem',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '12px',
                    lineHeight: 1.3,
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: isSmallScreen ? '0.95rem' : '1rem',
                    lineHeight: 1.6,
                    color: '#666',
                    margin: 0,
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

const cyberImage = businessImages.client4;
const aiImage = businessImages.client1;
const marketingImage = businessImages.client3;
const softwareImage = businessImages.client2;

export const testimonials = [
  {
    image: cyberImage,
    course: 'Cybersecurity – United States',
    name: 'Jessica Moore, New York, USA',
    review: `Nimitech IT has been a game changer for our cybersecurity infrastructure. We were struggling with outdated protocols and frequent threats, but their team swiftly implemented advanced security measures and 24/7 monitoring. Since onboarding them, we’ve experienced zero breaches and complete peace of mind. Their professionalism and expertise are unmatched!`,
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
    review: `I cannot thank Nimitech IT enough for revamping our digital marketing strategy. From SEO to social media campaigns, their targeted efforts helped us reach new audiences and boost online sales by over 40% in just three months. Their analytics-driven approach really sets them apart from other agencies we’ve worked with.`,
  },
  {
    image: softwareImage,
    course: 'Software Development & Graphic Design – Australia',
    name: 'Ethan Roberts, Sydney, Australia',
    review: `Nimitech developed a custom software solution for our real estate platform and provided end-to-end branding and graphic design. Their UI/UX work was stunning, and the software functions seamlessly. They delivered on time, within budget, and exceeded expectations at every turn. We’re already planning our next project with them.`,
  },
];

const ClientReview = ({ course, name, review }) => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:1024px)');
  const initial = name?.charAt(0).toUpperCase() || '?';

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        gap: 2,
        padding: '25px',
        borderRadius: '16px',
        overflow: 'hidden',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-10px) scale(1.02)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* Blurry Background Image */}
      <Box
        component="img"
        src={businessImages.HelpDesk} // replace with your actual image path
        alt="Background"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(8px)',
          zIndex: 0,
          opacity: 0.5,
        }}
      />

      {/* Content on Top of Image */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg,rgb(1, 36, 55),rgb(19, 0, 22))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            justifySelf: 'center',
            fontSize: '4rem',
            fontStyle: 'italic',
            color: '#fff',
            fontWeight: '400',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontFamily: 'Poiret One, sans-serif',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          {initial}
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontSize: isSmallScreen ? '1.2rem' : isMediumScreen ? '1.4rem' : '1.6rem',
            fontWeight: 'bold',
            color: '#3b1647',
            fontFamily: 'Montserrat, sans-serif',
            mb: 1,
          }}
        >
          {course}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontFamily: 'Montserrat, sans-serif',
            color: '#222',
            mb: 1,
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: '1rem',
            fontFamily: 'Montserrat, sans-serif',
            lineHeight: 1.6,
            color: '#271818',
            fontStyle: 'italic',
            position: 'relative',
            px: 3,
            '&::before': {
              content: '"\\201C"', // Unicode “
              position: 'absolute',
              left: 0,
              top: -10,
              fontSize: '2rem',
              color: '#c02df1',
            },
            '&::after': {
              content: '"\\201D"', // Unicode ”
              position: 'absolute',
              right: 30,
              bottom: -10,
              fontSize: '2rem',
              color: '#c02df1',
            },
          }}
        >
          {review}
        </Typography>
      </Box>
    </Box>
  );
};

const ServiceHighlights = () => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');

  const sectionStyle = {
    display: 'flex',
    flexDirection: isSmallScreen ? 'column' : 'row',
    gap: '20px',
    justifyContent: 'space-between',
    marginTop: '40px',
  };

  const cardStyle = {
    flex: 1,
    padding: '20px',
    backgroundColor: '#fafafa',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const listStyle = {
    listStyle: 'none',
    paddingLeft: '0',
    margin: 0,
  };

  const listItemStyle = {
    color: '#333',
    fontSize: '1rem',
    lineHeight: 1.8,
    position: 'relative',
    paddingLeft: '32px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'flex-start',
  };

  const checkMarkStyle = {
    position: 'absolute',
    left: '0',
    top: '3px',
    color: '#1976d2',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  };

  const listVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const firstList = [
    'Digital Marketing Services',
    'Software Development Solutions',
    'Website Design & Development',
    'AI & Machine Learning',
  ];

  const secondList = [
    'Cloud Infrastructure & IT Solutions',
    'Remote IT Support & Helpdesk',
    'Graphic Design – Logos, Branding & Identity',
    'Cybersecurity Services & Risk Protection',
  ];

  return (
    <div style={sectionStyle}>
      {[firstList, secondList].map((list, i) => (
        <div style={cardStyle} key={i}>
          <ul style={listStyle}>
            {list.map((item, index) => (
              <motion.li
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={listVariants}
                style={listItemStyle}
              >
                <span style={checkMarkStyle}>✔</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export { BusinessPostItem, ClientReview, PartnerWithUs, ServiceHighlights, SocialLinks };
