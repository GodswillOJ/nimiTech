import React from 'react';
import { businessImages } from '../../../assets/images';
import './services.css'; // 👈 shared styles

const CybersecurityContent = () => {
  return (
    <div className="services_block">
      <p>
        <strong>Comprehensive Cybersecurity Solutions Tailored for Your Industry</strong>
        <br />
        At Nimitech IT, we know that in today’s digital world, cybersecurity isn’t just an
        option—it’s a necessity. Whether you’re a healthcare organization, construction company,
        financial institution, or a small business, we provide customized, affordable cybersecurity
        services that safeguard your data, systems, and reputation against evolving cyber threats.
      </p>

      <div className="image-container">
        <img src={businessImages.CS_image} alt="Cybersecurity Visual" />
      </div>

      <div>
        <p className="font-semibold">Why Cybersecurity Matters</p>
        <p>
          Cyber attacks are becoming more frequent and sophisticated, putting businesses of all
          sizes at risk. From data breaches and ransomware to compliance violations, the
          consequences can be devastating—financial losses, legal penalties, and damage to your
          brand’s trust. Nimitech IT helps you stay one step ahead with proactive, enterprise-grade
          protection designed to keep your business safe 24/7.
        </p>
      </div>

      <div>
        <p className="font-semibold">Our Cybersecurity Services</p>
        <ul>
          <li>
            <strong>Real-Time Threat Detection & Monitoring</strong>: Identify and respond to
            threats instantly to minimize risk.
          </li>
          <li>
            <strong>Network Security</strong>: Secure your infrastructure with firewalls, VPNs, and
            intrusion prevention systems.
          </li>
          <li>
            <strong>Compliance & Risk Management</strong>: Navigate complex regulations like HIPAA,
            PCI, and GDPR with ease.
          </li>
          <li>
            <strong>Endpoint Protection</strong>: Safeguard all devices connected to your network,
            from laptops to mobile phones.
          </li>
          <li>
            <strong>Vulnerability Assessments & Penetration Testing</strong>: Identify and fix
            security gaps before attackers find them.
          </li>
          <li>
            <strong>Incident Response & Recovery</strong>: Rapid support to mitigate damage and
            restore operations after a breach.
          </li>
        </ul>
      </div>

      <div>
        <p className="font-semibold">Why Choose Nimitech IT?</p>
        <ul>
          <li>
            <strong>Industry Expertise</strong>: We’ve successfully served clients in healthcare,
            construction, finance, and small business sectors—tailoring solutions to fit your unique
            security challenges.
          </li>
          <li>
            <strong>Affordable & Scalable</strong>: Our global outsourcing model lets us offer
            top-tier cybersecurity at a fraction of traditional costs, making protection accessible
            for every budget.
          </li>
          <li>
            <strong>24/7 Support</strong>: Cyber threats never rest, and neither do we. Our
            dedicated team monitors your systems around the clock.
          </li>
          <li>
            <strong>Certified Professionals</strong>: Work with experienced, certified cybersecurity
            experts committed to your business’s safety.
          </li>
        </ul>
      </div>

      <p className="font-medium text-gray-900">
        Don’t Wait for a Breach — Secure Your Business Today.
        <br />
        Your data and your customers’ trust are your most valuable assets. Partner with Nimitech IT
        to implement a robust cybersecurity strategy that prevents attacks before they happen. Let
        us handle your IT security so you can focus on growing your business confidently and
        securely.
      </p>
    </div>
  );
};

export default CybersecurityContent;
