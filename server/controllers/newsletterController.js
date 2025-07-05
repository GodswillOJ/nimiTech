const NewsletterSubscription = require("../models/NewsletterSubscription");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Configure nodemailer (reuse from authController)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send welcome email notification
const sendWelcomeEmail = async subscriberData => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: subscriberData.email,
      subject: "Welcome to Nimitech Newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #9333ea; margin: 0; font-size: 28px;">Welcome to NimiTech!</h1>
              <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 16px;">Thank you for joining our newsletter community</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #9333ea 0%, #c084fc 100%); border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="color: white; margin: 0 0 10px 0; font-size: 20px;">Hello ${
                subscriberData.firstName
              }!</h2>
              <p style="color: #f3f4f6; margin: 0; font-size: 14px;">You've successfully subscribed to receive updates about our latest blog posts, tech insights, and company news.</p>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #374151; margin: 0 0 15px 0;">What to expect:</h3>
              <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Weekly digest of our latest blog posts</li>
                <li style="margin-bottom: 8px;">Exclusive tech insights and industry updates</li>
                <li style="margin-bottom: 8px;">Early access to new features and announcements</li>
                <li style="margin-bottom: 8px;">Curated content tailored to your interests</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/blogs" 
                 style="background: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                Read Our Latest Posts
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                You can unsubscribe at any time by clicking 
                <a href="${
                  process.env.SERVER_URL || "http://localhost:10000"
                }/api/newsletter/unsubscribe/${subscriberData.unsubscribeToken}" 
                   style="color: #9333ea; text-decoration: none;">here</a>
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                © ${new Date().getFullYear()} NimiTech. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${subscriberData.email}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    // Don't throw error - subscription should still succeed even if email fails
  }
};

