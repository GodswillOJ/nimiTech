//chatController.js

const { v4: uuidv4 } = require("uuid");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const aiService = require("../services/aiService");
const {
  sendHandoffAdminNotification,
  sendHandoffUserConfirmation,
} = require("../services/emailService");

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
    const { sessionId, content, sender = "user", userInfo } = req.body;

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

    // Format messages for AI context
    const formattedMessages = recentMessages.reverse().map(msg => ({
      sender: msg.sender,
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    // Generate AI response with enhanced parameters for handoff system
    const aiResponse = await aiService.generateResponse(
      content,
      formattedMessages,
      sessionId,
      userInfo
    );

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
    const { sessionId, reason, userInfo: requestUserInfo } = req.body;
    console.log(`🎫 Handoff request received for sessionId: ${sessionId}`);
    console.log(`📝 Request userInfo:`, requestUserInfo);

    const conversation = await Conversation.findOne({ sessionId });
    if (!conversation) {
      console.error(`❌ Conversation not found for sessionId: ${sessionId}`);
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Get conversation history for context
    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(10);

    // Use userInfo from request body if available, otherwise fall back to default
    const userInfo = requestUserInfo || {
      name: "User",
      email: null,
    };

    console.log(`✅ Conversation found:`, {
      id: conversation._id,
      userInfo: userInfo,
      userName: userInfo.name,
      userEmail: userInfo.email,
      messages,
    });

    // Update conversation with user info if provided in request
    if (requestUserInfo && (requestUserInfo.name || requestUserInfo.email)) {
      conversation.userInfo = requestUserInfo;
      if (requestUserInfo.name) conversation.userName = requestUserInfo.name;
      if (requestUserInfo.email) conversation.userEmail = requestUserInfo.email;
      await conversation.save();
      console.log(`💾 Updated conversation with user info:`, requestUserInfo);
    }

    console.log(`👤 User info:`, userInfo);

    // Validate email before proceeding
    if (!userInfo.email || typeof userInfo.email !== "string" || userInfo.email.trim() === "") {
      console.log(`⚠️ No valid email address found for user. UserInfo:`, userInfo);

      // Create a prompt message asking for email instead of returning an error
      const emailPromptMessage = new Message({
        conversationId: conversation._id,
        sender: "ai",
        content:
          "I'd be happy to connect you with a human agent! To proceed, I'll need your email address so our team can reach out to you. Could you please provide your email address?",
        metadata: {
          requiresEmail: true,
          handoffRequested: true,
        },
      });
      await emailPromptMessage.save();

      return res.status(200).json({
        success: true,
        data: {
          message: "Email address required for handoff",
          content: emailPromptMessage.content,
          requiresEmail: true,
        },
      });
    }

    // Generate unique ticket ID only after email validation
    const generateTicketId = () => {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      return `NIMI-${timestamp}-${random}`.toUpperCase();
    };

    const ticketId = generateTicketId();
    console.log(`🎫 Generated ticket ID: ${ticketId}`);

    // Validate all required parameters for email sending
    if (!ticketId || !userInfo.email || !userInfo.name) {
      console.error(`❌ Missing required parameters for email sending:`, {
        ticketId: !!ticketId,
        email: !!userInfo.email,
        name: !!userInfo.name,
      });
      return res.status(400).json({
        success: false,
        message: "Missing required information for handoff request",
      });
    }

    // Update conversation status to pending initially
    conversation.status = "pending";
    conversation.ticketId = ticketId;
    await conversation.save();

    // Create the response content
    const responseContent = `Perfect! I've created a ticket ID for you and our team will get in touch with you shortly via email. Your ticket ID is: **${ticketId}**. Is there anything else I can help you with?`;

    // Add handoff message with ticket ID
    const handoffMessage = new Message({
      conversationId: conversation._id,
      sender: "ai",
      content: responseContent,
      metadata: {
        handoffTrigger: true,
        ticketId: ticketId,
        emailStatus: "pending",
      },
    });
    await handoffMessage.save();

    // Send emails asynchronously (don't wait for completion)
    console.log(`📧 Initiating async email sending to: ${userInfo.email}`);
    
    // Send emails in background without blocking the response
    const sendEmailsAsync = async () => {
      try {
        console.log({
          ticketId,
          userEmail: userInfo.email,
          userName: userInfo.name,
          messages: messages.map(msg => ({
            content: msg.content,
            sender: msg.sender,
            timestamp: msg.timestamp,
          })),
        });
        
        const emailPromises = [
          sendHandoffUserConfirmation(ticketId, userInfo.email, userInfo.name),
          sendHandoffAdminNotification(ticketId, userInfo.email, userInfo.name, messages),
        ];

        const emailResults = await Promise.all(emailPromises);
        const emailSent = emailResults.every(result => result === true);

        // Update conversation status based on email results
        const updatedConversation = await Conversation.findById(conversation._id);
        if (updatedConversation) {
          updatedConversation.status = emailSent ? "transferred" : "email_failed";
          updatedConversation.emailStatus = emailSent ? "success" : "failed";
          await updatedConversation.save();
        }

        if (emailSent) {
          console.log(`✅ All handoff emails sent successfully for ticket ${ticketId}`);
          console.log(`✅ Updated conversation status to 'transferred' for ticket ${ticketId}`);
        } else {
          console.warn(`⚠️ Some handoff emails failed for ticket ${ticketId}`);
          console.log("Email results:", emailResults);
          console.log(`⚠️ Updated conversation status to 'email_failed' for ticket ${ticketId}`);
        }
      } catch (error) {
        console.error(`❌ Async email sending error for ticket ${ticketId}:`, error);
        if (error && typeof error === "object") {
          console.error("Error details:", {
            message: error.message,
            code: error.code,
            stack: error.stack,
            command: error.command,
            response: error.response,
          });
        }
        
        // Update conversation status to indicate email failure
        try {
          const updatedConversation = await Conversation.findById(conversation._id);
          if (updatedConversation) {
            updatedConversation.status = "email_failed";
            updatedConversation.emailStatus = "failed";
            await updatedConversation.save();
            console.log(`❌ Updated conversation status to 'email_failed' for ticket ${ticketId}`);
          }
        } catch (updateError) {
          console.error(`❌ Failed to update conversation status for ticket ${ticketId}:`, updateError);
        }
      }
    };
    
    // Start email sending in background
    sendEmailsAsync();

    // Emit handoff event
    const io = req.app.get("io");
    if (io) {
      io.to(sessionId).emit("handoff_initiated", {
        message: `Ticket created: ${ticketId}. Our team will contact you shortly.`,
        estimatedWaitTime: "Within 24 hours",
        ticketId: ticketId,
      });
    }

    // Return immediately with pending status
    const responseData = {
      success: true,
      data: {
        message: "Handoff request processed successfully",
        status: "pending", // Status starts as pending
        ticketId: ticketId,
        emailStatus: "pending", // Email processing status
        content: responseContent,
        userInfo: {
          name: userInfo.name,
          email: userInfo.email,
        },
      },
    };

    console.log(`🚀 Sending immediate response with pending status:`, responseData);
    res.status(200).json(responseData);
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
