import { Box, Button, Grid, Link, Typography, useMediaQuery } from '@mui/material';
import Fade from '@mui/material/Fade';
import { lazy } from 'react';
import donationImage1 from '../../assets/blog/images/donationImage1.jpg';
import donationImage2 from '../../assets/blog/images/donationImage2.jpg';
import { businessImages } from '../../assets/images';
import styles from '../blog/blog.module.scss';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const Services = () => {
  const isBelow1100 = useMediaQuery('(max-width:1100px)');
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  const listStyle = {
    fontSize: '1rem',
    lineHeight: '2',
    marginLeft: 20,
    marginBottom: 30,
    fontFamily: 'Montserrat, sans-serif',
    color: '#333',
    listStyle: 'none',
    padding: isSmallScreen
      ? '0 20px 20px 20px'
      : isMediumScreen
        ? '0 60px 60px 60px'
        : '0 60px 60px 60px',
  };

  const renderList = (items) => (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: '#fafafa',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
        mt: 2,
        mb: 4,
        mx: isSmallScreen ? 2 : 8,
      }}
    >
      <ul
        style={{
          fontSize: '1rem',
          lineHeight: '2',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontFamily: 'Montserrat, sans-serif',
        }}
        className="text-order"
      >
        {items.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', color: '#333' }}>
            <span style={{ marginRight: '8px', lineHeight: '1.6' }}>✔</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Box>
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" height={isSmallScreen ? 500 : 500} overflow="hidden">
        <video
          src="/videos/nimiVid.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bgcolor="rgba(0,0,0,0.4)"
        />
        <Box
          position="absolute"
          top="60%"
          left="40%"
          sx={{
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            px: 1,
            textAlign: isSmallScreen ? 'normal' : 'left',
          }}
        >
          <Typography
            variant={isSmallScreen ? 'h4' : 'h2'}
            fontWeight="bold"
            sx={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Explore Our Expert Services
          </Typography>
          <Typography
            mt={2}
            fontSize={isSmallScreen ? '1rem' : '1.25rem'}
            sx={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            From marketing and security to AI and custom development — tailored solutions to help
            your business thrive.
          </Typography>
        </Box>
      </Box>

      {/* Why Choose Us */}
      <Box py={8} px={isSmallScreen ? 0 : 0} bgcolor="#f9f9f9">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant="h4"
                  style={{ fontWeight: '600', fontFamily: 'Montserrat, sans-serif' }}
                  px={isSmallScreen ? 2 : 8}
                  gutterBottom
                  className="text-order"
                >
                  Our Comprehensive Services | Nimitech IT
                </Typography>
                <Typography
                  lineHeight={1.7}
                  mb={4}
                  px={isSmallScreen ? 2 : 8}
                  color="textSecondary"
                  className="text-order"
                  sx={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  At Nimitech IT, we offer end to end technology and marketing solutions designed to
                  help your business thrive. From building bespoke software and securing your
                  infrastructure to driving growth through digital marketing and crafting standout
                  brand experiences, our expert team delivers scalable, affordable services you own
                  outright—no subscriptions, no surprises.
                </Typography>

                {/* Custom Software */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    fontSize="1rem"
                    color="textSecondary"
                    className="text-order"
                    sx={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic' }}
                    px={isSmallScreen ? 2 : 8}
                  >
                    <strong style={{ fontSize: '2rem', color: '#2e0135', fontStyle: 'normal' }}>
                      Custom Software & Web Development
                    </strong>
                    <br />
                    Craft powerful, user friendly applications that streamline workflows and boost
                    productivity:
                  </Typography>
                  {renderList([
                    'ERP & CRM Platforms for unified resource and customer management',
                    'Workflow Automation Apps to eliminate manual tasks',
                    'Responsive Web & Mobile Apps built with modern frameworks',
                    'One Time Development—full ownership, zero recurring fees',
                  ])}
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.WD_image1}
                        alt="Services Visual"
                        width="100%"
                        borderRadius={isSmallScreen ? 0 : 2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>

                {/* Digital Marketing */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mt={2}
                    fontSize="1rem"
                    color="textSecondary"
                    className="text-order"
                    fontFamily="Montserrat, sans-serif"
                    sx={{ fontStyle: 'italic' }}
                    px={isSmallScreen ? 2 : 8}
                  >
                    <strong style={{ fontSize: '2rem', color: '#2e0135', fontStyle: 'normal' }}>
                      Digital Marketing
                    </strong>
                    <br />
                    Accelerate online growth with data driven campaigns that convert:
                  </Typography>
                  {renderList([
                    'SEO & Content Strategy to boost organic search rankings',
                    'PPC & Targeted Advertising on Google, Facebook, LinkedIn',
                    'Social Media Management for consistent brand engagement',
                    'Email Marketing & Automation to nurture leads and retain customers',
                    'Analytics & Reporting with clear ROI metrics',
                  ])}
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.DM_image}
                        alt="Services Visual"
                        width="100%"
                        borderRadius={isSmallScreen ? 0 : 2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>

                {/* Cybersecurity */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mt={2}
                    fontSize="1rem"
                    color="textSecondary"
                    className="text-order"
                    sx={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic' }}
                    px={isSmallScreen ? 2 : 8}
                  >
                    <strong style={{ fontSize: '2rem', color: '#2e0135', fontStyle: 'normal' }}>
                      Cybersecurity Solutions
                    </strong>
                    <br />
                    Protect your data and maintain business continuity with enterprise grade
                    security:
                  </Typography>
                  {renderList([
                    '24/7 Threat Detection & Monitoring',
                    'Vulnerability Assessments & Pen Testing',
                    'Network Security (firewalls, VPNs, intrusion prevention)',
                    'Compliance & Risk Management (HIPAA, PCI, GDPR)',
                    'Incident Response & Recovery',
                  ])}
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.CS_image2}
                        alt="Services Visual"
                        width="100%"
                        borderRadius={isSmallScreen ? 0 : 2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>

                {/* AI & Machine Learning */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mt={6}
                    fontSize="1rem"
                    color="textSecondary"
                    className="text-order"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic' }}
                    px={isSmallScreen ? 2 : 8}
                  >
                    <strong style={{ fontSize: '2rem', color: '#2e0135', fontStyle: 'normal' }}>
                      AI & Machine Learning
                    </strong>
                    <br />
                    Turn raw data into actionable insights and automate complex processes:
                  </Typography>
                  {renderList([
                    'Custom ML Model Development (classification, regression, deep learning)',
                    'Predictive Analytics & Data Visualization',
                    'Computer Vision & NLP for image, video, and text automation',
                    'Seamless Integration with your existing systems and cloud platforms',
                  ])}
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.AI_image1}
                        alt="AI & ML"
                        width="100%"
                        borderRadius={isSmallScreen ? 0 : 2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>

                {/* Graphic Design & Branding */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mt={6}
                    fontSize="1rem"
                    color="textSecondary"
                    className="text-order"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic' }}
                    px={isSmallScreen ? 2 : 8}
                  >
                    <strong style={{ fontSize: '2rem', color: '#2e0135', fontStyle: 'normal' }}>
                      Graphic Design & Branding
                    </strong>
                    <br />
                    Create a memorable visual identity that resonates with your audience:
                  </Typography>
                  {renderList([
                    'Logo & Brand Identity Development',
                    'Brand Style Guides & Templates for consistency',
                    'Marketing Collateral (business cards, brochures, digital graphics)',
                    'Social Media Graphics & Ad Creatives',
                    'Fast Turnaround & Competitive Pricing',
                  ])}
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.branding2}
                        alt="Graphic Design"
                        width="100%"
                        borderRadius={isSmallScreen ? 0 : 2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>

                {/* Cloud Infrastructure */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mt={6}
                    fontSize="1rem"
                    color="textSecondary"
                    className="text-order"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic' }}
                    px={isSmallScreen ? 2 : 8}
                  >
                    <strong style={{ fontSize: '2rem', color: '#2e0135', fontStyle: 'normal' }}>
                      Cloud Infrastructure & Solutions
                    </strong>
                    <br />
                    Scale efficiently with secure, cost-effective cloud services:
                  </Typography>
                  {renderList([
                    'Cloud Migration & Management (AWS, Azure, Google Cloud)',
                    'Infrastructure as Code for automated, repeatable deployments',
                    'Backup & Disaster Recovery to protect critical data',
                    'Cost Optimization to maximize your IT budget',
                  ])}
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.cloud2}
                        alt="Cloud Infrastructure"
                        width="100%"
                        borderRadius={isSmallScreen ? 0 : 2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>

                {/* Remote IT Support */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mt={6}
                    fontSize="1rem"
                    color="textSecondary"
                    className="text-order"
                    style={{ fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic' }}
                    px={isSmallScreen ? 2 : 8}
                  >
                    <strong style={{ fontSize: '2rem', color: '#2e0135', fontStyle: 'normal' }}>
                      Remote IT Support & Help Desk
                    </strong>
                    <br />
                    Keep your operations running smoothly with expert assistance:
                  </Typography>
                  {renderList([
                    'Remote Troubleshooting for software, networks, and devices',
                    '24/7 Help Desk via phone, email, and chat',
                    'Certified Technicians skilled in Windows, macOS, Linux, and more',
                    'Service Level Agreements guaranteeing timely response',
                  ])}
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.IT_image}
                        alt="IT Support"
                        width="100%"
                        borderRadius={isSmallScreen ? 0 : 2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>

                <div
                  className="text-order"
                  style={{ fontFamily: 'Montserrat, sans-serif', padding: '40px' }}
                >
                  <Typography
                    lineHeight={1.7}
                    mb={4}
                    mt={6}
                    fontSize="1.2rem"
                    fontFamily="Montserrat, sans-serif"
                  >
                    Ready to Elevate Your Business? Partner with Nimitech IT for fully managed
                    technology and marketing solutions that deliver measurable results.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fontFamily="Montserrat, sans-serif"
                  >
                    <Link href="/contact-us" sx={{ color: '#fff' }}>
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </Box>
            </Fade>
          </Grid>
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

export default Services;
