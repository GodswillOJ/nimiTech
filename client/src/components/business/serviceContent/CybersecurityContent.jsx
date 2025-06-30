import { businessImages } from '../../../assets/images';
import './services.css';

const CybersecurityContent = () => {
  return (
    <div className="services_block" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Hero Image with Overlay */}
      <div className="image-with-overlay">
        <img src={businessImages.CS_image1} alt="Cybersecurity Hero" />
        <div className="overlay-text">
          <h3>Cybersecurity, Redefined</h3>
          <p>Real-time defense for your digital world</p>
        </div>
      </div>

      {/* Main Intro */}
      <div
        className="marketing-intro"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(46,1,53,0.7)), url(${businessImages.CS_image2})`,
        }}
      >
        <h1>Stay Secure with Nimitech IT Cybersecurity Services</h1>
        <p>
          Proactive, enterprise-grade cybersecurity tailored for businesses of all sizes. Let us
          protect your data and systems so you can grow with confidence.
        </p>
      </div>

      {/* Why It Matters */}
      <div className="dm-flex-block">
        <div className="dm-image-container">
          <img src={businessImages.Cysec} alt="Threats Overview" />
        </div>
        <div className="dm-text-content">
          <p className="dm-title">Why Cybersecurity Matters</p>
          <ul className="dm-fancy-list">
            <li>Rise of ransomware, phishing, and data breaches threatens all industries</li>
            <li>Legal consequences and reputation loss from non-compliance</li>
            <li>Financial devastation from downtime and recovery</li>
            <li>Increased need for proactive, round-the-clock protection</li>
          </ul>
          <p className="dm-cta">Don’t wait for an incident — take control with Nimitech IT.</p>
        </div>
      </div>

      {/* Cybersecurity Offerings */}
      <div className="ai-services-flex-container">
        <div className="ai-services-text">
          <p className="section-title">Our Cybersecurity Services</p>
          <ul className="dm-fancy-list">
            <li>Real-Time Threat Detection & Monitoring</li>
            <li>Network Security (Firewalls, VPNs, IPS)</li>
            <li>Compliance Support (HIPAA, PCI, GDPR)</li>
            <li>Endpoint Protection for all devices</li>
            <li>Vulnerability Scanning & Penetration Testing</li>
            <li>Incident Response & Recovery Planning</li>
          </ul>
          <p className="ai-services-summary">
            We blend strategy, automation, and expert knowledge to ensure you’re not just
            protected—but ahead of threats.
          </p>
        </div>
        <div className="ai-services-image-container">
          <div className="zoom-wrapper" style={{ height: '400px' }}>
            <img src={businessImages.CBSC} alt="Cybersecurity Defense" />
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="dm-flex-block">
        <div className="dm-image-container">
          <img src={businessImages.Access_denied} alt="Certified Security Team" />
        </div>
        <div className="dm-text-content">
          <p className="dm-title">Why Choose Nimitech IT?</p>
          <ul className="dm-fancy-list">
            <li>Proven expertise across healthcare, finance, and enterprise</li>
            <li>24/7 monitoring and rapid incident response</li>
            <li>Affordable, scalable protection for any budget</li>
            <li>Team of certified cybersecurity specialists</li>
          </ul>
          <p className="dm-cta">
            Let’s build your digital fortress. Secure your business with Nimitech.
          </p>
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="text-content" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p className="dm-title">Take the First Step Toward Security</p>
        <p className="font-medium text-gray-900">
          Your business deserves more than antivirus software. Protect your operations with a
          comprehensive cybersecurity strategy designed for today’s threats.
        </p>
        <a href="/contact-us" className="contact-button" style={{ marginTop: '20px' }}>
          Talk to Our Security Team
        </a>
      </div>
    </div>
  );
};

export default CybersecurityContent;
