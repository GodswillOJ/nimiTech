import { businessImages } from '../../../assets/images';
import './services.css'; // Shared CSS for styling

const BrandingContent = () => {
  return (
    <div
      className="services_block"
      style={{ fontFamily: 'Montserrat, sans-serif' }} // 👈 Apply Montserrat here
    >
      <p>
        Your brand is more than just a logo — it’s the face and personality of your business. At
        Nimitech IT, we specialize in creating professional, memorable logos and complete branding
        solutions that capture your unique identity and resonate with your target audience.
      </p>

      <div className="image-container">
        <img src={businessImages.RM_image} alt="Branding Visual" />
      </div>

      <div>
        <p style={{ fontSize: '20px' }}>Why Nimitech IT for Logo & Branding?</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Custom Logo Design: Our talented designers craft original logos that reflect your
            company’s values and vision.
          </li>
          <li>
            Comprehensive Branding: From color palettes and typography to brand guidelines, we build
            cohesive branding assets that ensure consistency across all channels.
          </li>
          <li>
            Brand Strategy: We help you define your brand’s voice, mission, and positioning to
            connect deeply with customers.
          </li>
          <li>
            Affordable & Professional: High-quality branding doesn’t have to break the bank — we
            deliver expert design services at competitive prices.
          </li>
          <li>
            Fast Turnaround: Get your custom logo and branding assets efficiently without
            compromising quality.
          </li>
        </ul>
      </div>

      <div className="image-container">
        <img src={businessImages.branding2} alt="Branding Visual" />
      </div>

      <div>
        <p style={{ fontSize: '20px' }}>Our Branding Services Include:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Logo Design & Refresh</li>
          <li>Brand Identity Development</li>
          <li>Brand Style Guides & Templates</li>
          <li>Business Cards, Letterheads & Marketing Collateral</li>
          <li>Social Media Branding</li>
          <li>And Much More</li>
        </ul>
      </div>

      <p className="font-medium text-gray-900">
        Elevate your business presence with Nimitech IT’s logo and branding services — where
        creativity meets strategy.
      </p>
    </div>
  );
};

export default BrandingContent;
