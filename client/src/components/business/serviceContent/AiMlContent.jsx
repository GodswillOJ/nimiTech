import { businessImages } from '../../../assets/images';

const AiMlContent = () => (
  <div
    className="services_block bg-white rounded-xl shadow-md p-6 space-y-4 text-gray-800 leading-relaxed"
    style={{ fontFamily: 'Montserrat, sans-serif' }} // 👈 Apply font here
  >
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

    <div className="ai-ml-flex-container">
      <div className="ai-image-container">
        <div className="zoom-wrapper">
          <img src={businessImages.AI_image5} alt="Software Development Visual" />
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
        <p className="title">Why Partner with Nimitech for AI & ML Solutions?</p>
        <ul className="benefits-list">
          <li>
            Tailored AI Solutions: From predictive analytics and natural language processing to
            image recognition and automation, we develop AI models customized for your industry and
            business needs.
          </li>
          <li>
            Data-Driven Decisions: Harness the power of your data with machine learning algorithms
            that identify patterns, forecast trends, and optimize operations.
          </li>
          <li>
            Automation at Scale: Reduce manual effort and human error with intelligent automation
            that boosts productivity and accuracy across workflows.
          </li>
          <li>
            Expert Team: Work with seasoned AI/ML engineers and data scientists skilled in Python,
            TensorFlow, PyTorch, and other leading technologies.
          </li>
          <li>
            Affordable Innovation: We provide cost-effective AI and ML services to businesses of all
            sizes, helping you stay competitive without breaking the bank.
          </li>
        </ul>
      </div>
    </div>

    <div className="ai-services-flex-container">
      <div className="ai-services-image-container">
        <div className="zoom-wrapper">
          <img src={businessImages.AI_image} alt="Software Development Visual" />
        </div>
      </div>
      <div className="ai-services-text">
        <p className="section-title">Our AI & ML Services Include:</p>
        <ul className="ai-services-list">
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
