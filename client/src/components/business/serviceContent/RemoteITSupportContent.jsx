import React from 'react';
import { businessImages } from '../../../assets/images';
import './services.css'; // 👈 import the CSS file

const RemoteITSupportContent = () => {
  return (
    <div className="services_block">
      <p>
        <strong>Reliable Remote IT Support & 24/7 Help Desk Services — Nimitech IT</strong>
        <br />
        Technology should simplify your business—not slow it down. At Nimitech IT, we deliver remote
        IT support and around-the-clock help desk services...
      </p>

      <div className="image-container">
        <img src={businessImages.IT_image} alt="Manager Section Visual" />
      </div>

      <div>
        <p className="font-semibold">What We Offer</p>
        <ul className="why-IT">
          <li>
            <strong>✔ Remote IT Support</strong>: Get immediate assistance...
          </li>
          <li>
            <strong>✔ 24/7 Help Desk Services</strong>: Our dedicated help desk team...
          </li>
        </ul>
      </div>

      <div>
        <p className="font-semibold">Why Smart Businesses Choose Nimitech IT</p>
        <ul>
          <li>Certified, Experienced IT Professionals</li>
          <li>Fast Response Times, 24/7 Availability</li>
          <li>Affordable, Scalable Support for Any Business Size</li>
          <li>No Long-Term Contracts or Subscription Fees</li>
          <li>Secure Remote Access & Reliable Troubleshooting</li>
        </ul>
      </div>

      <div className="image-container">
        <img src={businessImages.hero1} alt="Manager Section Visual" />
      </div>

      <p className="font-medium text-gray-900">
        From day-to-day technical support to urgent issue resolution, Nimitech IT keeps your
        business connected and protected—anytime, anywhere.
      </p>
    </div>
  );
};

export default RemoteITSupportContent;
