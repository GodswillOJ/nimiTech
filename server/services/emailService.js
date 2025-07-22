const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "mail.nimitechit.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EmailUser,
      pass: process.env.EmailPassword,
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
        address: process.env.EmailUser,
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
            .highlight { color: #88199a; font-weight: bold; }
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
        address: process.env.EmailUser,
      },
      to: process.env.EmailUser,
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

// Send handoff notification to admin with conversation summary
const sendHandoffAdminNotification = async (ticketId, userEmail, userName, conversationHistory) => {
  try {
    const transporter = createTransporter();

    // Format conversation history for email
    const formattedHistory = conversationHistory
      .map(msg => `
        <div style="margin: 10px 0; padding: 10px; background: ${msg.sender === 'user' ? '#f0f8ff' : '#f5f5f5'}; border-radius: 5px;">
          <strong>${msg.sender === 'user' ? 'User' : 'Ken (AI)'}:</strong> ${msg.content}
        </div>
      `)
      .join('');

    const mailOptions = {
      from: {
        name: "NimiTech Chat Support",
        address: process.env.EmailUser,
      },
      to: process.env.EmailUser,
      subject: `🎫 New Support Ticket: ${ticketId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .header { background-color: #9333ea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .ticket-info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .conversation { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; max-height: 400px; overflow-y: auto; }
            .footer { background-color: #7e22ce; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
            .highlight { color: #9333ea; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 New Support Ticket Created</h1>
            </div>
            <div class="content">
              <div class="ticket-info">
                <h3>Ticket Information</h3>
                <p><strong>Ticket ID:</strong> <span class="highlight">${ticketId}</span></p>
                <p><strong>User Name:</strong> ${userName || 'Not provided'}</p>
                <p><strong>User Email:</strong> ${userEmail}</p>
                <p><strong>Created:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Status:</strong> Pending Response</p>
              </div>
              
              <div class="conversation">
                <h3>Conversation History</h3>
                ${formattedHistory || '<p>No conversation history available.</p>'}
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px;">
                <h4>Next Steps:</h4>
                <ul>
                  <li>Review the conversation history above</li>
                  <li>Contact the user at ${userEmail}</li>
                  <li>Reference ticket ID: ${ticketId}</li>
                  <li>Provide appropriate assistance</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>NimiTech IT LLC - Customer Support System</p>
              <p>This is an automated notification from the chat support system.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Handoff admin notification sent for ticket: ${ticketId}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending handoff admin notification:", error);
    return false;
  }
};

// Send handoff confirmation to user
const sendHandoffUserConfirmation = async (ticketId, userEmail, userName) => {
  try {
    console.log(`📧 Starting sendHandoffUserConfirmation:`, {
      ticketId,
      userEmail,
      userName
    });
    
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "NimiTech Support",
        address: process.env.EmailUser,
      },
      to: userEmail,
      subject: `Your Support Request - Ticket #${ticketId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #9333ea; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .ticket-box { background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid #9333ea; }
            .footer { background-color: #7e22ce; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
            .highlight { color: #9333ea; font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 Support Request Received</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName || 'there'}! 👋</h2>
              
              <p>Thank you for reaching out to NimiTech support. We've received your request and created a support ticket for you.</p>
              
              <div class="ticket-box">
                <h3>Your Ticket ID</h3>
                <div class="highlight">${ticketId}</div>
                <p style="margin-top: 15px; color: #666;">Please save this ticket ID for your records</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>What happens next?</h3>
                <ul style="text-align: left;">
                  <li>📧 Our customer service team will review your request</li>
                  <li>⏰ You'll receive a response within 24 hours during business days</li>
                  <li>💬 We'll contact you via this email address</li>
                  <li>🎯 Reference your ticket ID for faster service</li>
                </ul>
              </div>
              
              <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Need immediate assistance?</strong></p>
                <p>For urgent matters, you can also reach us via WhatsApp at +1 (252) 903-9651</p>
              </div>
              
              <p>Thank you for choosing NimiTech IT LLC. We appreciate your business and look forward to helping you!</p>
            </div>
            <div class="footer">
              <p><strong>NimiTech IT LLC</strong></p>
              <p>Your Trusted Technology Partner</p>
              <p>🌐 nimitechit.com | 📱 WhatsApp: +1 (252) 903-9651</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log(`📧 Attempting to send email with options:`, {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Handoff user confirmation sent successfully to: ${userEmail}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending handoff user confirmation:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    return false;
  }
};

module.exports = {
  sendApplicationConfirmation,
  sendAdminNotification,
  sendHandoffAdminNotification,
  sendHandoffUserConfirmation,
};
