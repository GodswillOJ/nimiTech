import { Button, Typography } from '@mui/material';
import { businessImages } from '../../../assets/images';
import './services.css'; // Shared CSS styles

const RemoteCloudSolutionsContent = () => {
  return (
    <div
      className="services_block"
      style={{ fontFamily: 'Montserrat, sans-serif' }} // ✅ Apply Montserrat globally here
    >
      <p>
        Unlock the power of the cloud with Nimitech’s remote cloud solutions. We help businesses
        migrate, manage, and optimize cloud infrastructure securely and efficiently—boosting
        scalability, reducing costs, and enhancing collaboration. Whether it’s AWS, Azure, or Google
        Cloud, our expert team delivers seamless, customized cloud services to fit your
        needs—anytime, anywhere.
      </p>

      <div className="image-container">
        <img src={businessImages.cloud1} alt="Cloud Solutions Visual" />
      </div>

      <p>
        Efficiently migrate, manage, and optimize your cloud infrastructure with Nimitech’s remote
        cloud solutions. Expert support for AWS, Azure, Google Cloud, and more. Get scalable, secure
        cloud services today!
      </p>

      <div className="image-container">
        <img src={businessImages.hero4} alt="Cloud Solutions Visual" />
      </div>

      <p>
        Contact Nimitech now to start optimizing your cloud infrastructure with expert remote
        support tailored to your business needs.
      </p>

      <div className="text-order">
        <Typography
          lineHeight={1.7}
          mb={4}
          mt={6}
          fontSize={'1.2rem'}
          sx={{ fontFamily: 'Montserrat, sans-serif' }} // ✅ Font for Typography
        >
          Ready to Elevate Your Business? Partner with Nimitech IT for fully managed technology and
          marketing solutions that deliver measurable results.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ fontFamily: 'Montserrat, sans-serif' }} // ✅ Font for Button
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
};

export default RemoteCloudSolutionsContent;
