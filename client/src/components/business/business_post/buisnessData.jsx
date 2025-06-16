import { businessImages } from '../../../assets/images.js';

export const dummyBusinessPosts = [
  {
    id: 1,
    title: 'Boost Your Local Business with These 5 Tips',
    content: 'Learn how to attract more customers and grow your local business effectively...',
    image: businessImages.hero3,
  },
  {
    id: 2,
    title: 'Effective Marketing Strategies for Startups',
    content: 'Explore practical marketing tactics tailored for startup success...',
    image: businessImages.hero4,
  },
  {
    id: 3,
    title: 'Using AI to Improve Your Operations',
    content: 'Discover how AI solutions can streamline and enhance business efficiency...',
    image: businessImages.hero3,
  },
  {
    id: 4,
    title: 'Top Cybersecurity Practices for 2025',
    content: 'Learn key strategies to protect your digital infrastructure...',
    image: businessImages.hero4,
  },
];

export const services = [
  'Digital Marketing',
  'Custom Software Development',
  'Website Design & Development',
  'Artificial Intelligence (AI) & Machine Learning (ML)',
  'Cybersecurity Solutions',
  'Cloud Infrastructure & Solutions',
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
export const introSubtitle =
  'We offer a wide range of services best fit for your business projects.';
export const introText = `At Nimitech IT, we specialize in delivering affordable, expert IT service and support that helps your business operate smarter and more efficiently. We know that you want to reduce IT costs without sacrificing quality—and we make that possible by leveraging a global network of certified IT professionals. This allows us to offer world-class support, fast response times, and scalable solutions at a price that fits your budget.
From 24/7 technical support to customized IT strategies, we’re committed to keeping your systems secure, your data protected, and your business running without interruptions. Trusted by businesses of all sizes, Nimitech is your partner in reliable, cost-effective technology.
Get expert IT support—without the high cost. Choose Nimitech.
`;

// prettier fix
// npx prettier src/pages/business/home.js --write
// npx prettier src/pages/business/RegisterBusiness.jsx --write
// npx prettier src/components/business/business_post/buisnessData.jsx --write
