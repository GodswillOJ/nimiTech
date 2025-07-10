const axios = require("axios");
const KnowledgeBase = require("../models/KnowledgeBase");

class AIService {
  constructor() {
    this.apiKey =
      process.env.OPENROUTER_API_KEY;
    this.apiBase = "https://openrouter.ai/api/v1";
    this.model = "deepseek/deepseek-r1:free";

    this.systemPrompt = `You are NimiTech's helpful customer service assistant. You help users with questions about NimiTech's services, which include:
    - Business solutions and consulting
    - Technology services
    - Blog content and insights
    - General inquiries

    Use the provided knowledge base to answer questions accurately. If you cannot find the answer in the knowledge base, politely say so and offer to connect the user with a human agent. Be concise, friendly, and professional.

    If a user wants to:
    - Schedule a meeting/consultation
    - File a complaint
    - Request a refund
    - Get technical support
    - Speak to a human agent
    
    Then respond with: "I'd be happy to connect you with one of our team members who can help you better. Would you like me to arrange that for you?"`;

    this.handoffTriggers = [
      "speak to a human",
      "talk to agent",
      "human agent",
      "customer service",
      "complaint",
      "refund",
      "cancel",
      "problem",
      "issue",
      "help me with",
      "schedule",
      "appointment",
      "meeting",
      "consultation",
    ];
  }

  async generateResponse(message, context = []) {
    try {
      // Check if message should trigger handoff
      const shouldHandoff = this.detectHandoffTrigger(message);

      // Search knowledge base for relevant information
      const knowledgeContext = await this.searchKnowledgeBase(message);

      // Prepare context for AI
      let contextString = "";
      if (knowledgeContext.length > 0) {
        contextString = `\n\nRelevant information from knowledge base:\n${knowledgeContext
          .map(kb => `- ${kb.title}: ${kb.content}`)
          .join("\n")}`;
      }

      // Prepare conversation history
      const conversationHistory = context.slice(-5).map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      const messages = [
        { role: "system", content: this.systemPrompt + contextString },
        ...conversationHistory,
        { role: "user", content: message },
      ];

      const response = await axios.post(
        `${this.apiBase}/chat/completions`,
        {
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://nimitechit.com",
            "X-Title": "NimiTech Chatbot",
          },
        }
      );

      const aiResponse =
        response.data.choices[0]?.message?.content ||
        "I apologize, but I encountered an issue processing your request. Please try again.";

      return {
        response: aiResponse,
        confidence: 0.8,
        knowledgeBaseRefs: knowledgeContext.map(kb => kb._id),
        handoffTrigger: shouldHandoff,
      };
    } catch (error) {
      console.error("AI Service Error:", error.response?.data || error.message);
      return {
        response:
          "I apologize, but I'm experiencing technical difficulties. Let me connect you with a human agent who can help you.",
        confidence: 0,
        knowledgeBaseRefs: [],
        handoffTrigger: true,
      };
    }
  }

  async searchKnowledgeBase(query) {
    try {
      // Simple text search (can be enhanced with embeddings later)
      const results = await KnowledgeBase.find({
        $and: [
          { isActive: true },
          { websiteId: "nimitechit" },
          {
            $or: [
              { title: { $regex: query, $options: "i" } },
              { content: { $regex: query, $options: "i" } },
              { tags: { $in: [new RegExp(query, "i")] } },
            ],
          },
        ],
      })
        .sort({ priority: -1 })
        .limit(3);

      return results;
    } catch (error) {
      console.error("Knowledge Base Search Error:", error);
      return [];
    }
  }

  detectHandoffTrigger(message) {
    const lowerMessage = message.toLowerCase();
    return this.handoffTriggers.some(trigger => lowerMessage.includes(trigger));
  }

  async generateEmbedding(text) {
    // Placeholder for embedding generation
    // Can be implemented with OpenAI's embedding API
    return [];
  }
}

module.exports = new AIService();
