const nodemailer = require('nodemailer');

exports.contactBusiness = async (req, res) => {
  const { fullName, email, phone, location } = req.body;

  if (!fullName || !email || !phone || !location) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your SMTP provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Nimitech IT Contact Form" <${process.env.EMAIL_USER}>`,
      to: 'info@nimitechit.com',
      subject: 'New Contact Form Submission',
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Location:</strong> ${location}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message. Try again later.' });
  }
};
