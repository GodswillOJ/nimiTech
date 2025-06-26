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
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const isMediumScreen = useMediaQuery('(max-width:900px)');

  const listStyle = {
    fontSize: '1rem',
    lineHeight: '2',
    fontFamily: 'Montserrat, sans-serif',
    color: '#333',
    listStyle: 'none',
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
      <ul style={{ ...listStyle, margin: 0, padding: 0 }} className="text-order">
        {items.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ marginRight: '8px', lineHeight: '1.6' }}>✔</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Box>
  );

  return (
    <Box>
      <style>{`
        @keyframes subtleZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .zoom-container {
          overflow: hidden;
          border-radius: 12px;
        }
        .zoom-img {
          animation: subtleZoom 15s ease-in-out infinite;
          width: 100%;
          height: auto;
          display: block;
          transform-origin: center center;
        }
      `}</style>

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

      {/* Services Section */}
      <Box py={8} px={isSmallScreen ? 0 : 0} bgcolor="#f9f9f9">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Fade in timeout={1000}>
              <Box>
                {/* Repeat Service Blocks Below */}
                {[
                  {
                    title: 'Custom Software & Web Development',
                    items: [
                      'ERP & CRM Platforms for unified resource and customer management',
                      'Workflow Automation Apps to eliminate manual tasks',
                      'Responsive Web & Mobile Apps built with modern frameworks',
                      'One Time Development—full ownership, zero recurring fees',
                    ],
                    image: businessImages.WD_image1,
                    alt: 'Web Development',
                  },
                  {
                    title: 'Digital Marketing',
                    items: [
                      'SEO & Content Strategy to boost organic search rankings',
                      'PPC & Targeted Advertising on Google, Facebook, LinkedIn',
                      'Social Media Management for consistent brand engagement',
                      'Email Marketing & Automation to nurture leads and retain customers',
                      'Analytics & Reporting with clear ROI metrics',
                    ],
                    image: businessImages.DM_image,
                    alt: 'Digital Marketing',
                  },
                  {
                    title: 'Cybersecurity Solutions',
                    items: [
                      '24/7 Threat Detection & Monitoring',
                      'Vulnerability Assessments & Pen Testing',
                      'Network Security (firewalls, VPNs, intrusion prevention)',
                      'Compliance & Risk Management (HIPAA, PCI, GDPR)',
                      'Incident Response & Recovery',
                    ],
                    image: businessImages.CS_image2,
                    alt: 'Cybersecurity',
                  },
                  {
                    title: 'AI & Machine Learning',
                    items: [
                      'Custom ML Model Development (classification, regression, deep learning)',
                      'Predictive Analytics & Data Visualization',
                      'Computer Vision & NLP for image, video, and text automation',
                      'Seamless Integration with your existing systems and cloud platforms',
                    ],
                    image: businessImages.AI_image1,
                    alt: 'AI & ML',
                  },
                  {
                    title: 'Graphic Design & Branding',
                    items: [
                      'Logo & Brand Identity Development',
                      'Brand Style Guides & Templates for consistency',
                      'Marketing Collateral (business cards, brochures, digital graphics)',
                      'Social Media Graphics & Ad Creatives',
                      'Fast Turnaround & Competitive Pricing',
                    ],
                    image: businessImages.branding2,
                    alt: 'Branding',
                  },
                  {
                    title: 'Cloud Infrastructure & Solutions',
                    items: [
                      'Cloud Migration & Management (AWS, Azure, Google Cloud)',
                      'Infrastructure as Code for automated, repeatable deployments',
                      'Backup & Disaster Recovery to protect critical data',
                      'Cost Optimization to maximize your IT budget',
                    ],
                    image: businessImages.cloud2,
                    alt: 'Cloud',
                  },
                  {
                    title: 'Remote IT Support & Help Desk',
                    items: [
                      'Remote Troubleshooting for software, networks, and devices',
                      '24/7 Help Desk via phone, email, and chat',
                      'Certified Technicians skilled in Windows, macOS, Linux, and more',
                      'Service Level Agreements guaranteeing timely response',
                    ],
                    image: businessImages.IT_image,
                    alt: 'IT Support',
                  },
                ].map((section, index) => (
                  <Box key={index} borderRadius={isSmallScreen ? 0 : 2} mt={index > 0 ? 6 : 4}>
                    <Typography variant="h5" fontWeight="bold" px={4}>
                      {section.title}
                    </Typography>
                    {renderList(section.items)}
                    <Box
                      className="zoom-container"
                      boxShadow={3}
                      sx={{
                        mx: isSmallScreen ? 0 : 4,
                        width: '100%',
                      }}
                    >
                      <Box
                        component="img"
                        src={section.image}
                        alt={section.alt}
                        className="zoom-img"
                      />
                    </Box>
                  </Box>
                ))}

                {/* CTA Section */}
                <Box px={4} mt={6}>
                  <Typography fontSize="1.2rem" mb={2}>
                    Ready to Elevate Your Business? Partner with Nimitech IT for fully managed
                    technology and marketing solutions that deliver measurable results.
                  </Typography>
                  <Button variant="contained" margin="26px" color="primary" size="large">
                    <Link href="/contact-us" style={{ color: '#fff', textDecoration: 'none' }}>
                      Contact Us
                    </Link>
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Donation Section */}
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
