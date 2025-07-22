const KnowledgeBase = require("../models/KnowledgeBase");

const knowledgeBaseEntries = [
  {
    title: "Company Overview",
    content:
      "NimiTech IT LLC is a leading technology consulting firm specializing in digital transformation, software development, and business solutions. We help businesses leverage technology to improve efficiency, reduce costs, and drive growth. Our company is based in the United States and serves clients globally with cutting-edge technology solutions.",
    category: "company",
    tags: ["company", "overview", "technology", "consulting", "digital transformation"],
    priority: 10,
  },
  {
    title: "Contact Information & Location",
    content:
      "NimiTech IT LLC is located in the United States. You can reach us through multiple channels: Website contact form at nimitechit.com/contact-us, WhatsApp at +1 (252) 903-9651, or schedule a consultation call. We respond to all inquiries within 24 hours during business days. Our team provides 24/7 support via phone, email, and chat for existing clients.",
    category: "contact",
    tags: ["contact", "phone", "whatsapp", "consultation", "location", "support"],
    priority: 10,
  },
  {
    title: "Social Media Presence",
    content:
      "Follow NimiTech IT LLC on all major social media platforms: Instagram @nimi.techit (https://instagram.com/nimi.techit/), Facebook (https://www.facebook.com/profile.php?id=61577287182430), LinkedIn (https://www.linkedin.com/company/nimi-tech-consultants-llc/), YouTube (@NimiTechITConsultantsLLC-IT), and X (formerly Twitter). Stay updated with our latest insights, company news, and technology trends.",
    category: "social",
    tags: ["social media", "instagram", "facebook", "linkedin", "youtube", "twitter", "updates"],
    priority: 8,
  },
  {
    title: "Software Development Services",
    content:
      "Our software development services include: Custom Web Applications, Mobile App Development (iOS & Android), Enterprise Software Solutions, API Development & Integration, Database Design & Management, Cloud-Native Applications, E-commerce Platforms, and Software Modernization. We use cutting-edge technologies and follow best practices for scalable, secure solutions.",
    category: "services",
    tags: ["software development", "web applications", "mobile apps", "enterprise", "api", "cloud"],
    priority: 9,
  },
  {
    title: "Digital Marketing & SEO Services",
    content:
      "Our digital marketing services include: Search Engine Optimization (SEO), Pay-Per-Click (PPC) advertising on Google, Facebook, and LinkedIn, Social Media Marketing & Management, Email Marketing & Automation to nurture leads and retain customers, Content Marketing Strategy, Brand Development, and Analytics & Performance Tracking.",
    category: "services",
    tags: ["digital marketing", "seo", "ppc", "social media", "email marketing", "branding"],
    priority: 9,
  },
  {
    title: "Business Consulting & Strategy",
    content:
      "We provide comprehensive business consulting services including: Digital Transformation Strategy, Process Optimization & Automation, Technology Integration Planning, Business Intelligence & Data Analytics, Workflow Automation, Custom Software Development Strategy, and IT Infrastructure Planning. Our consultants help businesses leverage technology for competitive advantage.",
    category: "services",
    tags: ["business consulting", "strategy", "digital transformation", "process optimization", "automation"],
    priority: 9,
  },
  {
    title: "Cloud Solutions & Infrastructure",
    content:
      "Our cloud services include: Cloud Migration & Strategy, AWS, Azure, and Google Cloud Platform expertise, Cloud Security & Compliance, Infrastructure as Code (IaC), DevOps & CI/CD Pipeline Setup, Cloud Cost Optimization, Backup & Disaster Recovery Solutions, and Hybrid Cloud Architecture. We help businesses move to the cloud safely and efficiently.",
    category: "services",
    tags: ["cloud solutions", "aws", "azure", "google cloud", "migration", "devops", "security"],
    priority: 9,
  },
  {
    title: "IT Support & Managed Services",
    content:
      "We offer comprehensive IT support including: 24/7 Help Desk via phone, email, and chat, Network Monitoring & Management, Cybersecurity Solutions, System Maintenance & Updates, Data Backup & Recovery, Hardware & Software Procurement, Remote IT Support, and Proactive System Monitoring. Our managed services ensure your technology runs smoothly.",
    category: "services",
    tags: ["it support", "managed services", "help desk", "cybersecurity", "monitoring", "backup"],
    priority: 8,
  },
  {
    title: "Career Opportunities",
    content:
      "NimiTech IT LLC offers exciting career opportunities in technology consulting, software development, digital marketing, and business consulting. We hire for various positions including Software Engineers, Digital Marketing Specialists, Business Analysts, Cloud Architects, and IT Consultants. Check our careers page for current openings and application details.",
    category: "careers",
    tags: ["careers", "jobs", "hiring", "software engineer", "digital marketing", "consulting"],
    priority: 7,
  },
  {
    title: "Blog and Resources",
    content:
      "NimiTech maintains an active blog with insights on technology trends, business strategies, and industry best practices. Our blog covers topics like digital transformation, cloud computing, software development, cybersecurity, and business optimization. We also provide free resources, whitepapers, and case studies. Visit our blog regularly for valuable content and industry insights.",
    category: "resources",
    tags: ["blog", "resources", "insights", "trends", "whitepapers", "case studies"],
    priority: 7,
  },
  {
    title: "Getting Started",
    content:
      "To get started with NimiTech, you can schedule a free consultation where we discuss your needs and how we can help. During this consultation, we assess your requirements and propose the best solutions for your business.",
    category: "onboarding",
    tags: ["getting started", "consultation", "onboarding", "assessment"],
    priority: 9,
  },
  {
    title: "Frequently Asked Questions - Services",
    content:
      "Common questions about our services: What technologies do we use? We work with modern technologies including React, Node.js, Python, AWS, Azure, and more. How long do projects take? Project timelines vary based on complexity, typically 2-12 weeks for most projects. Do we provide ongoing support? Yes, we offer 24/7 support and maintenance packages. What industries do we serve? We work with healthcare, finance, e-commerce, education, and many other industries.",
    category: "faq",
    tags: ["faq", "questions", "services", "timeline", "support", "industries"],
    priority: 8,
  },
  {
    title: "Frequently Asked Questions - Pricing & Process",
    content:
      "Pricing and process questions: How do we price our services? We provide custom quotes based on project scope and requirements. Do we offer fixed-price projects? Yes, we offer both fixed-price and hourly billing options. What's our development process? We follow Agile methodology with regular client updates and feedback cycles. Do we sign NDAs? Yes, we're happy to sign non-disclosure agreements to protect your business ideas and data.",
    category: "faq",
    tags: ["faq", "pricing", "process", "agile", "nda", "quotes"],
    priority: 8,
  },
  {
    title: "CEO Message & Company Vision",
    content:
      "From our leadership team: NimiTech IT LLC is committed to empowering businesses through innovative technology solutions. Our vision is to be the trusted technology partner that helps companies achieve their digital transformation goals. We believe in building long-term relationships with our clients and delivering exceptional value through cutting-edge solutions, expert consulting, and dedicated support.",
    category: "company",
    tags: ["ceo", "leadership", "vision", "mission", "values", "commitment"],
    priority: 9,
  },
  {
    title: "Technology Expertise & Specializations",
    content:
      "Our technical expertise includes: Frontend Technologies (React, Vue.js, Angular, HTML5, CSS3, JavaScript/TypeScript), Backend Technologies (Node.js, Python, Java, .NET, PHP), Databases (MongoDB, PostgreSQL, MySQL, Redis), Cloud Platforms (AWS, Azure, Google Cloud), DevOps Tools (Docker, Kubernetes, Jenkins, GitLab CI), Mobile Development (React Native, Flutter, iOS, Android), and emerging technologies like AI/ML, blockchain, and IoT.",
    category: "technology",
    tags: ["technology", "expertise", "react", "node.js", "python", "aws", "mobile", "ai", "blockchain"],
    priority: 8,
  },
  {
    title: "Client Success Stories & Industries",
    content:
      "We've successfully served clients across various industries including Healthcare (HIPAA-compliant solutions), Financial Services (secure fintech applications), E-commerce (scalable online stores), Education (learning management systems), Manufacturing (IoT and automation), Real Estate (property management platforms), and Startups (MVP development and scaling). Our solutions have helped clients increase efficiency by 40-60% and reduce operational costs significantly.",
    category: "success",
    tags: ["clients", "success stories", "industries", "healthcare", "fintech", "ecommerce", "education"],
    priority: 7,
  },
  {
    title: "Security & Compliance",
    content:
      "Security is our top priority. We implement industry-standard security practices including: Data encryption at rest and in transit, Secure coding practices and regular security audits, GDPR and CCPA compliance, HIPAA compliance for healthcare clients, SOC 2 Type II compliance, Multi-factor authentication, Regular penetration testing, and 24/7 security monitoring. We ensure your data and applications are protected against modern threats.",
    category: "security",
    tags: ["security", "compliance", "gdpr", "hipaa", "encryption", "audits", "monitoring"],
    priority: 8,
  },
  {
    title: "Bussy Mesh - CEO & Founder",
    content:
      "Bussy Mesh is the Chief Executive Officer and Founder of NimiTech IT LLC. As the visionary leader behind NimiTech, she has established the company as a leading technology consulting firm specializing in digital transformation, software development, and business solutions. Under her leadership, NimiTech has grown to serve clients globally, helping businesses leverage cutting-edge technology to improve efficiency, reduce costs, and drive growth. Bussy Mesh brings extensive experience in technology leadership, business strategy, and innovation to guide NimiTech's mission of delivering exceptional IT solutions and consulting services.",
    category: "leadership",
    tags: ["bussy mesh", "ceo", "founder", "leadership", "executive", "technology leader", "business strategy"],
    priority: 10,
  },
  {
    title: "Company Leadership & Executive Team",
    content:
      "NimiTech IT LLC is led by CEO and Founder Bussy Mesh, who brings visionary leadership and extensive technology expertise to the company. Our executive team is committed to delivering innovative solutions and exceptional service to our clients. The leadership team focuses on strategic growth, technology innovation, and maintaining NimiTech's position as a trusted partner for digital transformation and business solutions.",
    category: "leadership",
    tags: ["leadership", "executive team", "bussy mesh", "management", "company structure"],
    priority: 9,
  },
];

const seedKnowledgeBase = async () => {
  try {
    // Clear existing knowledge base
    await KnowledgeBase.deleteMany({ websiteId: "nimitechit" });

    // Insert new knowledge base entries
    const entries = knowledgeBaseEntries.map(entry => ({
      ...entry,
      websiteId: "nimitechit",
      isActive: true,
      lastUpdated: new Date(),
    }));

    await KnowledgeBase.insertMany(entries);
    console.log("Knowledge base seeded successfully");
  } catch (error) {
    console.error("Error seeding knowledge base:", error);
  }
};

// Execute seeding if this file is run directly
if (require.main === module) {
  const mongoose = require('mongoose');
  require('dotenv').config();
  
  const runSeeding = async () => {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nimitech_blog');
      console.log('Connected to MongoDB successfully');
      
      console.log('Starting knowledge base seeding...');
      await seedKnowledgeBase();
      
      console.log('Seeding completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('Seeding failed:', error);
      process.exit(1);
    }
  };
  
  runSeeding();
}

module.exports = { seedKnowledgeBase };
