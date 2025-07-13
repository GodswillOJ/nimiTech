import { businessImages } from '../../../assets/images';
import './services.css'; // Shared advanced styles

const BrandingContent = () => {
  return (
    <div className="services_block" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Hero Image with Overlay */}
      <div className="image-with-overlay">
        <img src={businessImages.Brand_pic} alt="Brand Identity Hero" />
        <div className="overlay-text">
          <h3>Build a Brand That Sticks</h3>
          <p>Designs that speak your business values</p>
        </div>
      </div>

      {/* Branding Intro Section */}
      <div
        className="marketing-intro"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(46,1,53,0.7)), url(${businessImages.branding__2})`,
        }}
      >
        <h1>Branding That Resonates</h1>
        <p>
          Your brand is more than just a logo — it’s your story, your presence, and your promise.
          Nimitech IT crafts professional branding systems that leave a lasting impression and build
          meaningful connections.
        </p>
      </div>

      {/* Why Branding Matters */}
      <div className="dm-flex-block">
        <div className="dm-image-container">
          <img src={businessImages.Brand_pic2} alt="Why Branding Matters" />
        </div>
        <div className="dm-text-content">
          <p className="dm-title">Why Nimitech IT for Logo & Branding?</p>
          <ul className="dm-fancy-list">
            <li>Custom Logo Design tailored to your mission</li>
            <li>Comprehensive brand assets from color to typography</li>
            <li>Strategic brand voice and positioning that connect</li>
            <li>Affordable and professional-grade execution</li>
            <li>Quick delivery without compromising quality</li>
          </ul>
          <p className="dm-cta">
            Let your brand tell your story. Choose Nimitech for a memorable identity.
          </p>
        </div>
      </div>

      {/* Services Offered */}
      <div className="ai-services-flex-container">
        <div className="ai-services-text">
          <p className="section-title">Our Branding Services Include:</p>
          <ul className="dm-fancy-list">
            <li>Logo Design & Refresh</li>
            <li>Brand Identity Development</li>
            <li>Style Guides & Visual Systems</li>
            <li>Letterheads, Cards & Marketing Materials</li>
            <li>Social Media Branding Kits</li>
            <li>And much more tailored for your industry</li>
          </ul>
          <p className="ai-services-summary">
            Every business deserves a brand that reflects its essence. We build yours from the
            ground up with strategy and creativity.
          </p>
        </div>
        <div className="ai-services-image-container">
          <div className="zoom-wrapper">
            <img src={businessImages.IT_image} alt="Branding Services Visual" />
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-content" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p className="dm-title">Elevate Your Identity Today</p>
        <p className="font-medium text-gray-900">
          Transform how customers see you. Build a bold, unforgettable brand with Nimitech IT.
        </p>
        <a href="/contact-us" className="contact-button" style={{ marginTop: '20px' }}>
          Get Started
        </a>
      </div>
    </div>
  );
};

export default BrandingContent;
