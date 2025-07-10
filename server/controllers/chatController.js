const { v4: uuidv4 } = require("uuid");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const aiService = require("../services/aiService");

// Start a new conversation
const startConversation = async (req, res) => {
  try {
    const { userAgent, ip, referrer, deviceType } = req.body;

    const sessionId = uuidv4();

    const conversation = new Conversation({
      sessionId,
      websiteId: "nimitech",
      metadata: {
        userAgent: userAgent || req.get("User-Agent"),
        ip: ip || req.ip,
        referrer: referrer || req.get("Referer"),
        deviceType: deviceType || "unknown",
      },
    });

    await conversation.save();

    // Send welcome message
    const welcomeMessage = new Message({
      conversationId: conversation._id,
      sender: "ai",
      content:
        "Hello! Welcome to NimiTech. I'm here to help you with any questions about our services. How can I assist you today?",
    });

    await welcomeMessage.save();

    res.status(201).json({
      success: true,
      data: {
        sessionId,
        conversationId: conversation._id,
        message: "Conversation started successfully",
      },
    });
  } catch (error) {
    console.error("Start conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start conversation",
    });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { sessionId, content, sender = "user" } = req.body;

    if (!sessionId || !content) {
      return res.status(400).json({
        success: false,
        message: "Session ID and content are required",
      });
    }

    // Find conversation
    const conversation = await Conversation.findOne({ sessionId, status: "active" });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or closed",
      });
    }

    // Save user message
    const userMessage = new Message({
      conversationId: conversation._id,
      sender,
      content,
    });
    await userMessage.save();

    // Get conversation history for context
    const recentMessages = await Message.find({ conversationId: conversation._id })
      .sort({ timestamp: -1 })
      .limit(10);

    // Generate AI response
    const aiResponse = await aiService.generateResponse(content, recentMessages.reverse());

    // Save AI response
    const aiMessage = new Message({
      conversationId: conversation._id,
      sender: "ai",
      content: aiResponse.response,
      metadata: {
        confidence: aiResponse.confidence,
        knowledgeBaseRefs: aiResponse.knowledgeBaseRefs,
        handoffTrigger: aiResponse.handoffTrigger,
      },
    });
    await aiMessage.save();

    // Emit real-time updates via Socket.IO
    const io = req.app.get("io");
    if (io) {
      io.to(sessionId).emit("new_message", {
        message: aiMessage,
        handoffSuggested: aiResponse.handoffTrigger,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userMessage,
        aiMessage,
        handoffSuggested: aiResponse.handoffTrigger,
      },
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// Get conversation history
const getConversationHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await Message.find({ conversationId: conversation._id }).sort({
      timestamp: 1,
    });

    res.status(200).json({
      success: true,
      data: {
        conversation,
        messages,
      },
    });
  } catch (error) {
    console.error("Get conversation history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve conversation history",
    });
  }
};

// Request human handoff
const requestHandoff = async (req, res) => {
  try {
    const { sessionId, reason } = req.body;

    const conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Update conversation status
    conversation.status = "transferred";
    await conversation.save();

    // Add handoff message
    const handoffMessage = new Message({
      conversationId: conversation._id,
      sender: "ai",
      content: "I'm connecting you with one of our team members. They'll be with you shortly!",
      metadata: {
        handoffTrigger: true,
      },
    });
    await handoffMessage.save();

    // Emit handoff event
    const io = req.app.get("io");
    if (io) {
      io.to(sessionId).emit("handoff_initiated", {
        message: "Connecting you with a human agent...",
        estimatedWaitTime: "2-3 minutes",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        message: "Handoff request processed successfully",
        status: "transferred",
      },
    });
  } catch (error) {
    console.error("Request handoff error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process handoff request",
    });
  }
};

// End conversation
const endConversation = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    conversation.status = "closed";
    conversation.endTime = new Date();
    await conversation.save();

    res.status(200).json({
      success: true,
      data: {
        message: "Conversation ended successfully",
      },
    });
  } catch (error) {
    console.error("End conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to end conversation",
    });
  }
};

module.exports = {
  startConversation,
  sendMessage,
  getConversationHistory,
  requestHandoff,
  endConversation,
};
