const NewsletterSubscription = require("../models/NewsletterSubscription");
const crypto = require("crypto");

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
    const { format = "json", isActive } = req.query;

    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const subscriptions = await NewsletterSubscription.find(query)
      .select("firstName email subscriptionSource createdAt isActive")
      .sort({ createdAt: -1 });

    if (format === "csv") {
      // Convert to CSV format
      const csvHeader = "First Name,Email,Source,Subscribed Date,Status\n";
      const csvData = subscriptions
        .map(
          sub =>
            `"${sub.firstName}","${sub.email}","${
              sub.subscriptionSource
            }","${sub.createdAt.toISOString()}","${sub.isActive ? "Active" : "Unsubscribed"}"`
        )
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", 'attachment; filename="newsletter_subscribers.csv"');
      res.status(200).send(csvHeader + csvData);
    } else {
      res.status(200).json({
        success: true,
        data: {
          subscriptions,
          exportedAt: new Date(),
          totalCount: subscriptions.length,
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
