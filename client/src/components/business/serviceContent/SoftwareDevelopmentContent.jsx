import { businessImages } from '../../../assets/images';
import './services.css'; // Shared advanced styles

const SoftwareDevelopmentContent = () => {
  return (
    <div
      className="services_block animate-glide-in"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Hero Image with Overlay */}
      <div className="image-with-overlay">
        <img src={businessImages.ST_image1} alt="Custom Software Hero" />
        <div className="overlay-text">
          <h3>Smart Software for Smarter Businesses</h3>
          <p>Build once. Own forever. No subscriptions.</p>
        </div>
      </div>

      {/* Intro with Branding */}
      <div
        className="marketing-intro"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(46,1,53,0.75)), url(${businessImages.WD_image})`,
        }}
      >
        <h1>Custom Software & Web Solutions</h1>
        <p>
          Nimitech IT builds powerful, affordable business software—from ERP and CRM to mobile and
          web apps—with no monthly fees. Total ownership. Total control.
        </p>
      </div>

      {/* Why Choose Us */}
      <div className="dm-flex-block">
        <div className="dm-image-container">
          <img src={businessImages.Developers} alt="Software Integration Visual" />
        </div>
        <div className="dm-text-content">
          <p className="dm-title">Why Trust Nimitech IT?</p>
          <ul className="dm-fancy-list">
            <li>Tailor-made ERP, CRM, inventory systems, and workflow apps</li>
            <li>No subscriptions — you own the software outright</li>
            <li>Expert developers in React, Python, .NET, Java, and more</li>
            <li>Mobile-responsive and scalable for growth</li>
            <li>Transparent, one-time pricing with full support</li>
          </ul>
          <p className="dm-cta">
            Build solutions as unique as your business—without recurring costs.
          </p>
        </div>
      </div>

      {/* What We Build */}
      <div className="ai-services-flex-container">
        <div className="ai-services-text">
          <p className="section-title">Our Development Services Include:</p>
          <ul className="dm-fancy-list">
            <li>Custom Web Applications & Websites</li>
            <li>Mobile App Development (iOS & Android)</li>
            <li>ERP & CRM Software Development</li>
            <li>Workflow & Inventory Management Systems</li>
            <li>API Integrations & Backend Architecture</li>
            <li>Software Modernization & Long-Term Support</li>
          </ul>
          <p className="ai-services-summary">
            We build secure, scalable, and user-friendly tools that adapt to your business — not the
            other way around.
          </p>
        </div>
        <div className="ai-services-image-container">
          <div className="zoom-wrapper">
            <img src={businessImages.Developers2} alt="Software Showcase Visual" />
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-content" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p className="dm-title">Own Your Software. Control Your Future.</p>
        <p className="font-medium text-gray-900">
          Get fully customized software built to your needs — one-time payment, full source code,
          and no hidden fees.
        </p>
        <a href="/contact-us" className="contact-button" style={{ marginTop: '20px' }}>
          Let&#39;s Build Together
        </a>
      </div>
    </div>
  );
};

export default SoftwareDevelopmentContent;
