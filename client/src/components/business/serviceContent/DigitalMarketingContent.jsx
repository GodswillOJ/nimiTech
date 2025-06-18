import React from 'react';
import { businessImages } from '../../../assets/images';
import './services.css'; // 👈 Same CSS as RemoteITSupportContent

const DigitalMarketingContent = () => {
  return (
    <div className="services_block">
      <p>
        At Nimitech IT, we specialize in data-driven digital marketing services that accelerate your
        business growth. Whether you’re launching a new brand or scaling an existing one, our expert
        team crafts smart, results-focused campaigns tailored to your unique goals.
      </p>

      <p>
        From SEO and content strategy to social media management and targeted advertising, we help
        you increase website traffic, boost customer engagement, and convert clicks into loyal
        customers. Our affordable, expert-led digital marketing solutions ensure your business
        reaches the right audience at the right time—maximizing your ROI.
      </p>

      <div className="image-container">
        <img src={businessImages.DM_image} alt="Digital Marketing Visual" />
      </div>

      <div>
        <p className="font-semibold">Why Choose Nimitech Digital Marketing?</p>
        <ul>
          <li>Proven strategies backed by data and industry best practices</li>
          <li>Comprehensive services covering SEO, PPC, content marketing, and social media</li>
          <li>Transparent reporting and continuous optimization for sustained growth</li>
          <li>Dedicated experts focused on your business success</li>
        </ul>
      </div>

      <p className="font-medium text-gray-900">
        Dominate search engines. Drive real growth. Choose Nimitech Digital Marketing today.
      </p>
    </div>
  );
};

export default DigitalMarketingContent;
