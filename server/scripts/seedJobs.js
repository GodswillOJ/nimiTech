const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const Job = require("../models/Job");
const Admin = require("../models/Admin");
const connectDB = require("../config/db");

const jobsData = [
  {
    title: "Product Manager",
    location: "Remote",
    type: "Full-Time",
    department: "Product",
    experienceLevel: "Mid",
    description:
      "Our mission is to build a super powerful and exceptionally delightful All-in-One recruitment platform, that empowers recruiters and leaders to source, engage, and close best candidates.",
    responsibilities: [
      "Define and execute product strategy based on market research, customer feedback, and business objectives",
      "Collaborate with engineering and design teams to translate product vision into detailed requirements",
      "Develop, maintain, and communicate product roadmaps",
      "Work closely with customer success and sales teams to understand customer needs",
      "Analyze product usage insights, analytics and customer feedback to drive decisions",
      "Monitor customer insights, edge-deals, and industry trends to inform product roadmap",
    ],
    requirements: [
      "Bachelor's degree in Business, Marketing, Computer Science, or related field; MBA preferred",
      "Proven experience as a Product Manager or in a similar role",
      "Strong understanding of product management methodologies",
      "Excellent communication skills, with an ability to collaborate and influence across teams",
      "Advanced analytical and problem solving skills",
      "Professional level English communication",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Comprehensive health, dental, and vision insurance",
      "Flexible work arrangements",
      "Professional development opportunities",
      "Annual learning budget",
      "Team building events and company retreats",
    ],
    skills: [
      "Product Strategy",
      "Market Research",
      "Analytics",
      "Roadmapping",
      "Stakeholder Management",
    ],
    salaryRange: {
      min: 80000,
      max: 120000,
      currency: "USD",
    },
    isActive: true,
  },
  {
    title: "Product Designer",
    location: "Remote",
    type: "Full-Time",
    department: "Design",
    experienceLevel: "Mid",
    description:
      "We are looking for an experienced and talented Product Designer to join our team. In this role, you will oversee the entire product lifecycle—from concept through launch and beyond.",
    responsibilities: [
      "Define and execute product strategy based on market research, customer feedback, and business objectives with user research",
      "Collaborate with engineering and design teams to translate product vision into detailed requirements",
      "Develop, maintain, and communicate as a proactive product roadmap",
      "Work closely with customer success and sales teams to understand customer needs",
      "Analyze customer insights, edge-deals, and industry trends to inform product decisions",
      "Design with increasing and internal tools to ensure product positioning accuracy and best interface abilities",
    ],
    requirements: [
      "Bachelor's degree in Design, Computer Science, or related field",
      "Proven experience as a Product Designer or UX/UI Designer",
      "Strong understanding of design principles and methodologies",
      "Excellent communication skills, with an ability to collaborate and influence across teams",
      "Advanced analytical and problem solving skills",
      "Professional worked with a passion for solving complex problems",
    ],
    benefits: [
      "Competitive salary and comprehensive benefits",
      "Health, dental, and vision insurance",
      "Flexible work arrangements",
      "Professional development opportunities",
      "Annual learning budget",
      "Creative workspace and latest design tools",
    ],
    skills: ["UI/UX Design", "Figma", "User Research", "Prototyping", "Design Systems"],
    salaryRange: {
      min: 70000,
      max: 100000,
      currency: "USD",
    },
    isActive: true,
  },
  {
    title: "Frontend Developer",
    location: "Remote",
    type: "Full-Time",
    department: "Engineering",
    experienceLevel: "Mid",
    description:
      "We're looking for an experienced Frontend Developer to join our team. In this role, you will be responsible for building exceptional user interfaces and experiences.",
    responsibilities: [
      "Develop responsive web applications using modern frontend technologies",
      "Collaborate with designers and backend developers to implement user interfaces",
      "Write clean, maintainable, and efficient code",
      "Optimize applications for maximum speed and scalability",
      "Participate in code reviews and maintain coding standards",
      "Stay up-to-date with emerging frontend technologies and best practices",
    ],
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "3+ years of experience in frontend development",
      "Proficiency in React, JavaScript, HTML, and CSS",
      "Experience with modern frontend build tools and workflows",
      "Strong understanding of responsive design principles",
      "Excellent problem-solving skills and attention to detail",
    ],
    benefits: [
      "Competitive salary and benefits package",
      "Health, dental, and vision insurance",
      "Remote work flexibility",
      "Professional development budget",
      "Latest development tools and equipment",
      "Collaborative team environment",
    ],
    skills: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Git"],
    salaryRange: {
      min: 75000,
      max: 110000,
      currency: "USD",
    },
    isActive: true,
  },
  {
    title: "Backend Developer",
    location: "Remote",
    type: "Full-Time",
    department: "Engineering",
    experienceLevel: "Senior",
    description:
      "We're seeking an experienced Backend Developer to join our engineering team and help build scalable server-side applications.",
    responsibilities: [
      "Design and develop robust backend systems and APIs",
      "Work with databases and ensure data integrity and security",
      "Collaborate with frontend developers to integrate user-facing elements",
      "Optimize applications for performance and scalability",
      "Implement security and data protection measures",
      "Participate in architectural decisions and code reviews",
    ],
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "5+ years of backend development experience",
      "Proficiency in Node.js, Python, or similar backend technologies",
      "Experience with databases (SQL and NoSQL)",
      "Knowledge of cloud platforms (AWS, Azure, or GCP)",
      "Strong understanding of API design and microservices architecture",
    ],
    benefits: [
      "Competitive salary and equity options",
      "Comprehensive health benefits",
      "Flexible remote work policy",
      "Professional development opportunities",
      "Conference attendance budget",
      "Cutting-edge technology stack",
    ],
    skills: ["Node.js", "Python", "MongoDB", "PostgreSQL", "AWS", "Docker"],
    salaryRange: {
      min: 90000,
      max: 140000,
      currency: "USD",
    },
    isActive: true,
  },
  {
    title: "Data Analyst",
    location: "On-site",
    type: "Full-Time",
    department: "Analytics",
    experienceLevel: "Entry",
    description:
      "We're looking for an experienced Data Analyst to join our team. In this role, you will be responsible for analyzing complex data sets to drive business decisions.",
    responsibilities: [
      "Collect, process, and analyze large datasets",
      "Create data visualizations and reports for stakeholders",
      "Identify trends and patterns in business data",
      "Collaborate with teams to define KPIs and metrics",
      "Develop and maintain data dashboards",
      "Present findings to management and other stakeholders",
    ],
    requirements: [
      "Bachelor's degree in Statistics, Mathematics, Economics, or related field",
      "2+ years of experience in data analysis",
      "Proficiency in SQL and data visualization tools",
      "Experience with statistical analysis and modeling",
      "Strong analytical and problem-solving skills",
      "Excellent communication and presentation abilities",
    ],
    benefits: [
      "Competitive salary package",
      "Health and wellness benefits",
      "On-site gym and cafeteria",
      "Learning and development programs",
      "Collaborative work environment",
      "Career advancement opportunities",
    ],
    skills: ["SQL", "Python", "Tableau", "Excel", "Statistics", "Data Visualization"],
    salaryRange: {
      min: 55000,
      max: 75000,
      currency: "USD",
    },
    isActive: true,
  },
];

const seedJobs = async () => {
  try {
    await connectDB();

    // Find an admin user to assign as the poster
    let admin = await Admin.findOne();

    if (!admin) {
      // Create a default admin if none exists
      admin = new Admin({
        name: "NimiTech Admin",
        email: "admin@nimitechit.com",
        password: "admin123", // This should be hashed in a real application
        role: "admin",
      });
      await admin.save();
      console.log("Created default admin user");
    }

    // Clear existing jobs
    await Job.deleteMany({});
    console.log("Cleared existing jobs");

    // Create jobs with admin reference
    const jobsWithAdmin = jobsData.map(job => ({
      ...job,
      postedBy: admin._id,
    }));

    await Job.insertMany(jobsWithAdmin);
    console.log(`✅ Successfully seeded ${jobsData.length} jobs`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding jobs:", error);
    process.exit(1);
  }
};

seedJobs();
