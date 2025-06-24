import { businessImages } from '../../../assets/images';

const AiMlContent = () => (
  <div
    className="services_block bg-white rounded-xl shadow-md p-6 space-y-4 text-gray-800 leading-relaxed"
    style={{ fontFamily: 'Montserrat, sans-serif' }} // 👈 Apply font here
  >
    <p>
      At Nimitech IT, we leverage the power of Artificial Intelligence (AI) and Machine Learning
      (ML) to help businesses unlock new levels of efficiency, insight, and innovation. Our AI and
      ML solutions are designed to automate complex processes, enhance decision-making, and deliver
      predictive insights that drive smarter strategies.
    </p>

    <div>
      <p className="mb-1" style={{ fontSize: '20px' }}>
        Why Partner with Nimitech for AI & ML Solutions?
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li>
          Tailored AI Solutions: From predictive analytics and natural language processing to image
          recognition and automation, we develop AI models customized for your industry and business
          needs.
        </li>
        <li>
          Data-Driven Decisions: Harness the power of your data with machine learning algorithms
          that identify patterns, forecast trends, and optimize operations.
        </li>
        <li>
          Automation at Scale: Reduce manual effort and human error with intelligent automation that
          boosts productivity and accuracy across workflows.
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

    <div className="image-container">
      <img src={businessImages.AI_image4} alt="Software Development Visual" />
    </div>

    <div>
      <p className="mb-1" style={{ fontSize: '20px' }}>
        Our AI & ML Services Include:
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li>Predictive Analytics & Forecasting</li>
        <li>Natural Language Processing (NLP) & Chatbots</li>
        <li>Computer Vision & Image Recognition</li>
        <li>Recommendation Engines</li>
        <li>Automated Data Processing & Workflow Automation</li>
        <li>Custom AI Model Development & Integration</li>
        <li>AI-Powered Business Intelligence Solutions</li>
      </ul>
    </div>

    <p className="font-medium text-gray-900">
      Transform your business with Nimitech’s AI and Machine Learning services—where advanced
      technology meets practical, affordable solutions.
    </p>

    <div className="image-container">
      <img src={businessImages.AI_image} alt="Software Development Visual" />
    </div>
  </div>
);

export default AiMlContent;
