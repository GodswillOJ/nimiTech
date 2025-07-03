import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material';
import Fade from '@mui/material/Fade';
import { motion } from 'framer-motion';
import { lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import donationImage1 from '../../assets/blog/images/donationImage1.jpg';
import donationImage2 from '../../assets/blog/images/donationImage2.jpg';
import { businessImages } from '../../assets/images';
import styles from '../blog/blog.module.scss';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const About = () => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  // const isMediumScreen = useMediaQuery('(max-width:900px)');
  // const listVariants = {
  //   hidden: { opacity: 0, y: 30 },
  //   visible: (i) => ({
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       delay: i * 0.2,
  //       duration: 0.5,
  //       ease: 'easeOut',
  //     },
  //   }),
  // };
  const [showMore, setShowMore] = useState(false);
  const listItems = [
    'Optimize Workflows: From bespoke ERP and CRM platforms to workflow automation apps, we build scalable software that streamlines operations and maximizes efficiency.',
    'Secure Your Assets: Our enterprise-grade cybersecurity services protect your data and IT infrastructure 24/7, ensuring business continuity and regulatory compliance.',
    'Leverage Intelligent Insights: Through AI-powered analytics and machine learning models, we help you uncover actionable insights and stay ahead of the competition.',
    'Grow Your Brand Online: With targeted SEO, PPC, social media strategy, and compelling content, our digital marketing experts boost your visibility, engagement, and customer acquisition.',
    'Elevate Your Visual Identity: Our graphic design and branding services create memorable logos, cohesive brand guidelines, and striking marketing collateral that resonate with your audience.',
  ];
  return (
    <Box>
      {/* Inline CSS for zoom effect */}
      <style>
        {`
          @keyframes zoomInOut {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          .zoomContainer {
            overflow: hidden;
          }

          .zoomImage {
            width: 100%;
            height: 600px;
            object-fit: cover;
            animation: zoomInOut 10s ease-in-out infinite;
            transition: transform 0.5s ease-in-out;
            display: block;
          }
        `}
      </style>

      {/* Hero Section */}
      <Box position="relative" height={isSmallScreen ? 500 : 500} overflow="hidden">
        <video
          src="/videos/nimiVid.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', marginTop: '4rem' }}
        />
        <Box position="absolute" top={0} left={0} width="100%" height="100%" />
        <Box
          position="absolute"
          top="50%"
          left="40%"
          sx={{
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            textAlign: 'normal',
            zIndex: 2,
          }}
        >
          <Typography variant="h2" fontWeight="bold" fontFamily="Montserrat, sans-serif">
            About Us
          </Typography>
          <Typography
            variant="h4"
            mt={2}
            fontSize={isSmallScreen ? '1rem' : '1.25rem'}
            sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold' }}
          >
            Learn who we are, what drives us, and where we’re making an impact.
          </Typography>
        </Box>
      </Box>

      {/* Mission and Info */}
      <Box py={8} px={isSmallScreen ? 0 : 0}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                {/* Image with Zooming Effect and Overlay */}
                <Box
                  flex={isSmallScreen ? 'unset' : '0 0 45%'}
                  maxWidth={isSmallScreen ? '100%' : '100%'}
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: '#f5f7fa',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    height: isSmallScreen ? 'auto' : '100%',
                    margin: isSmallScreen ? 'auto' : '0 4rem 0 4rem',
                  }}
                >
                  {/* Zooming Background Image */}
                  <Box
                    component="img"
                    src={businessImages.nimi_hero2}
                    alt="About Nimitech"
                    sx={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                      transition: 'transform 10s ease-in-out',
                      animation: 'zoomInOut 20s infinite alternate',
                    }}
                  />

                  {/* Overlay with Gradient */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      background:
                        'linear-gradient(to bottom right, rgba(1, 40, 65, 0.6), rgba(72, 2, 72, 0.6))',
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
                        mb: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                          fontSize: isSmallScreen ? '1.2rem' : '1.6rem',
                          lineHeight: 1.4,
                        }}
                      >
                        Who We Are at Nimitech
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: isSmallScreen ? '0.9rem' : '1rem',
                        maxWidth: '90%',
                        color: '#f5f5f5',
                        fontWeight: 400,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        backdropFilter: 'blur(2px)',
                      }}
                    >
                      We craft tailored, secure, and scalable digital experiences—designed to help
                      your business thrive in a fast-changing world.
                    </Typography>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection={isSmallScreen ? 'column' : 'row'}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    px: isSmallScreen ? 2 : 6,
                    py: 8,
                    gap: 6,
                    backgroundColor: '#f5f7fa',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {/* Text Section */}
                  <Box
                    flex={1}
                    sx={{
                      background: '#ffffff',
                      borderRadius: 4,
                      boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.05)',
                      p: isSmallScreen ? 3 : 5,
                      transition: 'all 0.3s ease-in-out',
                      height: '500px',
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{
                        mb: 2,
                        color: '#1a202c',
                        fontSize: isSmallScreen ? '1.6rem' : '2rem',
                      }}
                    >
                      About Us | Nimitech IT – Driving Your Digital Transformation
                    </Typography>

                    <Typography
                      color="text.secondary"
                      lineHeight={1.8}
                      sx={{ mb: 3, fontSize: '1rem' }}
                    >
                      At Nimitech IT, we&#39;re passionate about building not just software—but
                      business-changing solutions. Our diverse team of engineers, security analysts,
                      designers, and strategists work together to bring clarity and performance to
                      every project.
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      Whether you&#39;re a startup aiming to disrupt your market or an enterprise
                      undergoing digital transformation, our job is to turn your challenges into
                      opportunities. We&#39;re transparent, agile, and laser-focused on delivering
                      value through innovative technology.
                    </Typography>

                    {/* Business Link and Address */}
                    <Box mt={4}>
                      <Typography
                        component="div"
                        sx={{
                          fontWeight: 500,
                          color: '#333',
                          mb: 0.5,
                        }}
                      >
                        Website:{' '}
                        <Typography
                          component="a"
                          href="https://www.nimitutor.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            ml: 1,
                            color: '#1976d2',
                            textDecoration: 'none',
                            borderBottom: '1px solid #1976d2',
                            transition: 'color 0.3s',
                            '&:hover': {
                              color: '#0d47a1',
                            },
                          }}
                        >
                          www.nimitutor.com
                        </Typography>
                      </Typography>

                      <Typography sx={{ fontWeight: 500, color: '#555' }}>
                        Location: 8024 Glenwood Ave, Suite 305, Raleigh, North Carolina 27612
                      </Typography>
                    </Box>
                  </Box>
                  {/* Image with Layered Text */}
                  <Box
                    sx={{
                      flex: isSmallScreen ? 'unset' : '0 0 45%',
                      maxWidth: isSmallScreen ? '100%' : '45%',
                      position: 'relative',
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                      mt: isSmallScreen ? 4 : 0,
                      height: '500px',
                    }}
                  >
                    {/* Image */}
                    <Box
                      component="img"
                      src={businessImages.branding2}
                      alt="Team Working"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Overlay Content */}
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      width="100%"
                      height="100%"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))',
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
                          borderRadius: 2,
                          mb: 2,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          sx={{
                            fontSize: isSmallScreen ? '1.2rem' : '1.6rem',
                            lineHeight: 1.4,
                          }}
                        >
                          Empowering Innovation,
                          <br />
                          One Line of Code at a Time
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: isSmallScreen ? '0.9rem' : '1rem',
                          maxWidth: '90%',
                          color: '#e0e0e0',
                          fontWeight: 400,
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          backdropFilter: 'blur(2px)',
                        }}
                      >
                        We go beyond technology—fostering strategic growth through visionary
                        innovation, seamless collaboration, and trusted expertise in every line of
                        code we craft.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {/* Creative Animated Section */}
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',

                    margin: isSmallScreen ? 'auto' : '0 4rem 0 4rem',
                    boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
                    height: isSmallScreen ? '300px' : '450px',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {/* Zooming Image */}
                  <Box
                    component="img"
                    src={businessImages.hero2}
                    alt="Creative Team"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      animation: 'zoomInOut 18s ease-in-out infinite alternate',
                      transition: 'transform 0.5s ease-in-out',
                    }}
                  />

                  {/* Gradient Overlay + Motion Text */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      background:
                        'linear-gradient(to top right, rgba(1, 24, 39, 0.55), rgba(138,43,226,0.55))',
                      textAlign: 'center',
                      px: 3,
                      color: '#fff',
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    {/* Floating Title */}
                    <motion.div
                      initial={{ opacity: 0, y: -30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                          mb: 1,
                          fontSize: isSmallScreen ? '1.4rem' : '2rem',
                          letterSpacing: '1px',
                          textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                        }}
                      >
                        Passion Meets Precision
                      </Typography>
                    </motion.div>

                    {/* Animated Subtitle */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 1 }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: isSmallScreen ? '0.95rem' : '1.1rem',
                          maxWidth: '90%',
                          color: '#f0f0f0',
                          textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
                        }}
                      >
                        At Nimitech, innovation isn’t just our goal — it’s our culture.
                      </Typography>
                    </motion.div>
                  </Box>
                </Box>

                <Box
                  display="flex"
                  flexDirection={isSmallScreen ? 'column' : 'row'}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    px: isSmallScreen ? 2 : 6,
                    py: 6,
                    gap: 6,
                    fontFamily: 'Montserrat, sans-serif',
                    backgroundColor: '#ffffff',
                    // flexWrap: 'wrap',
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection={isSmallScreen ? 'column' : 'row'}
                    alignItems="flex-start"
                    justifyContent="space-between"
                    sx={{
                      px: isSmallScreen ? 2 : 6,
                      py: 8,
                      gap: 6,
                      backgroundColor: '#f9f9f9',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                  >
                    {/* Text Section */}
                    <Box
                      flex={isSmallScreen ? 'unset' : '0 0 50%'}
                      maxWidth={isSmallScreen ? '100%' : '50%'}
                      sx={{
                        backgroundColor: '#fdfdfd',
                        borderRadius: 4,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                        p: isSmallScreen ? 3 : 4,
                        height: '500px',
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                          mb: 2,
                          color: '#1a202c',
                          fontSize: isSmallScreen ? '1.4rem' : '1.6rem',
                        }}
                      >
                        Building Tailored Solutions for Digital Success
                      </Typography>

                      <Typography
                        color="text.secondary"
                        lineHeight={1.8}
                        sx={{ fontSize: '1rem', mb: 4, color: '#555' }}
                      >
                        Founded on a commitment to innovation and client success, our team of
                        certified developers, security specialists, data scientists, and creative
                        designers collaborates closely with you to craft solutions that:
                      </Typography>

                      {/* Animated List with Toggle */}
                      <Box component="ul" sx={{ pl: 0, mb: 3 }}>
                        {(showMore ? listItems : [listItems[0]]).map((text, index) => (
                          <motion.li
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={{
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
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              marginBottom: '1.2rem',
                              fontSize: '0.97rem',
                              lineHeight: 1.75,
                              color: '#333',
                              listStyle: 'none',
                            }}
                          >
                            <Box
                              sx={{
                                minWidth: '1rem',
                                height: '1rem',
                                borderRadius: '50%',
                                backgroundColor: '#1976d2',
                                mr: 2,
                                mt: '6px',
                                flexShrink: 0,
                              }}
                            />
                            <Typography component="span" sx={{ flex: 1 }}>
                              {text}
                            </Typography>
                          </motion.li>
                        ))}
                      </Box>

                      {/* View More / View Less Button */}
                      <Button
                        onClick={() => setShowMore(!showMore)}
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          textTransform: 'none',
                          color: '#1976d2',
                          mt: 1,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {showMore ? 'View Less' : 'View More'}
                      </Button>
                    </Box>

                    {/* Image with Overlay */}
                    <Box
                      flex={isSmallScreen ? 'unset' : '0 0 45%'}
                      maxWidth={isSmallScreen ? '100%' : '45%'}
                      sx={{
                        position: 'relative',
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        height: isSmallScreen ? 'auto' : '500px',
                      }}
                    >
                      <Box
                        component="img"
                        src={businessImages.about_us_1}
                        alt="Services Visual"
                        sx={{
                          width: '100%',
                          height: isSmallScreen ? 'auto' : '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />

                      {/* Overlay Content */}
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        width="100%"
                        height="100%"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          background:
                            'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7))',
                          color: '#fff',
                          textAlign: 'center',
                          px: 3,
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            backdropFilter: 'blur(8px)',
                            px: 3,
                            py: 2,
                            borderRadius: 3,
                            mb: 2,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                          }}
                        >
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{ fontSize: isSmallScreen ? '1.2rem' : '1.6rem', lineHeight: 1.4 }}
                          >
                            We Build Digital Confidence
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: isSmallScreen ? '0.9rem' : '1rem',
                            maxWidth: '90%',
                            color: '#e0e0e0',
                            fontWeight: 400,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            backdropFilter: 'blur(2px)',
                          }}
                        >
                          Every line of code we write is tailored to solve real business
                          problems—securely, creatively, and with your long-term growth in mind.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Fade>
            {/* Image */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                mt: isSmallScreen ? 4 : 4,
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
                    src={businessImages.Cloud_comp2}
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
                      background:
                        'linear-gradient(to bottom, rgba(129, 128, 132, 0.55), rgba(63, 0, 102, 0.47))',
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
          </Grid>

          <section>
            <Typography
              mt={6}
              variant="body1"
              sx={{
                fontSize: isSmallScreen ? '0.98rem' : '1.05rem',
                px: isSmallScreen ? 2 : 5,
                mx: isSmallScreen ? 2 : 5,
                lineHeight: 2,
                color: '#444',
                fontFamily: 'Montserrat, sans-serif',
                letterSpacing: '0.3px',
                backgroundColor: '#f9f9f9',
                py: 4,
                borderRadius: 3,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.04)',
              }}
            >
              Based in <strong style={{ color: '#1976d2' }}>Raleigh, North Carolina</strong>, and
              serving clients across the United States and beyond, <strong>Nimitech IT</strong>{' '}
              combines deep industry expertise with transparent communication and{' '}
              <strong>24/7 support</strong>.
              <br />
              <br />
              We believe in{' '}
              <strong style={{ color: '#1976d2' }}>one-time development investments</strong>—no
              hidden subscriptions—so you retain full ownership and control of your technology.
              <br />
              <br />
              Partner with <strong>Nimitech IT</strong> for affordable, future-ready IT solutions
              that transform challenges into opportunities.
              <br />
              <br />
              <Link to="/contact-us">
                <span
                  style={{
                    display: 'inline-block',
                    background: '#88199a',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    marginTop: '10px',
                    cursor: 'pointer',
                    transition: 'background 0.3s',
                  }}
                  onMouseOver={(e) => (e.target.style.background = '#51035e')}
                  onMouseOut={(e) => (e.target.style.background = '#2e0335')}
                >
                  Schedule a Free Consultation
                </span>
              </Link>
            </Typography>
          </section>

          <section className={styles.donation}>
            <GradientCard imageSrc={donationImage2} imagePosition="left" />
            <DonateSection
              images={[donationImage1, donationImage2, donationImage1]}
              onDonateClick={() => window.open('https://www.example.com/donate', '_blank')}
            />
          </section>
        </Grid>
      </Box>
    </Box>
  );
};

export default About;
