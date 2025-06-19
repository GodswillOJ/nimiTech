import React from 'react';
import { businessImages } from '../../../assets/images';
import './services.css'; // Shared CSS for styling

const BrandingContent = () => {
  return (
    <div className="services_block">
      <p>
        <strong>
          Nimitech IT Business Logo & Branding Services — Build a Brand That Stands Out
        </strong>
        <br />
        Your brand is more than just a logo — it’s the face and personality of your business. At
        Nimitech IT, we specialize in creating professional, memorable logos and complete branding
        solutions that capture your unique identity and resonate with your target audience.
      </p>

      <div className="image-container">
        <img src={businessImages.IT_image} alt="Branding Visual" />
      </div>

      <div>
        <p className="font-semibold">Why Nimitech IT for Logo & Branding?</p>
        <ul>
          <li>
            <strong>Custom Logo Design</strong>: Our talented designers craft original logos that
            reflect your company’s values and vision.
          </li>
          <li>
            <strong>Comprehensive Branding</strong>: From color palettes and typography to brand
            guidelines, we build cohesive branding assets that ensure consistency across all
            channels.
          </li>
          <li>
            <strong>Brand Strategy</strong>: We help you define your brand’s voice, mission, and
            positioning to connect deeply with customers.
          </li>
          <li>
            <strong>Affordable & Professional</strong>: High-quality branding doesn’t have to break
            the bank — we deliver expert design services at competitive prices.
          </li>
          <li>
            <strong>Fast Turnaround</strong>: Get your custom logo and branding assets efficiently
            without compromising quality.
          </li>
        </ul>
      </div>

      <div>
        <p className="font-semibold">Our Branding Services Include:</p>
        <ul>
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
