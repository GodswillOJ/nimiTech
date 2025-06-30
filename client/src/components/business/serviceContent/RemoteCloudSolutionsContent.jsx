import { Button, Link, Typography } from '@mui/material';
import { businessImages } from '../../../assets/images';
import './services.css';

const RemoteCloudSolutionsContent = () => {
  return (
    <div className="services_block" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Hero Section with Overlay */}
      <div className="image-with-overlay">
        <img src={businessImages.CLD} alt="Cloud Solutions Hero" />
        <div className="overlay-text">
          <h3>Next-Gen Cloud Power</h3>
          <p>Scalable, secure, and remote — just like your future</p>
        </div>
      </div>

      {/* Cloud Intro */}
      <div
        className="marketing-intro"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(46,1,53,0.7)), url(${businessImages.hero4})`,
        }}
      >
        <h1>Remote Cloud Solutions for the Modern Enterprise</h1>
        <p>
          Unlock seamless cloud infrastructure migration, monitoring, and optimization with
          Nimitech. We bring the agility of AWS, the scale of Azure, and the intelligence of Google
          Cloud—right to your fingertips.
        </p>
      </div>

      {/* Key Features Block */}
      <div className="dm-flex-block">
        <div className="dm-image-container">
          <img src={businessImages.Cloud_comp} alt="Cloud Architecture" />
        </div>
        <div className="dm-text-content">
          <p className="dm-title">Why Choose Nimitech Cloud?</p>
          <ul className="dm-fancy-list">
            <li>Multi-cloud expertise: AWS, Azure, Google Cloud</li>
            <li>Secure, scalable, and cost-optimized architecture</li>
            <li>Expert migration, backup, and recovery services</li>
            <li>Remote monitoring, automation, and cloud governance</li>
            <li>Seamless integration with your existing systems</li>
          </ul>
          <p className="dm-cta">
            Gain cloud control without losing sleep. Let Nimitech take care of it.
          </p>
        </div>
      </div>

      {/* Services Offered */}
      <div className="ai-services-flex-container">
        <div className="ai-services-text">
          <p className="section-title">Our Cloud Services Include:</p>
          <ul className="dm-fancy-list">
            <li>Cloud Migration & Architecture Design</li>
            <li>Cost Optimization & Resource Management</li>
            <li>Disaster Recovery & Data Resilience</li>
            <li>Remote DevOps & Infrastructure Automation</li>
            <li>Cloud Compliance (SOC 2, ISO 27001, HIPAA)</li>
            <li>Global Deployment & Scaling Strategies</li>
          </ul>
          <p className="ai-services-summary">
            Our approach goes beyond uptime — we align your cloud operations with your long-term
            business growth.
          </p>
        </div>
        <div className="ai-services-image-container">
          <div className="zoom-wrapper">
            <img src={businessImages.cloud7} alt="Cloud Infrastructure Visual" />
          </div>
        </div>
      </div>

      {/* Final CTA with MUI */}
      <div className="text-content" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p className="dm-title">Ready to Elevate Your Cloud Strategy?</p>
        <Typography
          lineHeight={1.8}
          fontSize={'1.2rem'}
          fontWeight={500}
          sx={{
            fontFamily: 'Montserrat, sans-serif',
            color: '#1f2937',
            maxWidth: '700px',
            margin: '0 auto 20px',
          }}
        >
          Partner with Nimitech IT for fully managed remote cloud solutions that drive performance,
          scale with ease, and simplify your tech operations.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          <Link href="/contact-us" style={{ color: '#fff', textDecoration: 'none' }}>
            Contact Us
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RemoteCloudSolutionsContent;
