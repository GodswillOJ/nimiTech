const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "mail.nimitechit.com",
    port: 465,
    secure: true,
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000, 
    auth: {
      user: process.env.EmailUser,
      pass: process.env.EmailPassword,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates
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
const sendHandoffAdminNotification = async (ticketId, userEmail, userName, conversationHistory, paragraph1) => {
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
              <h1>New Support Ticket Created</h1>
            </div>
			<div class="content"> ${paragrapgh1}
			</div>
            <div class="content">
              <div class="ticket-info">
                <h3>Ticket Information</h3>
                <p><strong>Ticket ID:</strong> <span class="highlight">${ticketId}</span></p>
                <p><strong>User Name:</strong> ${userName || "Not provided"}</p>
                <p><strong>User Email:</strong> ${userEmail}</p>
                <p><strong>Created:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Status:</strong> Pending Response</p>
              </div>
              
              <div class="conversation">
                <h3>Conversation History</h3>
                ${formattedHistory || "<p>No conversation history available.</p>"}
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
      userName,
    });

    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: "NimiTech Support",
        address: process.env.EmailUser,
      },
      to: userEmail,
      subject: `Your Support Request - Ticket #${ticketId}`,
      html: `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=Lato&display=swap"
			rel="stylesheet"
		/>
		<title>NimiTech IT LLC - Support Request Received</title>
		<style>
			* {
				padding: 0;
				margin: 0;
				font-family: "Lato", sans-serif;
				color: #191919;
				font-weight: 400;
			}

			body {
				background-color: #f0f0f0;
				padding: 32px 24px;
			}

			.email-container {
				max-width: 600px;
				margin: 28px auto;
				background-color: #ffffff;
				border-radius: 8px;
				overflow: hidden;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
				border: 1px solid #ededed;
			}

			.header-table,
			.footer-table {
				width: 100%;
				border-spacing: 0;
				border-collapse: collapse;
				background-color: #ffffff;
			}

			.header-cell {
				/*padding: 24px;*/
				vertical-align: middle;
			}

			.footer-cell {
				padding: 12px 24px;
				vertical-align: middle;
			}

			.logo img {
				height: 120px;
				width: 140px;
				display: block;
			}

			.header-title {
				color: #191919;
				font-size: 18px;
				font-weight: 500;
				margin-left: 16px;
			}

			.social-icons {
				text-align: right;
			}

			.social-icons a {
				margin-left: 10px;
				text-decoration: none;
				display: inline-block;
			}

			.social-icons svg {
				width: 24px;
				height: 24px;
				fill: #191919;
				vertical-align: middle;
			}

			.content {
				padding: 8px 24px 0px 24px;
			}

			.salutation {
				font-weight: 500;
				font-size: 24px;
				margin-bottom: 20px;
				line-height: 32px;
				color: #191919;
			}

			.introduction {
				margin-bottom: 15px;
			}
			.introduction > .introductory-text {
				line-height: 25.35px;
				font-size: 16px;
				letter-spacing: -2%;
			}

			.ticket-details {
				background-color: #f6f6f6;
				padding: 24px;
				border-radius: 8px;
				margin-bottom: 20px;
				text-align: center;
				border: 0px solid #191919;
			}

			.ticket-details .ticket-title {
				font-size: 18px;
				margin-top: 0;
				margin-bottom: 14px;
				font-weight: 500;
				line-height: 24px;
				color: #191919;
			}

			.ticket-id {
				font-weight: 700;
				font-size: 24px;
				color: #191919;
				margin-bottom: 10px;
			}

			.ticket-note {
				font-size: 14px;
				color: #666;
				margin-top: 10px;
			}

			.next-steps {
				background-color: #ffffff;
				padding: 24px;
				border-radius: 8px;
				margin-bottom: 20px;
				border: 1px solid #e7e7e7;
			}

			.next-steps-title {
				font-size: 18px;
				margin-top: 0;
				margin-bottom: 14px;
				font-weight: 500;
				line-height: 24px;
			}

			.steps-list {
				margin: 0;
				padding-left: 20px;
			}

			.steps-list li {
				margin-bottom: 8px;
				line-height: 21px;
				font-size: 14px;
			}

			.urgent-contact {
				background-color: #e8f5e8;
				padding: 20px;
				border-radius: 8px;
				margin-bottom: 20px;
				border-left: 4px solid #22c55e;
			}

			.urgent-contact .urgent-title {
				font-weight: 500;
				font-size: 16px;
				margin-bottom: 8px;
			}

			.urgent-contact p {
				margin: 0;
				font-size: 14px;
				line-height: 21px;
			}

			.whatsapp-button {
				display: inline-block;
				background-color: #25d366;
				border-radius: 8px;
				font-size: 12px;
				font-weight: 500;
				line-height: 16px;
				margin-top: 12px;
				padding: 8px 16px;
				text-decoration: none;
			}

			.whatsapp-button .whatsapp-cta {
				color: #ffffff;
				text-decoration: none;
				font-size: 12px;
				font-weight: 500;
				line-height: 16px;
			}

			.remark {
				margin: 20px 0px;
				line-height: 21px;
				font-size: 14px;
				font-weight: 400;
			}

			.divider {
				margin-top: 20px;
			}

			.divider-line {
				border: none;
				border-top: 1px solid #e7e7e7;
				width: 100%;
			}

			.additional-info {
				max-width: 600px;
				margin: 32px auto 0;
			}

			.address {
				text-align: center;
				margin-top: 18px;
				font-size: 12px;
				line-height: 14px;
				color: #200e32;
			}

			.contact-us {
				text-align: center;
				margin-top: 12px;
				font-size: 12px;
				line-height: 14.4px;
				color: #200e32;
				margin-bottom: 12.66px;
			}

			.contact-us-link {
				color: #191919;
				text-decoration: underline;
				cursor: pointer;
			}

			.unsubscribe {
				text-align: center;
				color: #200e32;
				font-size: 12px;
				line-height: 20px;
				border-top: 2px solid #e7e7e7;
				border-bottom: 2px solid #e7e7e7;
				padding-top: 12px;
				padding-bottom: 12px;
			}

			.unsubscribe-link {
				color: #191919;
				text-decoration: underline;
				cursor: pointer;
			}

			.copyright {
				padding-top: 18px;
				padding-bottom: 18px;
				font-size: 12px;
				color: #121212;
				line-height: 20px;
				text-align: center;
			}
		</style>
	</head>
	<body>
		<div class="email-container">
			<table class="header-table">
				<tr>
					<td class="header-cell" align="left" valign="middle">
						<img
							src="https://res.cloudinary.com/dkomq1g9z/image/upload/v1753203410/nimitech/blog/content/content/authorAvatar_NimiTechLogo_copy_1753203388219_c695be570ebf55b1.png"
							alt="NimiTech IT LLC Logo"
							class="logo"
							style="height: 120px; width: 140px; display: block;"
						/>
					</td>
				</tr>
			</table>
			
			<div class="content">
				<h1 class="salutation">Hello ${userName}! 👋</h1>
				<div class="email-body">
					<div class="introduction">
						<p class="introductory-text">
							Thank you for reaching out to NimiTech IT LLC support. We've received your request and created a support ticket for you. Our team is committed to providing you with the best technical assistance.
						</p>
					</div>
					
					<div class="ticket-details">
						<h2 class="ticket-title">Your Support Ticket ID</h2>
						<div class="ticket-id">${ticketId}</div>
						<p class="ticket-note">Please save this ticket ID for your records and future reference</p>
					</div>

					<div class="next-steps">
						<h3 class="next-steps-title">What happens next?</h3>
						<ul class="steps-list">
							<li>Our customer service team will review your request thoroughly</li>
							<li>You'll receive a response within 24 hours during business days</li>
							<li>We'll contact you via this email address with updates</li>
							<li>Reference your ticket ID for faster service and tracking</li>
						</ul>
					</div>

					<div class="urgent-contact">
						<p class="urgent-title">Need immediate assistance?</p>
						<p>For urgent technical matters, you can also reach us directly via WhatsApp for faster response times.</p>
						<a href="https://wa.me/12529039651" class="whatsapp-button">
							<span class="whatsapp-cta">Contact on WhatsApp</span>
						</a>
					</div>

					<div class="remark">
						<p>Thank you for choosing NimiTech IT LLC. We appreciate your business and look forward to resolving your technical needs promptly!</p>
						<br>
						<div class="remark-thanks">Best regards,</div>
					</div>
				</div>
			</div>
			
			<div class="divider">
				<hr class="divider-line" />
			</div>
			
			<table class="footer-table">
				<tr>
					<td class="footer-cell" align="right" valign="middle">
						<div class="social-icons">
							<a href="https://www.facebook.com/nimitechit">
								<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: #191919; vertical-align: middle;">
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
								</svg>
							</a>
							<a href="https://twitter.com/nimitechit">
								<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: #191919; vertical-align: middle;">
									<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
								</svg>
							</a>
							<a href="https://www.linkedin.com/company/nimitechit">
								<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: #191919; vertical-align: middle;">
									<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
								</svg>
							</a>
						</div>
					</td>
				</tr>
			</table>
		</div>
		
		<div class="additional-info">
			<div class="address">NimiTech IT LLC - Professional Technology Solutions</div>
			<div class="contact-us">
				Contact Us:
				<a class="contact-us-link" href="mailto:support@nimitechit.com">support@nimitechit.com</a>
				| WhatsApp: <a class="contact-us-link" href="https://wa.me/12529039651">+1 (252) 903-9651</a>
			</div>
		</div>
	</body>
</html>`,
    };

    console.log(`📧 Attempting to send email with options:`, {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    await transporter.sendMail(mailOptions);
    console.log(`✅ Handoff user confirmation sent successfully to: ${userEmail}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending handoff user confirmation:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
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
