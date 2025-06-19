import { Box, Button, Grid, Typography, useMediaQuery } from '@mui/material';
import Fade from '@mui/material/Fade';
import { lazy } from 'react';
import donationImage1 from '../../assets/blog/images/donationImage1.jpg';
import donationImage2 from '../../assets/blog/images/donationImage2.jpg';
import { businessImages } from '../../assets/images';
import styles from '../blog/blog.module.scss';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const servicesSummary = [
  {
    title: 'Digital Marketing',
    text: 'Boost your online presence with SEO, social media, and targeted campaigns that drive real results.',
    img: businessImages.hero2,
  },
  {
    title: 'Cybersecurity',
    text: 'Protect your data with tailored, affordable security solutions for all industries.',
    img: businessImages.hero3,
  },
  {
    title: 'AI & Machine Learning',
    text: 'Leverage AI/ML to automate processes, gain insights, and power smarter decisions.',
    img: businessImages.hero4,
  },
  {
    title: 'Custom Software & Web Development',
    text: 'Build scalable apps and websites tailored to your business—no subscriptions required.',
    img: businessImages.hero1,
  },
];

const Services = () => {
  const isBelow1100 = useMediaQuery('(max-width:1100px)');
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" height={isSmallScreen ? 400 : 500} overflow="hidden">
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
          <Typography variant={isSmallScreen ? 'h4' : 'h2'} fontWeight="bold">
            Explore Our Expert Services
          </Typography>
          <Typography mt={2} fontSize={isSmallScreen ? '1rem' : '1.25rem'}>
            From marketing and security to AI and custom development — tailored solutions to help
            your business thrive.
          </Typography>
        </Box>
      </Box>

      {/* Why Choose Us */}
      <Box py={8} px={isSmallScreen ? 0 : isMediumScreen ? 8 : 20} bgcolor="#f9f9f9">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                <Typography variant="h4" gutterBottom className="text-order">
                  Our Comprehensive Services | Nimitech IT
                </Typography>
                <Typography lineHeight={1.7} mb={4} color="textSecondary" className="text-order">
                  At Nimitech IT, we offer end to end technology and marketing solutions designed to
                  help your business thrive. From building bespoke software and securing your
                  infrastructure to driving growth through digital marketing and crafting standout
                  brand experiences, our expert team delivers scalable, affordable services you own
                  outright—no subscriptions, no surprises.
                </Typography>
                {/* Web Dev */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mb={4}
                    fontSize={'1.2rem'}
                    color="textSecondary"
                    className="text-order"
                  >
                    <strong style={{ fontSize: '2rem' }}>Custom Software & Web Development</strong>
                    <br />
                    Craft powerful, user friendly applications that streamline workflows and boost
                    productivity:
                  </Typography>
                  <ul
                    style={{
                      fontSize: '1.2rem',
                      lineHeight: '2',
                      marginLeft: 20,
                      marginBottom: 30,
                      color: '#555',
                    }}
                    className="text-order"
                  >
                    <li>ERP & CRM Platforms for unified resource and customer management</li>
                    <li>Workflow Automation Apps to eliminate manual tasks</li>
                    <li>Responsive Web & Mobile Apps built with modern frameworks</li>
                    <li>One Time Development—full ownership, zero recurring fees</li>
                  </ul>
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.hero3}
                        alt="Services Visual"
                        width="100%"
                        borderRadius={2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>
                {/* Digital Marketing */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mb={4}
                    mt={2}
                    fontSize={'1.2rem'}
                    color="textSecondary"
                    className="text-order"
                  >
                    <strong style={{ fontSize: '2rem' }}>Digital Marketing</strong>
                    <br />
                    Accelerate online growth with data driven campaigns that convert:
                  </Typography>
                  <ul
                    style={{
                      fontSize: '1.2rem',
                      lineHeight: '2',
                      marginLeft: 20,
                      marginBottom: 30,
                      color: '#555',
                    }}
                    className="text-order"
                  >
                    <li>SEO & Content Strategy to boost organic search rankings</li>
                    <li>PPC & Targeted Advertising on Google, Facebook, LinkedIn</li>
                    <li>Social Media Management for consistent brand engagement</li>
                    <li>Email Marketing & Automation to nurture leads and retain customers</li>
                    <li>Analytics & Reporting with clear ROI metrics</li>
                  </ul>
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.hero3}
                        alt="Services Visual"
                        width="100%"
                        borderRadius={2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>
                {/* CYBER SECURITY */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mb={4}
                    mt={2}
                    fontSize={'1.2rem'}
                    color="textSecondary"
                    className="text-order"
                  >
                    <strong style={{ fontSize: '2rem' }}>Cybersecurity Solutions</strong>
                    <br />
                    Protect your data and maintain business continuity with enterprise grade
                    security:
                  </Typography>
                  <ul
                    style={{
                      fontSize: '1.2rem',
                      lineHeight: '2',
                      marginLeft: 20,
                      marginBottom: 30,
                      color: '#555',
                    }}
                    className="text-order"
                  >
                    <li>24/7 Threat Detection & Monitoring</li>
                    <li>Vulnerability Assessments & Pen Testing</li>
                    <li>Network Security (firewalls, VPNs, intrusion prevention)</li>
                    <li>Compliance & Risk Management (HIPAA, PCI, GDPR)</li>
                    <li>Incident Response & Recovery</li>
                  </ul>
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.hero3}
                        alt="Services Visual"
                        width="100%"
                        borderRadius={2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>
                {/* AI & Machine Learning */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mb={4}
                    mt={6}
                    fontSize={'1.2rem'}
                    color="textSecondary"
                    className="text-order"
                  >
                    <strong style={{ fontSize: '2rem' }}>AI & Machine Learning</strong>
                    <br />
                    Turn raw data into actionable insights and automate complex processes:
                  </Typography>
                  <ul
                    style={{
                      fontSize: '1.2rem',
                      lineHeight: '2',
                      marginLeft: 20,
                      marginBottom: 30,
                      color: '#555',
                    }}
                    className="text-order"
                  >
                    <li>Custom ML Model Development (classification, regression, deep learning)</li>
                    <li>Predictive Analytics & Data Visualization</li>
                    <li>Computer Vision & NLP for image, video, and text automation</li>
                    <li>Seamless Integration with your existing systems and cloud platforms</li>
                  </ul>
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.heroBackImage6} // replace with correct image
                        alt="AI & ML"
                        width="100%"
                        borderRadius={2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>

                {/* Graphic Design & Branding */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mb={4}
                    mt={6}
                    fontSize={'1.2rem'}
                    color="textSecondary"
                    className="text-order"
                  >
                    <strong style={{ fontSize: '2rem' }}>Graphic Design & Branding</strong>
                    <br />
                    Create a memorable visual identity that resonates with your audience:
                  </Typography>
                  <ul
                    style={{
                      fontSize: '1.2rem',
                      lineHeight: '2',
                      marginLeft: 20,
                      marginBottom: 30,
                      color: '#555',
                    }}
                    className="text-order"
                  >
                    <li>Logo & Brand Identity Development</li>
                    <li>Brand Style Guides & Templates for consistency</li>
                    <li>Marketing Collateral (business cards, brochures, digital graphics)</li>
                    <li>Social Media Graphics & Ad Creatives</li>
                    <li>Fast Turnaround & Competitive Pricing</li>
                  </ul>
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.heroBackImage3} // replace with correct image
                        alt="Graphic Design"
                        width="100%"
                        borderRadius={2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>

                {/* Cloud Infrastructure & Solutions */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mb={4}
                    mt={6}
                    fontSize={'1.2rem'}
                    color="textSecondary"
                    className="text-order"
                  >
                    <strong style={{ fontSize: '2rem' }}>Cloud Infrastructure & Solutions</strong>
                    <br />
                    Scale efficiently with secure, cost-effective cloud services:
                  </Typography>
                  <ul
                    style={{
                      fontSize: '1.2rem',
                      lineHeight: '2',
                      marginLeft: 20,
                      marginBottom: 30,
                      color: '#555',
                    }}
                    className="text-order"
                  >
                    <li>Cloud Migration & Management (AWS, Azure, Google Cloud)</li>
                    <li>Infrastructure as Code for automated, repeatable deployments</li>
                    <li>Backup & Disaster Recovery to protect critical data</li>
                    <li>Cost Optimization to maximize your IT budget</li>
                  </ul>
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.heroBackImage1} // replace with correct image
                        alt="Cloud Infrastructure"
                        width="100%"
                        borderRadius={2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>

                {/* Remote IT Support & Help Desk */}
                <div>
                  <Typography
                    lineHeight={1.7}
                    mb={4}
                    mt={6}
                    fontSize={'1.2rem'}
                    color="textSecondary"
                    className="text-order"
                  >
                    <strong style={{ fontSize: '2rem' }}>Remote IT Support & Help Desk</strong>
                    <br />
                    Keep your operations running smoothly with expert assistance:
                  </Typography>
                  <ul
                    style={{
                      fontSize: '1.2rem',
                      lineHeight: '2',
                      marginLeft: 20,
                      marginBottom: 30,
                      color: '#555',
                    }}
                    className="text-order"
                  >
                    <li>Remote Troubleshooting for software, networks, and devices</li>
                    <li>24/7 Help Desk via phone, email, and chat</li>
                    <li>Certified Technicians skilled in Windows, macOS, Linux, and more</li>
                    <li>Service Level Agreements guaranteeing timely response</li>
                  </ul>
                  <Grid item xs={12} md={6}>
                    <Fade in timeout={1500}>
                      <Box
                        component="img"
                        src={businessImages.heroBackImage3} // replace with correct image
                        alt="IT Support"
                        width="100%"
                        borderRadius={2}
                        boxShadow={3}
                      />
                    </Fade>
                  </Grid>
                </div>
                <div className="text-order">
                  <Typography lineHeight={1.7} mb={4} mt={6} fontSize={'1.2rem'}>
                    Ready to Elevate Your Business? Partner with Nimitech IT for fully managed
                    technology and marketing solutions that deliver measurable results.
                  </Typography>
                  <Button variant="contained" color="primary" size="large">
                    Contact Us
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
