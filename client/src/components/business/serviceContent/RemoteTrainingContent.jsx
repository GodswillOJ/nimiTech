import { businessImages } from '../../../assets/images';
import './services.css'; // Reused shared styles

const RemoteTrainingContent = () => {
  return (
    <div
      className="services_block animate-glide-in"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Hero Section with Overlay */}
      <div className="image-with-overlay">
        <img src={businessImages.online2} alt="Remote Training Hero" />
        <div className="overlay-text">
          <h3>Learn Today, Lead Tomorrow</h3>
          <p>Empowering digital minds through hands-on IT training</p>
        </div>
      </div>

      {/* Introduction Section */}
      <div
        className="marketing-intro"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(19, 0, 0, 0.85), rgb(35, 1, 40)), url(${businessImages.Training3})`,
        }}
      >
        <h1>Empower Your Future with Remote IT Training</h1>
        <p>
          At Nimitech, in collaboration with NimiTutor.com, we deliver cutting-edge remote IT
          training to individuals and businesses. Learn at your pace with expert-led, real-world
          focused content that builds your career from the ground up.
        </p>
      </div>

      {/* Training Highlights */}
      <div className="dm-flex-block">
        <div className="dm-image-container">
          <img src={businessImages.Training} alt="Remote Training Platform" />
        </div>
        <div className="dm-text-content">
          <p className="dm-title">What We Offer</p>
          <ul className="dm-fancy-list">
            <li>Cybersecurity: Learn to secure systems and data from threats</li>
            <li>AI & Machine Learning: Develop intelligent applications with real tools</li>
            <li>Coding: Learn Python, JavaScript, and more from scratch</li>
            <li>Business Analysis: Improve business operations and decision-making</li>
            <li>Data Analysis: Analyze and visualize data like a pro</li>
            <li>+ Cloud, IT Support, Project Management, Certification Prep & More</li>
          </ul>
          <p className="dm-cta">
            Wherever you are in your career — we help you level up with confidence.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="ai-services-flex-container">
        <div className="ai-services-text">
          <p className="section-title">Why Train with Nimitech & NimiTutor?</p>
          <ul className="dm-fancy-list">
            <li>Live & On-Demand Sessions — Learn on your schedule</li>
            <li>Industry-Certified Instructors — Learn from real experts</li>
            <li>Hands-On Labs — Apply skills in real-world environments</li>
            <li>Career-Focused Curriculum — Skills that employers demand</li>
            <li>Affordable & Accessible — Quality education without the price tag</li>
          </ul>
          <p className="ai-services-summary">
            Training that transforms — from the comfort of your device.
          </p>
        </div>
        <div className="ai-services-image-container">
          <div className="zoom-wrapper">
            <img src={businessImages.HelpDesk} alt="Live Virtual Training" />
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-content" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p className="dm-title">Start Learning. Start Leading.</p>
        <p className="font-medium text-gray-900">
          Gain the knowledge and confidence to build your future in tech. Join thousands who trust
          Nimitech & NimiTutor to transform their careers.
        </p>
        <a href="/contact-us" className="contact-button" style={{ marginTop: '20px' }}>
          Enroll Now
        </a>
      </div>
    </div>
  );
};

export default RemoteTrainingContent;
