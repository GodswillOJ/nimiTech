import { businessImages } from '../../../assets/images.js';
import AiMlContent from '../serviceContent/AiMlContent';
import BrandingContent from '../serviceContent/BrandingContent';
import CybersecurityContent from '../serviceContent/CybersecurityContent';
import DigitalMarketingContent from '../serviceContent/DigitalMarketingContent.jsx';
import RemoteCloudSolutionsContent from '../serviceContent/RemoteCloudSolutionsContent';
import RemoteITSupportContent from '../serviceContent/RemoteITSupportContent';
import RemoteTrainingContent from '../serviceContent/RemoteTrainingContent';
import SoftwareDevelopmentContent from '../serviceContent/SoftwareDevelopmentContent';

export const dummyBusinessPosts = [
  {
    id: 1,
    title: 'Digital Marketing Services to Grow Your Business',
    content: <DigitalMarketingContent />,
    image: businessImages.DM_image,
  },
  {
    id: 2,
    title: 'Nimitech IT Cybersecurity Services — Protect What Matters Most',
    content: <CybersecurityContent />,
    image: businessImages.CS_image,
  },
  {
    id: 3,
    title: 'Custom Software & Website Development to Optimize Your Business Workflow',
    content: <SoftwareDevelopmentContent />,
    image: businessImages.ST_image,
  },
  {
    id: 4,
    title: 'Transform Your Business with Intelligent Automation',
    content: <AiMlContent />,
    image: businessImages.AI_image,
  },
  {
    id: 5,
    title: 'Nimitech IT Business Logo & Branding Services — Build a Brand That Stands Out',
    content: <BrandingContent />,
    image: businessImages.IT_image,
  },
  {
    id: 6,
    title: 'Reliable Remote IT Support & 24/7 Help Desk Services — Nimitech IT',
    content: <RemoteITSupportContent />,
    image: businessImages.IT_image, // one left
  },
  {
    id: 7,
    title: 'Remote IT Training — Powered by NimiTutor.com',
    content: <RemoteTrainingContent />,
    image: businessImages.RM_image,
  },
  {
    id: 7,
    title: 'Remote Cloud Solutions by Nimitech IT — Scale Your Business with Cloud Technology',
    content: <RemoteCloudSolutionsContent />,
    image: businessImages.hero4,
  },
];

export const services = [
  'Results-Driven Digital Marketing Services',
  'Tailored Software Development Solutions',
  'Professional Website Design & Development',
  'AI & Machine Learning Solutions for Business Growth',
  'Advanced Cybersecurity Services & Risk Protection',
  'Scalable Cloud Infrastructure & IT Solutions',
  'Remote IT Support & Helpdesk',
  'Graphic Design – Logos, Branding & Identity',
];

export const courses = [
  'Frontend & Backend Web Development',
  'Python Programming & Automation',
  'Cloud Engineering (AWS, Azure, GCP)',
  'DevOps & CI/CD Pipelines',
  'Data Analysis & Visualization (Excel, Python, Power BI)',
  'Machine Learning & AI with Python',
  'Cybersecurity & Ethical Hacking',
  'Database Management (SQL, PostgreSQL)',
  'Remote IT Career Readiness Training',
];

export const ceoMessage = [
  "Welcome to Nimitech IT. We're dedicated to delivering expert IT solutions and digital marketing services that help your business grow, stay secure, and boost brand awareness. From cybersecurity to cloud computing and custom software, our affordable, tailored services are designed to drive real results.",
  "Thank you for trusting Nimitech IT as your partner in technology and growth. Together, we'll unlock new opportunities and keep your business ahead of the curve.",
  `"Busay Bright\nCEO, Nimitech IT"`,
];

export const introTitle = 'From the CEO';
export const introSubtitle = 'We Offer a Wide Range of Services Tailored to Your Business Needs.';
export const introText = `At Nimitech IT, we specialize in delivering affordable, expert IT service and support that helps your business operate smarter and more efficiently. We know that you want to reduce IT costs without sacrificing quality—and we make that possible by leveraging a global network of certified IT professionals. This allows us to offer world-class support, fast response times, and scalable solutions at a price that fits your budget.
From 24/7 technical support to customized IT strategies, we’re committed to keeping your systems secure, your data protected, and your business running without interruptions. Trusted by businesses of all sizes, Nimitech is your partner in reliable, cost-effective technology.
Get expert IT support—without the high cost. Choose Nimitech.
`;

// prettier fix
// npx prettier src/pages/business/home.js --write
// npx prettier src/pages/business/ServicesPage.jsx --write
// npx prettier src/pages/business/AboutPage.jsx --write
// npx prettier src/pages/business/RegisterBusiness.jsx --write
// npx prettier src/pages/business/RegisterBusiness.jsx --write
// npx prettier src/components/navbar.jsx --write
// npx prettier src/components/business/landing_page/BusinessItem.js --write
// npx prettier src/components/business/landing_page/buisnessItem.js -- write
// npx prettier src/components/business/business_post/buisnessData.jsx --write
// npx prettier src/components/business/serviceContent/BrandingContent.jsx --write
// npx prettier src/components/business/serviceContent/RemoteTrainingContent.jsx --write
// npx prettier src/components/business/serviceContent/RemoteITSupportContent.jsx --write
// npx prettier src/components/business/serviceContent/RemoteCloudSolutionsContent.jsx --write
// npx prettier src/components/business/serviceContent/AiMlContent.jsx --write
// npx prettier src/pages/business/ServicesPage.jsx --write
// npx prettier src/pages/business/AboutPage.jsx --write
