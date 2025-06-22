import { Box, Button, Divider, Grid, TextField, Typography, useMediaQuery } from '@mui/material';
import Fade from '@mui/material/Fade';
import { FiClock, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YouTubeIcon,
} from '../../assets/blog/icons/SocialIcons';

const ContactUs = () => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" height={isSmallScreen ? 500 : 550} overflow="hidden">
        <video
          src="/videos/nimiVid.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            marginTop: '4rem',
          }}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          // Optional overlay:
          // bgcolor="rgba(0, 0, 0, 0.4)"
        />
        <Box
          position="absolute"
          top="50%"
          left="40%"
          sx={{
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            textAlign: 'normal',
            zIndex: 2,
            px: 2,
          }}
        >
          <Typography variant="h3" fontWeight="bold">
            Contact Us | Nimitech IT
          </Typography>
          <Typography mt={2} fontSize={isSmallScreen ? '1rem' : '1.25rem'}>
            Ready to transform your business? Let’s talk.
          </Typography>
        </Box>
      </Box>

      {/* Contact Section */}
      <Box py={10} display="flex" justifyContent="center">
        <Box width="100%" maxWidth="1200px" px={isSmallScreen ? 2 : 4}>
          <Grid container spacing={8}>
            {/* Left - Contact Info */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography variant="h5" fontWeight="bold" mb={4}>
                    Get in Touch
                  </Typography>

                  {/* Location */}
                  <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                    <FiMapPin size={24} style={{ color: '#333', marginTop: 4 }} />
                    <Box>
                      <Typography fontWeight="bold">Our Office (Raleigh, NC)</Typography>
                      <Typography color="text.secondary">
                        Nimitech IT, Raleigh, NC 27601, USA
                      </Typography>
                    </Box>
                  </Box>

                  {/* Phone */}
                  <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                    <FiPhone size={24} style={{ color: '#333', marginTop: 4 }} />
                    <Box>
                      <Typography fontWeight="bold">Phone</Typography>
                      <Typography color="text.secondary">+1 252-903-9651</Typography>
                    </Box>
                  </Box>

                  {/* Email */}
                  <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                    <FiMail size={24} style={{ color: '#333', marginTop: 4 }} />
                    <Box>
                      <Typography fontWeight="bold">Email</Typography>
                      <Typography color="text.secondary">
                        <a href="mailto:info@nimitechit.com">info@nimitechit.com</a>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Office Hours */}
                  <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                    <FiClock size={24} style={{ color: '#333', marginTop: 4 }} />
                    <Box>
                      <Typography fontWeight="bold">Office Hours</Typography>
                      <Typography color="text.secondary">
                        Mon–Fri: 9:00 AM – 6:00 PM EST
                        <br />
                        Sat & Sun: Closed
                      </Typography>
                    </Box>
                  </Box>

                  {/* Social Media */}
                  <Divider sx={{ my: 4 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Connect with Us
                  </Typography>
                  <Box display="flex" gap={3} mt={1}>
                    <a
                      href="https://twitter.com/nimitech"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X"
                    >
                      <XIcon />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <InstagramIcon />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <FacebookIcon />
                    </a>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                    >
                      <YouTubeIcon />
                    </a>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            {/* Right - Contact Form */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Send Us a Message
                  </Typography>
                  <Typography color="text.secondary" mb={3}>
                    Have a question about our services? Fill out the form below and we’ll get back
                    to you within one business day.
                  </Typography>

                  <form noValidate autoComplete="off">
                    <TextField fullWidth label="Your Name" variant="outlined" margin="normal" />
                    <TextField fullWidth label="Your Email" variant="outlined" margin="normal" />
                    <TextField fullWidth label="Subject" variant="outlined" margin="normal" />
                    <TextField
                      fullWidth
                      label="Message"
                      variant="outlined"
                      multiline
                      rows={5}
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        mt: 2,
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        backgroundColor: '#9b07ad',
                        borderRadius: 2,
                        textTransform: 'none',
                      }}
                    >
                      Send Message
                    </Button>
                  </form>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactUs;
