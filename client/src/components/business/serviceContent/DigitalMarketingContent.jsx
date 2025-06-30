import { businessImages } from '../../../assets/images';
import './services.css'; // 👈 Shared CSS

const DigitalMarketingContent = () => {
  return (
    <div
      className="services_block"
      style={{ fontFamily: 'Montserrat, sans-serif' }} // ✅ Apply Montserrat here
    >
      <div className="flex-content-section">
        {/* Textual Content */}
        <div className="text-content">
          <h2>Empowering Your Digital Presence</h2>
          <p>
            From SEO and content strategy to social media management and targeted advertising, we
            help you increase website traffic, boost customer engagement, and convert clicks into
            loyal customers. Our affordable, expert-led digital marketing solutions ensure your
            business reaches the right audience at the right time—maximizing your ROI.
          </p>
          <p className="slogan">*Nimitech IT — Your Innovation, Our Mission.*</p>
          <a href="/contact-us" className="contact-button">
            Contact Us
          </a>
        </div>

        {/* Image with Overlay Text */}
        <div className="image-with-overlay">
          <img src={businessImages.DM_image1} alt="Digital Marketing Visual" />
          <div className="overlay-text">
            <h3>Smart Marketing Solutions</h3>
            <p>Tailored strategies to grow your business</p>
          </div>
        </div>
      </div>

      <div className="marketing-intro">
        <h1>Accelerate Your Growth with Nimitech Digital Marketing</h1>
        <p>
          At Nimitech IT, we specialize in data-driven digital marketing services that accelerate
          your business growth. Whether you’re launching a new brand or scaling an existing one, our
          expert team crafts smart, results-focused campaigns tailored to your unique goals.
        </p>
      </div>

      <div className="dm-flex-block">
        <div className="dm-image-container">
          <img src={businessImages.DM_image2} alt="Digital Marketing Visual" />
        </div>
        <div className="dm-text-content">
          <p className="dm-title">Why Choose Nimitech Digital Marketing?</p>
          <ul className="dm-fancy-list">
            <li>Proven strategies backed by data and industry best practices</li>
            <li>Comprehensive services covering SEO, PPC, content marketing, and social media</li>
            <li>Transparent reporting and continuous optimization for sustained growth</li>
            <li>Dedicated experts focused on your business success</li>
          </ul>
          <p className="dm-cta">
            Dominate search engines. Drive real growth. Choose Nimitech Digital Marketing today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DigitalMarketingContent;
