import React from 'react';
import { businessImages } from '../../../assets/images';
import './services.css'; // Reuse global styles

const SoftwareDevelopmentContent = () => {
  return (
    <div className="services_block">
      <p>
        <strong>Custom Software & Web Development to Optimize Your Business Workflow</strong>
        <br />
        At Nimitech IT, we specialize in building custom software and web solutions designed to
        streamline your business operations and boost productivity. From enterprise resource
        planning (ERP) systems, inventory management, CRM platforms, workflow optimization apps, and
        much more—we create powerful tools tailored to your unique needs, built from scratch, with
        no monthly or yearly subscription fees.
      </p>

      <p>
        Our expert developers combine the latest technologies to deliver secure, scalable, and
        user-friendly software that integrates seamlessly with your existing systems. Whether you
        need a custom website, mobile app, or comprehensive business management software, Nimitech
        IT offers affordable, one-time development solutions that help you save costs while gaining
        full control.
      </p>

      <div className="image-container">
        <img src={businessImages.ST_image} alt="Software Development Visual" />
      </div>

      <div>
        <p className="font-semibold">
          Why Trust Nimitech IT with Your Custom Software and Web Development Needs?
        </p>
        <ul>
          <li>
            <strong>Tailor-Made Apps</strong>: We build custom ERP, CRM, inventory systems, and much
            more, designed to optimize your workflow and business processes.
          </li>
          <li>
            <strong>No Subscription Required</strong>: Enjoy full ownership of your software with no
            hidden monthly or yearly fees.
          </li>
          <li>
            <strong>Experienced Developers</strong>: Skilled in modern languages and frameworks
            including React, Python, Java, .NET, and others.
          </li>
          <li>
            <strong>Mobile-Responsive & Scalable</strong>: Solutions built for seamless use on any
            device and growth-ready for the future.
          </li>
          <li>
            <strong>Transparent Pricing</strong>: Affordable, one-time development costs with clear
            communication every step of the way.
          </li>
        </ul>
      </div>

      <div>
        <p className="font-semibold">Our Development Services Include:</p>
        <ul>
          <li>Custom Web Applications & Websites</li>
          <li>Mobile App Development (iOS & Android)</li>
          <li>ERP & CRM Software Development</li>
          <li>Workflow & Inventory Management Systems</li>
          <li>API Integrations & Software Maintenance</li>
          <li>Software Modernization & Support</li>
          <li>And much more</li>
        </ul>
      </div>

      <p className="font-medium text-gray-900">
        Let Nimitech IT help you build the exact software your business needs to operate smarter,
        not harder—without recurring fees or subscriptions.
      </p>
    </div>
  );
};

export default SoftwareDevelopmentContent;