// Send admin notification email
const sendAdminNotification = async subscriberData => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: "New Newsletter Subscription",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #9333ea;">New Newsletter Subscription</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${subscriberData.firstName}</p>
            <p><strong>Email:</strong> ${subscriberData.email}</p>
            <p><strong>Source:</strong> ${subscriberData.subscriptionSource}</p>
            <p><strong>Subscribed At:</strong> ${new Date(
              subscriberData.createdAt
            ).toLocaleString()}</p>
            <p><strong>IP Address:</strong> ${subscriberData.ipAddress || "Unknown"}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            This notification was sent automatically when a new user subscribed to the newsletter.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent for new subscriber: ${subscriberData.email}`);
  } catch (error) {
    console.error("Failed to send admin notification:", error);
  }
};

// Input sanitization function
const sanitizeInput = input => {
  if (typeof input !== "string") return input;
  return input
    .replace(/[<>]/g, "") // Remove potential XSS characters
    .trim();
};

// Validate email format
const validateEmail = email => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// List of temporary email domains to block
const tempEmailDomains = [
  "10minutemail.com",
  "tempmail.org",
  "guerrillamail.com",
  "mailinator.com",
  "yopmail.com",
  "temp-mail.org",
  "getairmail.com",
  "sharklasers.com",
  "throwaway.email",
  "maildrop.cc",
  "trashmail.com",
  "dispostable.com",
  "emailondeck.com",
  "mohmal.com",
  "mytrashmail.com",
  "tempail.com",
  "throwawaymail.com",
  "guerrillamailblock.com",
  "spam4.me",
  "tempinbox.com",
];

// Check if email is from a temporary email service
const isTempEmail = email => {
  const domain = email.split("@")[1]?.toLowerCase();
  return tempEmailDomains.includes(domain);
};

// Subscribe to newsletter
const subscribeToNewsletter = async (req, res) => {
  try {
    const { firstName, email, subscriptionSource = "modal" } = req.body;

    // Sanitize inputs
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedEmail = sanitizeInput(email?.toLowerCase());
    const sanitizedSource = sanitizeInput(subscriptionSource);

    // Validate required fields
    if (!sanitizedFirstName || !sanitizedEmail) {
      return res.status(400).json({
        success: false,
        message: "First name and email are required",
      });
    }

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check for temporary email
    if (isTempEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Temporary email addresses are not allowed",
      });
    }

    // Check if email already exists
    const existingSubscription = await NewsletterSubscription.findOne({
      email: sanitizedEmail,
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(409).json({
          success: false,
          message: "You are already subscribed to our newsletter",
        });
      } else {
        // Reactivate subscription
        await existingSubscription.resubscribe();

        // Send welcome back email
        await sendWelcomeEmail({
          firstName: existingSubscription.firstName,
          email: existingSubscription.email,
          unsubscribeToken: existingSubscription.unsubscribeToken,
          createdAt: existingSubscription.createdAt,
          subscriptionSource: existingSubscription.subscriptionSource,
          ipAddress: ipAddress,
        });

        // Send admin notification
        await sendAdminNotification({
          firstName: existingSubscription.firstName,
          email: existingSubscription.email,
          subscriptionSource: existingSubscription.subscriptionSource + " (resubscribed)",
          createdAt: new Date(),
          ipAddress: ipAddress,
        });

        return res.status(200).json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
          data: {
            subscription: {
              id: existingSubscription._id,
              firstName: existingSubscription.firstName,
              email: existingSubscription.email,
              subscribedAt: existingSubscription.createdAt,
            },
          },
        });
      }
    }

    // Get client information for tracking
    const ipAddress = req.ip || req.connection.remoteAddress || "unknown";
    const userAgent = req.get("User-Agent") || "unknown";

    // Create new subscription
    const subscription = new NewsletterSubscription({
      firstName: sanitizedFirstName,
      email: sanitizedEmail,
      subscriptionSource: sanitizedSource,
      ipAddress,
      userAgent,
    });

    await subscription.save();

    // Send welcome email to subscriber
    await sendWelcomeEmail({
      firstName: subscription.firstName,
      email: subscription.email,
      unsubscribeToken: subscription.unsubscribeToken,
      createdAt: subscription.createdAt,
      subscriptionSource: subscription.subscriptionSource,
      ipAddress: subscription.ipAddress,
    });

    // Send admin notification
    await sendAdminNotification({
      firstName: subscription.firstName,
      email: subscription.email,
      subscriptionSource: subscription.subscriptionSource,
      createdAt: subscription.createdAt,
      ipAddress: subscription.ipAddress,
    });

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter!",
      data: {
        subscription: {
          id: subscription._id,
          firstName: subscription.firstName,
          email: subscription.email,
          subscribedAt: subscription.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already subscribed",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error occurred while processing subscription",
    });
  }
};

// Get all newsletter subscriptions (Admin only)
const getAllNewsletterSubscriptions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      subscriptionSource,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    if (subscriptionSource) {
      query.subscriptionSource = subscriptionSource;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const subscriptions = await NewsletterSubscription.find(query)
      .select("-unsubscribeToken -ipAddress -userAgent") // Hide sensitive data
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await NewsletterSubscription.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        subscriptions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalSubscriptions: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get newsletter subscriptions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching subscriptions",
    });
  }
};

// Get newsletter subscription statistics (Admin only)
const getNewsletterStats = async (req, res) => {
  try {
    const stats = await NewsletterSubscription.getStats();

    // Get subscriptions by source
    const sourceStats = await NewsletterSubscription.aggregate([
      { $group: { _id: "$subscriptionSource", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        sourceStats,
      },
    });
  } catch (error) {
    console.error("Get newsletter stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while fetching statistics",
    });
  }
};

// Unsubscribe from newsletter
const unsubscribeFromNewsletter = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Unsubscribe token is required",
      });
    }

    const subscription = await NewsletterSubscription.findOne({
      unsubscribeToken: token,
      isActive: true,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired unsubscribe link",
      });
    }

    await subscription.unsubscribe();

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while unsubscribing",
    });
  }
};

// Export subscribers list (Admin only)
const exportSubscribers = async (req, res) => {
  try {
    const { format = "csv", isActive } = req.query;

    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const subscriptions = await NewsletterSubscription.find(query)
      .select("firstName email subscriptionSource createdAt isActive unsubscribedAt")
      .sort({ createdAt: -1 });

    if (format === "csv") {
      // Convert to CSV format
      const csvHeader = "First Name,Email,Source,Subscribed Date,Status,Unsubscribed Date\n";
      const csvData = subscriptions
        .map(sub => {
          const unsubscribedDate = sub.unsubscribedAt
            ? sub.unsubscribedAt.toISOString().split("T")[0]
            : "";
          return `"${sub.firstName}","${sub.email}","${sub.subscriptionSource}","${
            sub.createdAt.toISOString().split("T")[0]
          }","${sub.isActive ? "Active" : "Unsubscribed"}","${unsubscribedDate}"`;
        })
        .join("\n");

      const csvContent = csvHeader + csvData;
      const timestamp = new Date().toISOString().split("T")[0];

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="newsletter_subscribers_${timestamp}.csv"`
      );
      res.setHeader("Content-Length", Buffer.byteLength(csvContent, "utf8"));

      return res.status(200).send(csvContent);
    } else {
      res.status(200).json({
        success: true,
        data: {
          subscriptions,
          exportedAt: new Date(),
          totalCount: subscriptions.length,
          format: format,
        },
      });
    }
  } catch (error) {
    console.error("Export subscribers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while exporting subscribers",
    });
  }
};

// Delete subscription (Admin only)
const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await NewsletterSubscription.findByIdAndDelete(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    console.error("Delete subscription error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred while deleting subscription",
    });
  }
};

module.exports = {
  subscribeToNewsletter,
  getAllSubscriptions: getAllNewsletterSubscriptions,
  getSubscriptionStats: getNewsletterStats,
  unsubscribeFromNewsletter,
  exportSubscriptions: exportSubscribers,
  deleteSubscription,
  bulkImportSubscriptions: async (req, res) => {
    try {
      const { subscriptions } = req.body;

      if (!Array.isArray(subscriptions)) {
        return res.status(400).json({
          success: false,
          message: "Subscriptions must be an array",
        });
      }

      const results = {
        success: 0,
        failed: 0,
        errors: [],
      };

      for (const sub of subscriptions) {
        try {
          const sanitizedFirstName = sanitizeInput(sub.firstName);
          const sanitizedEmail = sanitizeInput(sub.email?.toLowerCase());

          if (!sanitizedFirstName || !sanitizedEmail) {
            results.failed++;
            results.errors.push(`Missing required fields for ${sub.email || "unknown"}`);
            continue;
          }

          if (!validateEmail(sanitizedEmail)) {
            results.failed++;
            results.errors.push(`Invalid email format: ${sanitizedEmail}`);
            continue;
          }

          if (isTempEmail(sanitizedEmail)) {
            results.failed++;
            results.errors.push(`Temporary email not allowed: ${sanitizedEmail}`);
            continue;
          }

          // Check if email already exists
          const existingSubscription = await NewsletterSubscription.findOne({
            email: sanitizedEmail,
          });

          if (existingSubscription) {
            if (!existingSubscription.isActive) {
              await existingSubscription.resubscribe();
              results.success++;
            } else {
              results.failed++;
              results.errors.push(`Email already subscribed: ${sanitizedEmail}`);
            }
          } else {
            const subscription = new NewsletterSubscription({
              firstName: sanitizedFirstName,
              email: sanitizedEmail,
              subscriptionSource: "import",
            });

            await subscription.save();
            results.success++;
          }
        } catch (error) {
          results.failed++;
          results.errors.push(`Error processing ${sub.email}: ${error.message}`);
        }
      }

      res.status(200).json({
        success: true,
        message: "Import completed",
        data: results,
      });
    } catch (error) {
      console.error("Bulk import error:", error);
      res.status(500).json({
        success: false,
        message: "Server error occurred during import",
      });
    }
  },
};
