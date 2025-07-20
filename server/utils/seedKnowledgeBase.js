const KnowledgeBase = require("../models/KnowledgeBase");

const knowledgeBaseData = [
  {
    title: "About NimiTech",
    content:
      "NimiTech is a technology solutions company that provides business consulting, software development, and digital transformation services. We help businesses leverage technology to improve their operations and achieve their goals.",
    category: "company",
    tags: ["about", "company", "services", "technology"],
    priority: 10,
  },
  {
    title: "Our Services",
    content:
      "NimiTech offers a comprehensive range of services including: Business Consulting, Software Development, Digital Transformation, Cloud Solutions, Data Analytics, Mobile App Development, and Web Development.",
    category: "services",
    tags: ["services", "consulting", "development", "cloud", "analytics"],
    priority: 9,
  },
  {
    title: "Contact Information",
    content:
      "You can reach NimiTech through our website contact form, email us directly, or schedule a consultation call. We respond to all inquiries within 24 hours during business days.",
    category: "contact",
    tags: ["contact", "email", "phone", "consultation"],
    priority: 8,
  },
  {
    title: "Blog and Resources",
    content:
      "NimiTech maintains an active blog with insights on technology trends, business strategies, and industry best practices. Our blog is regularly updated with valuable content for businesses and technology professionals.",
    category: "resources",
    tags: ["blog", "resources", "insights", "trends"],
    priority: 7,
  },
  {
    title: "Business Solutions",
    content:
      "We provide tailored business solutions including process optimization, digital workflow automation, custom software development, and technology integration services. Our solutions are designed to improve efficiency and reduce costs.",
    category: "business",
    tags: ["business", "solutions", "automation", "optimization"],
    priority: 8,
  },
  {
    title: "Getting Started",
    content:
      "To get started with NimiTech, you can schedule a free consultation where we discuss your needs and how we can help. During this consultation, we assess your requirements and propose the best solutions for your business.",
    category: "onboarding",
    tags: ["getting started", "consultation", "onboarding", "assessment"],
    priority: 9,
  },
];

const seedKnowledgeBase = async () => {
  try {
    // Clear existing knowledge base
    await KnowledgeBase.deleteMany({ websiteId: "nimitech" });

    // Insert new knowledge base entries
    const entries = knowledgeBaseData.map(entry => ({
      ...entry,
      websiteId: "nimitech",
      isActive: true,
      lastUpdated: new Date(),
    }));

    await KnowledgeBase.insertMany(entries);
    console.log("Knowledge base seeded successfully");
  } catch (error) {
    console.error("Error seeding knowledge base:", error);
  }
};

module.exports = { seedKnowledgeBase };
