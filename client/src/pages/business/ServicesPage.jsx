import { lazy } from 'react';
import { useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowRightCircle } from 'lucide-react';

import donationImage1 from '../../assets/blog/images/donationImage1.webp';
import donationImage2 from '../../assets/blog/images/donationImage2.webp';
import { businessImages } from '../../assets/images';
import styles from '../blog/blog.module.scss';

const GradientCard = lazy(() => import('../../components/blog/GradientCard/GradientCard'));
const DonateSection = lazy(() => import('../../components/blog/DonateSection/DonateSection'));

const Services = () => {
  const isSmallScreen = useMediaQuery('(max-width:768px)');

  const renderServiceCard = (section, index, isFullWidth = false) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      style={{
        width: isFullWidth ? '100%' : isSmallScreen ? '100%' : '100%',
        margin: isSmallScreen ? '20px 0' : '20px 0',
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : index % 2 === 0 ? 'row' : 'row-reverse',
        gap: '0',
        alignItems: 'stretch',
        backgroundColor: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        fontFamily: 'Montserrat, sans-serif',
        minHeight: isSmallScreen ? 'auto' : '400px',
      }}
    >
      {/* Image with animated floating effect and gradient blend into text area */}
      <motion.div
        style={{
          flex: isSmallScreen ? 'none' : 1,
          position: 'relative',
          width: isSmallScreen ? '100%' : '50%',
          minHeight: isSmallScreen ? '250px' : '100%',
          overflow: 'hidden',
          height: '100%',
        }}
        animate={{
          y: [0, -1.5, 0, 1.5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <img
          src={section.image}
          alt={section.alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            position: 'relative', // changed from absolute
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
            background:
              index === 0 && isFullWidth && !isSmallScreen
                ? 'linear-gradient(to right, rgba(0,0,0,0.03) 60%, #fff 100%)'
                : isSmallScreen
                  ? 'linear-gradient(to bottom, rgba(0,0,0,0.15) 60%, #fff 100%)'
                  : index % 2 === 0
                    ? 'linear-gradient(to right, rgba(0,0,0,0.15) 60%, #fff 100%)'
                    : 'linear-gradient(to left, rgba(0,0,0,0.15) 60%, #fff 100%)',
          }}
        />
      </motion.div>

      {/* Text */}
      <div
        style={{
          flex: 1,
          width: isSmallScreen ? '100%' : '50%',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: '#111',
        }}
      >
        <h3
          style={{
            fontSize: '1.3rem',
            marginBottom: '12px',
            color: '#5c2b93', // Themed color
            letterSpacing: '0.5px',
            fontWeight: 700,
          }}
        >
          {section.title}
        </h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
          {section.items.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              style={{
                marginBottom: '12px',
                lineHeight: 1.6,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                color: '#222',
                fontWeight: 500,
              }}
            >
              <ArrowRightCircle
                size={18}
                color="#5c2b93"
                style={{
                  marginRight: 14,
                  flexShrink: 0,
                  filter: 'drop-shadow(0 0 6px #5c2b93a0)',
                }}
              />
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );

  const services = [
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
  ];

  return (
    <div style={{ backgroundColor: '#f9f9f9' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: isSmallScreen ? 600 : 700, overflow: 'hidden' }}>
        <video
          src="/videos/nimiVid.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', marginTop: '6rem' }}
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#fff',
            textAlign: 'center',
            padding: '0 16px',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          <h2 style={{ fontSize: isSmallScreen ? '2rem' : '3rem', marginBottom: '1rem' }}>
            Explore Our Expert Services
          </h2>
          <p style={{ fontSize: isSmallScreen ? '1rem' : '1.25rem' }}>
            From marketing and security to AI and development — tailored solutions to help your
            business grow.
          </p>
        </div>
      </div>

      {/* Services Cards */}
      <div
        style={{
          margin: '50px auto',
          padding: isSmallScreen ? '0 16px' : '0 24px',
          maxWidth: '1800px',
        }}
      >
        {/* Row 1: 2 Services */}
        <div
          style={{
            display: isSmallScreen ? 'block' : 'flex',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          {renderServiceCard(services[1], 1)}
          {renderServiceCard(services[2], 2)}
        </div>

        {/* Row 2: 1 Service (Full Width) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div style={{ width: isSmallScreen ? '100%' : '100%' }}>
            {renderServiceCard(services[0], 0, true)}
          </div>
        </div>

        {/* Row 3: 2 Services */}
        <div
          style={{
            display: isSmallScreen ? 'block' : 'flex',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          {renderServiceCard(services[5], 5)}
          {renderServiceCard(services[3], 3)}
        </div>

        {/* Row 4: 2 Services */}
        <div
          style={{
            display: isSmallScreen ? 'block' : 'flex',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          {renderServiceCard(services[4], 4)}
          {renderServiceCard(services[6], 6)}
        </div>
      </div>

      {/* Donation Section */}
      <section className={styles.donation}>
        <GradientCard imageSrc={donationImage2} imagePosition="left" />
        <DonateSection
          images={[donationImage1, donationImage2, donationImage1]}
          onDonateClick={() => window.open('https://www.example.com/donate', '_blank')}
        />
      </section>
    </div>
  );
};

export default Services;
