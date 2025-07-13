const mongoose = require("mongoose");

const newsletterSubscriptionSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name must be less than 50 characters"],
      minlength: [2, "First name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subscriptionSource: {
      type: String,
      enum: ["blog", "homepage", "modal", "footer"],
      default: "modal",
    },
    unsubscribeToken: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but ensure uniqueness when present
    },
    unsubscribedAt: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full name
newsletterSubscriptionSchema.virtual("fullName").get(function () {
  return this.firstName;
});

// Pre-save middleware to generate unsubscribe token
newsletterSubscriptionSchema.pre("save", function (next) {
  if (this.isNew && !this.unsubscribeToken) {
    this.unsubscribeToken = require("crypto").randomBytes(32).toString("hex");
  }
  next();
});

// Static method to find active subscriptions
newsletterSubscriptionSchema.statics.findActiveSubscriptions = function () {
  return this.find({ isActive: true }).select("-unsubscribeToken");
};

// Static method to get subscription stats
newsletterSubscriptionSchema.statics.getStats = async function () {
  const totalSubscriptions = await this.countDocuments();
  const activeSubscriptions = await this.countDocuments({ isActive: true });
  const unsubscribed = await this.countDocuments({ isActive: false });

  // Calculate date ranges
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Get this week subscriptions
  const thisWeekSubscriptions = await this.countDocuments({
    createdAt: { $gte: startOfWeek },
  });

  // Get this month subscriptions
  const thisMonthSubscriptions = await this.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  // Get subscriptions by month for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyStats = await this.aggregate([
    {
      $match: { createdAt: { $gte: sixMonthsAgo } },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);

  return {
    totalSubscriptions,
    activeSubscriptions,
    unsubscribed,
    thisWeekSubscriptions,
    thisMonthSubscriptions,
    monthlyStats,
  };
};

// Method to unsubscribe
newsletterSubscriptionSchema.methods.unsubscribe = function () {
  this.isActive = false;
  this.unsubscribedAt = new Date();
  return this.save();
};

// Method to resubscribe
newsletterSubscriptionSchema.methods.resubscribe = function () {
  this.isActive = true;
  this.unsubscribedAt = null;
  return this.save();
};

module.exports = mongoose.model("NewsletterSubscription", newsletterSubscriptionSchema);
