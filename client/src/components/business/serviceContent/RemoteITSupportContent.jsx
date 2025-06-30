import { businessImages } from '../../../assets/images';
import './services.css';

const RemoteITSupportContent = () => {
  return (
    <div
      className="services_block animate-glide-in"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Hero Image with Overlay */}
      <div className="image-with-overlay">
        <img src={businessImages.IT_image1} alt="Remote IT Hero" />
        <div className="overlay-text">
          <h3>Reliable Remote IT Support</h3>
          <p>Fast, expert help — right when you need it</p>
        </div>
      </div>

      {/* Intro Section */}
      <div
        className="marketing-intro"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(46,1,53,0.75)), url(${businessImages.hero1})`,
        }}
      >
        <h1>24/7 IT Support That Keeps You Running</h1>
        <p>
          Technology should simplify your business — not slow it down. Nimitech IT delivers remote
          support and around-the-clock help desk solutions tailored to meet the demands of modern
          businesses.
        </p>
      </div>

      {/* What We Offer */}
      <div className="dm-flex-block">
        <div className="dm-image-container">
          <img src={businessImages.IT_2} alt="IT Support Services" />
        </div>
        <div className="dm-text-content">
          <p className="dm-title">What We Offer</p>
          <ul className="dm-fancy-list">
            <li>Remote IT Support: Immediate troubleshooting from certified experts</li>
            <li>24/7 Help Desk: Always-on support for your employees</li>
            <li>System Monitoring & Maintenance</li>
            <li>Software Installations & Updates</li>
            <li>Secure Remote Access</li>
          </ul>
          <p className="dm-cta">
            Keep your systems running and your team productive with Nimitech IT.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="ai-services-flex-container">
        <div className="ai-services-text">
          <p className="section-title">Why Smart Businesses Choose Nimitech IT</p>
          <ul className="dm-fancy-list">
            <li>Certified, experienced IT professionals</li>
            <li>Fast response times & real-time issue resolution</li>
            <li>Affordable support with no long-term contracts</li>
            <li>Scalable service options for businesses of all sizes</li>
            <li>Secure remote access & expert troubleshooting</li>
          </ul>
          <p className="ai-services-summary">
            We don’t just fix problems — we prevent them. Trust Nimitech IT to support your growth.
          </p>
        </div>
        <div className="ai-services-image-container">
          <div className="zoom-wrapper">
            <img src={businessImages.HelpDesk2} alt="Remote IT Support Visual" />
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-content" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p className="dm-title">Stay Connected, Stay Supported</p>
        <p className="font-medium text-gray-900">
          From everyday technical issues to mission-critical response, Nimitech’s remote IT support
          ensures your business never skips a beat.
        </p>
        <a href="/contact-us" className="contact-button" style={{ marginTop: '20px' }}>
          Get Support Now
        </a>
      </div>
    </div>
  );
};

export default RemoteITSupportContent;
