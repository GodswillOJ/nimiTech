const axios = require("axios");
const KnowledgeBase = require("../models/KnowledgeBase");

class AIService {
  constructor() {
    this.apiKey =
      process.env.OPENROUTER_API_KEY;
    this.apiBase = "https://openrouter.ai/api/v1";
    this.model = "deepseek/deepseek-r1:free";
    
    // Response cache for faster repeated queries
    this.responseCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes

    this.systemPrompt = `You are Ken, NimiTech's helpful customer service assistant. You help users with questions about NimiTech's services, which include:
    - Business solutions and consulting
    - Technology services
    - Blog content and insights
    - General inquiries

    Use the provided knowledge base to answer questions accurately. If you cannot find the answer in the knowledge base, politely say so and offer to connect the user with a human agent. Be concise, friendly, and professional. Keep responses brief and to the point for faster interaction.

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
      // Check cache first for faster responses
      const cacheKey = this.generateCacheKey(message, context);
      const cachedResponse = this.getFromCache(cacheKey);
      if (cachedResponse) {
        console.log('🚀 Returning cached response for faster speed');
        return cachedResponse;
      }

      // Check if message should trigger handoff
      const shouldHandoff = this.detectHandoffTrigger(message);

      // Search knowledge base for relevant information (optimized)
      const knowledgeContext = await this.searchKnowledgeBase(message);

      // Prepare context for AI (shortened for speed)
      let contextString = "";
      if (knowledgeContext.length > 0) {
        contextString = `\n\nKnowledge: ${knowledgeContext
          .slice(0, 2) // Limit to 2 most relevant items for speed
          .map(kb => `${kb.title}: ${kb.content.substring(0, 200)}`) // Truncate content
          .join("; ")}`;
      }

      // Prepare conversation history (reduced for speed)
      const conversationHistory = context.slice(-3).map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content.substring(0, 150), // Truncate for speed
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
          temperature: 0.3, // Lower for faster, more consistent responses
          max_tokens: 200, // Reduced from 500 for speed
          top_p: 0.9, // Slightly reduced for speed
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
          timeout: 10000, // 10 second timeout for speed
        }
      );

      const aiResponse =
        response.data.choices[0]?.message?.content ||
        "I apologize, but I encountered an issue processing your request. Please try again.";

      const result = {
        response: aiResponse,
        confidence: 0.8,
        knowledgeBaseRefs: knowledgeContext.map(kb => kb._id),
        handoffTrigger: shouldHandoff,
      };

      // Cache the response for future speed
      this.setCache(cacheKey, result);

      return result;
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

  // Cache helper methods for speed optimization
  generateCacheKey(message, context) {
    const contextHash = context.slice(-2).map(msg => msg.content.substring(0, 50)).join('');
    return `${message.toLowerCase().trim()}_${contextHash}`.replace(/[^a-zA-Z0-9_]/g, '_').substring(0, 100);
  }

  getFromCache(key) {
    const cached = this.responseCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    if (cached) {
      this.responseCache.delete(key); // Remove expired cache
    }
    return null;
  }

  setCache(key, data) {
    // Limit cache size to prevent memory issues
    if (this.responseCache.size > 100) {
      const firstKey = this.responseCache.keys().next().value;
      this.responseCache.delete(firstKey);
    }
    
    this.responseCache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }
}

module.exports = new AIService();
