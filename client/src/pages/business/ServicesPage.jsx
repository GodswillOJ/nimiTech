import { Box, Button, Link, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { lazy } from 'react';

import donationImage1 from '../../assets/blog/images/donationImage1.jpg';
import donationImage2 from '../../assets/blog/images/donationImage2.jpg';
import { businessImages } from '../../assets/images';
import styles from '../blog/blog.module.scss';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const Services = () => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');

  const listItemVariants = {
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

  const renderList = (items) => (
    <Box
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #0f1c48, #5c2b93)',
        borderRadius: 4,
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)',
        mt: 3,
        mb: 4,
      }}
    >
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            custom={idx}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={listItemVariants}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              color: '#ffffff',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              marginBottom: '1rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            <Box
              sx={{
                minWidth: '10px',
                height: '10px',
                backgroundColor: '#90caf9', // light accent blue
                borderRadius: '50%',
                mr: 2,
                mt: '8px',
                boxShadow: '0 0 6px rgba(144, 202, 249, 0.6)',
              }}
            />
            <Typography component="span">{item}</Typography>
          </motion.li>
        ))}
      </ul>
    </Box>
  );

  return (
    <Box sx={{ fontFamily: 'Montserrat, sans-serif', backgroundColor: '#f9f9f9' }}>
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
          left="50%"
          sx={{
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            px: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant={isSmallScreen ? 'h4' : 'h2'} fontWeight="bold">
            Explore Our Expert Services
          </Typography>
          <Typography mt={2} fontSize={isSmallScreen ? '1rem' : '1.25rem'}>
            From marketing and security to AI and development — tailored solutions to help your
            business grow.
          </Typography>
        </Box>
      </Box>

      {/* Services Section */}
      <Box py={8} px={isSmallScreen ? 2 : 6}>
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
          <Box
            key={index}
            sx={{
              backgroundColor: '#fff',
              borderRadius: 6,
              p: isSmallScreen ? 2 : 4,
              mb: 6,
              boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            }}
          >
            <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
              {section.title}
            </Typography>

            {renderList(section.items)}

            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
                mt: 3,
              }}
            >
              <img
                src={section.image}
                alt={section.alt}
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'inherit' }}
              />
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                sx={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.7))',
                  color: '#fc07fb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    background: 'rgba(255,255,255,0.1)',
                    px: 6,
                    py: 4,
                    borderRadius: 2,
                    backdropFilter: 'blur(4px)',
                    fontSize: isSmallScreen ? '1rem' : '1.25rem',
                  }}
                >
                  {section.title}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}

        {/* CTA Section */}
        <Box
          textAlign="center"
          sx={{
            background: 'linear-gradient(to right, #1976d2, #0d47a1)',
            color: '#fff',
            py: 6,
            px: isSmallScreen ? 2 : 6,
            borderRadius: 6,
            mt: 10,
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Ready to Elevate Your Business?
          </Typography>
          <Typography fontSize="1.1rem" mb={4}>
            Partner with Nimitech IT for scalable, future-ready tech solutions tailored to your
            goals.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: '#fff',
              color: '#1976d2',
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 10,
              fontSize: '1rem',
              '&:hover': { backgroundColor: '#e3f2fd' },
            }}
          >
            <Link href="/contact-us" style={{ color: 'inherit', textDecoration: 'none' }}>
              Contact Us
            </Link>
          </Button>
        </Box>
      </Box>

      {/* Donation Section */}
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

export default Services;
