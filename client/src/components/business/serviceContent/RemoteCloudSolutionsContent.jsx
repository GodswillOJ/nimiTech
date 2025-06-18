import React from 'react';
import { businessImages } from '../../../assets/images';
import './services.css'; // Shared CSS styles

const RemoteCloudSolutionsContent = () => {
  return (
    <div className="services_block">
      <p>
        <strong>
          Remote Cloud Solutions by Nimitech IT — Scale Your Business with Cloud Technology
        </strong>
        <br />
        Unlock the power of the cloud with Nimitech’s remote cloud solutions. We help businesses
        migrate, manage, and optimize cloud infrastructure securely and efficiently—boosting
        scalability, reducing costs, and enhancing collaboration.
      </p>

      <div className="image-container">
        <img src={businessImages.hero4} alt="Cloud Solutions Visual" />
      </div>

      <p>
        Whether it’s AWS, Azure, or Google Cloud, our expert team delivers seamless, customized
        cloud services to fit your needs—anytime, anywhere.
      </p>
    </div>
  );
};

export default RemoteCloudSolutionsContent;
