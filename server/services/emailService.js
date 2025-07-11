const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // your email
      pass: process.env.SMTP_PASS, // your app password
    },
  });
};

// Send application confirmation email to applicant
const sendApplicationConfirmation = async (applicantData, jobData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "NimiTech Careers",
        address: process.env.SMTP_USER,
      },
      to: applicantData.email,
      subject: `Application Received - ${jobData.title} Position`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { background-color: #34495e; color: white; padding: 15px; text-align: center; }
            .highlight { color: #e74c3c; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Received!</h1>
            </div>
            <div class="content">
              <h2>Dear ${applicantData.firstName} ${applicantData.lastName},</h2>
              <p>Thank you for your interest in the <span class="highlight">${
                jobData.title
              }</span> position at NimiTech!</p>
              
              <p>We have successfully received your application and our team will review it carefully. Here are the details of your application:</p>
              
              <ul>
                <li><strong>Position:</strong> ${jobData.title}</li>
                <li><strong>Department:</strong> ${jobData.department}</li>
                <li><strong>Location:</strong> ${jobData.location}</li>
                <li><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
              
              <p>We will contact you within <strong>1-2 weeks</strong> regarding the next steps in our hiring process.</p>
              
              <p>If you have any questions, please don't hesitate to reach out to us.</p>
              
              <p>Best regards,<br>
              The NimiTech HR Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} NimiTech. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Application confirmation email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending application confirmation email:", error);
    throw error;
  }
};

// Send new application notification to admin
const sendAdminNotification = async (applicantData, jobData, applicationId) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "NimiTech Careers System",
        address: process.env.SMTP_USER,
      },
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `New Job Application - ${jobData.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #27ae60; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { background-color: #2c3e50; color: white; padding: 15px; text-align: center; }
            .applicant-info { background-color: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Job Application Received</h1>
            </div>
            <div class="content">
              <h2>Application Details</h2>
              
              <div class="applicant-info">
                <h3>Applicant Information:</h3>
                <ul>
                  <li><strong>Name:</strong> ${applicantData.firstName} ${
        applicantData.lastName
      }</li>
                  <li><strong>Email:</strong> ${applicantData.email}</li>
                  <li><strong>Phone:</strong> ${applicantData.phone}</li>
                  <li><strong>Experience:</strong> ${applicantData.experience}</li>
                </ul>
              </div>
              
              <div class="applicant-info">
                <h3>Position Details:</h3>
                <ul>
                  <li><strong>Job Title:</strong> ${jobData.title}</li>
                  <li><strong>Department:</strong> ${jobData.department}</li>
                  <li><strong>Location:</strong> ${jobData.location}</li>
                  <li><strong>Type:</strong> ${jobData.type}</li>
                </ul>
              </div>
              
              ${
                applicantData.message
                  ? `
              <div class="applicant-info">
                <h3>Cover Letter Message:</h3>
                <p>${applicantData.message}</p>
              </div>
              `
                  : ""
              }
              
              <p><strong>Application ID:</strong> ${applicationId}</p>
              <p><strong>Applied on:</strong> ${new Date().toLocaleDateString()}</p>
              
              <p>Please log into the admin panel to review the application and download the attached documents.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} NimiTech Careers System</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    throw error;
  }
};

module.exports = {
  sendApplicationConfirmation,
  sendAdminNotification,
};
