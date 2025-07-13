import { businessImages } from '../../../assets/images';

const AiMlContent = () => (
  <div className="services_block" style={{ fontFamily: 'Montserrat, sans-serif' }}>
    {/* Hero Gradient Container */}
    <div className="ai-ml-container">
      <p className="ai-ml-content">
        At <span className="highlight-yellow">Nimitech IT</span>, we leverage the power of
        <span className="highlight-pink"> Artificial Intelligence (AI)</span> and
        <span className="highlight-blue"> Machine Learning (ML)</span> to help businesses unlock new
        levels of efficiency, insight, and innovation. Our AI and ML solutions are designed to
        automate complex processes, enhance decision-making, and deliver predictive insights that
        drive smarter strategies.
      </p>
    </div>

    {/* Section with Overlay Image + Text List */}
    <div className="ai-ml-flex-container">
      <div className="ai-image-container">
        <div className="zoom-wrapper">
          <img src={businessImages.AI_image5} alt="AI Empowerment" />
        </div>

        <div className="overlay-content">
          <div className="overlay-box">
            <h3 className="overlay-title">Empower Your Business with AI</h3>
            <p className="overlay-description">
              Automate smarter, predict better, and innovate faster with our custom AI & ML
              solutions.
            </p>
            <a href="/contact-us" className="overlay-link">
              Reach out to us →
            </a>
          </div>
        </div>
      </div>

      <div className="text-content">
        <p className="dm-title">Why Partner with Nimitech for AI & ML Solutions?</p>
        <ul className="dm-fancy-list">
          <li>
            Tailored AI Solutions: From predictive analytics and NLP to image recognition, we
            develop AI models customized for your unique business needs.
          </li>
          <li>
            Data-Driven Decisions: Machine learning algorithms that forecast trends and optimize
            operations.
          </li>
          <li>Automation at Scale: Reduce manual effort and error with intelligent automation.</li>
          <li>Expert Team: Engineers skilled in Python, TensorFlow, PyTorch, and more.</li>
          <li>Affordable Innovation: Cost-effective AI services tailored to all business sizes.</li>
        </ul>
      </div>
    </div>

    {/* Service Offerings Section */}
    <div className="ai-services-flex-container">
      <div className="ai-services-image-container">
        <div className="zoom-wrapper">
          <img src={businessImages.AI_image} alt="AI Services" />
        </div>
      </div>
      <div className="ai-services-text">
        <p className="section-title">Our AI & ML Services Include:</p>
        <ul className="dm-fancy-list">
          <li>Predictive Analytics & Forecasting</li>
          <li>Natural Language Processing (NLP) & Chatbots</li>
          <li>Computer Vision & Image Recognition</li>
          <li>Recommendation Engines</li>
          <li>Automated Data Processing & Workflow Automation</li>
          <li>Custom AI Model Development & Integration</li>
          <li>AI-Powered Business Intelligence Solutions</li>
        </ul>
        <p className="ai-services-summary">
          Transform your business with Nimitech’s AI and Machine Learning services—where advanced
          technology meets practical, affordable solutions.
        </p>
      </div>
    </div>
  </div>
);

export default AiMlContent;
