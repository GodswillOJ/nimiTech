import { LinkedIn, WhatsApp } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Link as MuiLink,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Fade from '@mui/material/Fade';
import { lazy, useState } from 'react';
import { FiClock, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import validator from 'validator';
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YouTubeIcon,
} from '../../assets/blog/icons/SocialIcons';
import donationImage1 from '../../assets/blog/images/donationImage1.jpg';
import donationImage2 from '../../assets/blog/images/donationImage2.jpg';
import { businessImages } from '../../assets/images';
import { useSendServiceInquiryMutation } from '../../services/api';
import styles from '../blog/blog.module.scss';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const ContactUs = () => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    consent: false,
  });
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const [sendServiceInquiry] = useSendServiceInquiryMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedData = {
      fullName: validator.trim(validator.escape(formData.fullName)),
      email: validator.normalizeEmail(formData.email || ''),
      phone: validator.trim(validator.escape(formData.phone)),
      service: validator.trim(validator.escape(formData.service)),
      message: validator.trim(validator.escape(formData.message)),
      consent: formData.consent,
    };

    // Basic validation
    if (
      !sanitizedData.fullName ||
      !sanitizedData.email ||
      !sanitizedData.phone ||
      !sanitizedData.service ||
      !sanitizedData.message ||
      !sanitizedData.consent
    ) {
      alert('Please complete all required fields and accept the consent.');
      return;
    }

    // Email format validation
    if (!validator.isEmail(sanitizedData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Phone number validation (basic)
    if (!validator.isMobilePhone(sanitizedData.phone, 'any')) {
      alert('Please enter a valid phone number.');
      return;
    }

    try {
      await sendServiceInquiry(sanitizedData).unwrap();
      alert('Inquiry sent successfully!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        consent: false,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to send. Please try again later.');
    }
  };

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
            <Box>
              <Typography
                variant="h4"
                style={{
                  paddingLeft: isSmallScreen ? '10px' : isMediumScreen ? '0' : '0',
                  paddingRight: isSmallScreen ? '10px' : isMediumScreen ? '0' : '0',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Contact Us | Nimitech IT – Your Technology Partner
              </Typography>
              {/* <Typography variant="h4">Our Mission & Objectives</Typography> */}
              <Typography
                mb={3}
                lineHeight={1.7}
                color="textSecondary"
                style={{
                  paddingLeft: isSmallScreen ? '10px' : isMediumScreen ? '0' : '0',
                  paddingRight: isSmallScreen ? '10px' : isMediumScreen ? '0' : '0',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Ready to transform your business? Contact Nimitech IT today and discover how our IT
                solutions, digital marketing, and design expertise can help you outperform the
                competition.
              </Typography>
            </Box>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Box
                  component="img"
                  src={businessImages.customer}
                  alt="Services Visual"
                  width="100%"
                  borderRadius={isSmallScreen ? 0 : 2}
                  boxShadow={3}
                />
              </Fade>
            </Grid>
            {/* Left - Contact Info */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={4}
                    sx={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Get in Touch
                  </Typography>

                  {/* Location */}
                  <Box display="flex" alignItems="flex-start" gap={2} mb={3}>
                    <FiMapPin size={24} style={{ color: '#333', marginTop: 4 }} />
                    <Box sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <Typography fontWeight="bold">Our Office (Raleigh, NC)</Typography>
                      <Typography color="text.secondary">
                        8024 Glenwood Ave, Suite 305, Raleigh, North Carolina 27612
                      </Typography>
                    </Box>
                  </Box>

                  {/* Phone */}
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    gap={2}
                    mb={3}
                    sx={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <FiPhone size={24} style={{ color: '#333', marginTop: 4 }} />
                    <Box>
                      <Typography fontWeight="bold">Phone</Typography>
                      <Typography color="text.secondary">
                        <a
                          href="tel:+12529039651"
                          className="phone-link"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'underline',
                            transition: 'color 0.3s ease',
                          }}
                        >
                          +1 (252) 903-9651
                        </a>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Email */}
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    gap={2}
                    mb={3}
                    sx={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <FiMail size={24} style={{ color: '#333', marginTop: 4 }} />
                    <Box>
                      <Typography fontWeight="bold">Email</Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <a
                          href="mailto:info@nimitechit.com"
                          style={{
                            color: '#3b1647',
                            textDecoration: 'underline',
                            fontWeight: 500,
                            transition: 'color 0.3s ease',
                          }}
                        >
                          info@nimitechit.com
                        </a>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Office Hours */}
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    gap={2}
                    mb={3}
                    sx={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
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
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontFamily: 'Montserrat, sans-serif' }}
                    gutterBottom
                  >
                    Connect with Us
                  </Typography>
                  <Box display="flex" gap={3} mt={1}>
                    <a
                      href="https://x.com/nimi_techIT'"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="X"
                    >
                      <XIcon />
                    </a>
                    <a
                      href="https://instagram.com/nimi.techit/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <InstagramIcon />
                    </a>
                    <a
                      href="https://www.facebook.com/profile.php?id=61577287182430"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <FacebookIcon />
                    </a>
                    <a
                      href="https://www.youtube.com/@NimiTechITConsultantsLLC-IT"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                    >
                      <YouTubeIcon />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/nimi-tech-consultants-llc/?viewAsMember=true"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                    >
                      <LinkedIn />
                    </a>
                    <a
                      href="https://wa.me/12529039651"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                    >
                      <WhatsApp style={{ color: '#1bcc2a' }} />
                    </a>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            {/* Right - Contact Form */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      mb={3}
                      sx={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Schedule a free consultation
                    </Typography>
                    <Typography
                      color="text.secondary"
                      mb={3}
                      sx={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Have a question about our services? Fill out the form below and we’ll get back
                      to you within one business day.
                    </Typography>

                    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                      <TextField
                        fullWidth
                        label="Your Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required
                      />
                      <TextField
                        fullWidth
                        label="Your Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required
                      />
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required
                      />
                      <TextField
                        fullWidth
                        label="Service you are inquiring about"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                        required
                      />
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={5}
                        margin="normal"
                        required
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            name="consent"
                            checked={formData.consent}
                            onChange={handleChange}
                            required
                          />
                        }
                        label={
                          <Typography variant="body2" fontFamily="Montserrat, sans-serif">
                            By checking this box, you agree to be contacted by Nimitech IT using the
                            information provided in this form. Your information will be used in
                            accordance with our{' '}
                            <MuiLink
                              href={`/privacy-policy?from=${encodeURIComponent(location.pathname)}`}
                              target="_blank"
                              rel="noopener"
                              sx={{ color: '#3b1647', textDecoration: 'underline' }}
                            >
                              Privacy Policy
                            </MuiLink>
                            . You may opt out at any time.
                          </Typography>
                        }
                        sx={{ alignItems: 'flex-start', mt: 1 }}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          mt: 3,
                          px: 4,
                          py: 1.5,
                          fontWeight: 'bold',
                          backgroundColor: '#9b07ad',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontFamily: 'Montserrat, sans-serif',
                          '&:hover': {
                            backgroundColor: '#7c0691',
                          },
                        }}
                      >
                        Submit
                      </Button>
                    </form>
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <section className={styles.donation}>
        <GradientCard imageSrc={donationImage2} imagePosition="left" />
        <DonateSection
          images={[donationImage1, donationImage2, donationImage1]}
          onDonateClick={() => window.open('https://www.example.com/donate', '_blank')}
        />
      </section>
    </Box>
  );
};

export default ContactUs;
