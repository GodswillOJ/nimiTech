const nodemailer = require("nodemailer");

const contactBusiness = async (req, res) => {
  const { fullName, email, phone, location } = req.body;

  if (!fullName || !email || !phone || !location) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "mail.nimitechit.com", // ✅ your correct cPanel SMTP server
      port: 465,
      secure: true,
      auth: {
        user: process.env.EmailUser, // info@nimitechit.com
        pass: process.env.EmailPassword, // Your email's actual password
      },
    });

    const mailOptions = {
      from: `"Nimitech IT Contact Form" <${process.env.EmailUser}>`,
      to: ["busay.bright@nimitechit.com", "info@nimitechit.com"],
      subject: "New Contact Form Submission",
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Location:</strong> ${location}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send message. Try again later." });
  }
};

const inquireService = async (req, res) => {
  const { fullName, email, phone, service, message } = req.body;

  if (!fullName || !email || !phone || !service || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "mail.nimitechit.com", // ✅ your correct cPanel SMTP server
      port: 465,
      secure: true,
      auth: {
        user: process.env.EmailUser, // info@nimitechit.com
        pass: process.env.EmailPassword, // Your email's actual password
      },
    });

    const mailOptions = {
      from: `"Nimitech IT Services Form" <${process.env.EmailUser}>`,
      to: ["busay.bright@nimitechit.com", "info@nimitechit.com"],
      subject: "New Service Inquiry Submission",
      html: `
        <h2>Service Inquiry</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Inquiry sent successfully." });
  } catch (error) {
    console.error("Error sending inquiry:", error);
    res.status(500).json({ message: "Failed to send inquiry. Please try again later." });
  }
};

module.exports = {
  contactBusiness,
  inquireService,
};
