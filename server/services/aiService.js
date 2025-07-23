//server/services/aiService.js

const { Groq } = require("groq-sdk");
const KnowledgeBase = require("../models/KnowledgeBase");
const { SYSTEM_PROMPT } = require("./utils/systemPrompt");
const { sendHandoffAdminNotification, sendHandoffUserConfirmation } = require("./emailService");

class AIService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
    this.model = "meta-llama/llama-4-scout-17b-16e-instruct";

    // Response cache for faster repeated queries
    this.responseCache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes

    this.systemPrompt = SYSTEM_PROMPT;

    // Handoff state management
    this.pendingHandoffs = new Map(); // Store pending handoff requests by sessionId

    this.handoffTriggers = [
      "speak to a human",
      "talk to agent",
      "human agent",
      "customer service",
      "complaint",
      "refund",
      "cancel",
      "technical support",
      "help me",
      "contact team",
      "speak to someone",
      "problem",
      "issue",
      "help me with",
      "schedule",
      "appointment",
      "meeting",
      "consultation",
      "connect me",
      "connect me to",
      "connect with",
      "connect to",
      "transfer me",
      "transfer to",
      "put me through",
      "get me to",
      "direct me to",
      "escalate",
      "escalate to",
      "live agent",
      "real person",
      "human help",
      "human support",
      "speak with a human",
      "speak with an agent",
      "speak with customer service",
      "speak with support",
      "speak with a representative",
      "speak with a real person",
      "speak with a live agent",
      "speak with a real agent",
      "speak with a human agent",
    ];
  }

  async generateResponse(message, context = []) {
    try {
      // Check cache first for faster responses
      const cacheKey = this.generateCacheKey(message, context);
      const cachedResponse = this.getFromCache(cacheKey);
      if (cachedResponse) {
        console.log("🚀 Returning cached response for faster speed");
        return cachedResponse;
      }

      // Check if message should trigger handoff
      const shouldHandoff = this.detectHandoffTrigger(message);

      // Search knowledge base for relevant information (optimized)
      const knowledgeContext = await this.searchKnowledgeBase(message);

      // Prepare context for AI with full content
      let contextString = "";
      if (knowledgeContext.length > 0) {
        contextString = `\n\nKnowledge: ${knowledgeContext
          .slice(0, 2) // Limit to 2 most relevant items for speed
          .map(kb => `${kb.title}: ${kb.content.substring(0, 200)}`) // Truncate content
          .join("; ")}`;
      }

      // Prepare conversation history with full content
      const conversationHistory = context.slice(-3).map(msg => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content, // Use full content
      }));

      const messages = [
        { role: "system", content: this.systemPrompt + contextString },
        ...conversationHistory,
        { role: "user", content: message },
      ];

      const chatCompletion = await this.groq.chat.completions.create({
        messages: messages,
        model: this.model,
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: true,
        stop: null,
      });

      // Collect streaming response with sentence truncation
      let aiResponse = "";
      let lastSentenceEnd = -1;

      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || "";
        aiResponse += content;

        // Check for sentence endings (., !, ?)
        const sentenceEndings = /[.!?]/g;
        let match;
        while ((match = sentenceEndings.exec(aiResponse)) !== null) {
          lastSentenceEnd = match.index;
        }

        // If we have a complete sentence and reasonable length, truncate
        if (lastSentenceEnd > 50 && aiResponse.length > lastSentenceEnd + 1) {
          // Check if there's meaningful content after the punctuation
          const afterPunctuation = aiResponse.substring(lastSentenceEnd + 1).trim();
          if (afterPunctuation.length === 0 || afterPunctuation.split(" ").length < 3) {
            aiResponse = aiResponse.substring(0, lastSentenceEnd + 1).trim();
            break; // Stop streaming at complete sentence
          }
        }
      }

      if (!aiResponse) {
        // Generate context-aware fallback response based on user message
        aiResponse = this.generateContextAwareFallback(message, knowledgeContext);
      }

      // Improved knowledge base reference mapping with error handling
      let knowledgeBaseRefs = [];
      try {
        knowledgeBaseRefs = knowledgeContext
          .map(kb => {
            if (kb && kb._id) {
              return kb._id;
            }
            console.warn("Invalid knowledge base entry found:", kb);
            return null;
          })
          .filter(id => id !== null);
      } catch (mappingError) {
        console.error("Error mapping knowledge base references:", mappingError);
        knowledgeBaseRefs = [];
      }

      const result = {
        response: aiResponse,
        confidence: 0.8,
        knowledgeBaseRefs,
        handoffTrigger: shouldHandoff,
        handoffSuggested: shouldHandoff,
      };

      // Cache the response for future speed (only if not a handoff scenario)
      if (!shouldHandoff) {
        this.setCache(cacheKey, result);
      }

      return result;
    } catch (error) {
      // Enhanced error logging with more details
      console.error("=== AI Service Error Details ===");
      console.error("Error Type:", error.name);
      console.error("Error Message:", error.message);
      console.error("Error Code:", error.code);
      console.error("Response Status:", error.response?.status);
      console.error("Response Data:", error.response?.data);
      console.error("Request Config:", {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout,
        headers: error.config?.headers ? "Present" : "Missing",
      });
      console.error("Stack Trace:", error.stack);
      console.error("=== End AI Service Error ===");
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
      console.log(`🔍 Knowledge Base Search - Original query: "${query}"`);

      // Extract key terms from the query (remove common words)
      const stopWords = [
        "who",
        "is",
        "what",
        "where",
        "when",
        "how",
        "the",
        "a",
        "an",
        "and",
        "or",
        "but",
        "in",
        "on",
        "at",
        "to",
        "for",
        "of",
        "with",
        "by",
      ];
      const keyTerms = query
        .toLowerCase()
        .split(/\s+/)
        .filter(term => term.length > 2 && !stopWords.includes(term))
        .join(" ");

      console.log(`🔍 Knowledge Base Search - Extracted key terms: "${keyTerms}"`);

      // Use both original query and key terms for search
      const searchTerms = keyTerms || query;

      // Enhanced search with multiple strategies
      const searchQueries = [
        // Exact phrase search
        {
          $and: [
            { isActive: { $ne: false } }, // Include docs without isActive field
            { websiteId: "nimitechit" },
            {
              $or: [
                { title: { $regex: searchTerms, $options: "i" } },
                { content: { $regex: searchTerms, $options: "i" } },
                { tags: { $in: [new RegExp(searchTerms, "i")] } },
              ],
            },
          ],
        },
        // Individual word search if no exact matches
        {
          $and: [
            { isActive: { $ne: false } },
            { websiteId: "nimitechit" },
            {
              $or: searchTerms.split(" ").map(term => ({
                $or: [
                  { title: { $regex: term, $options: "i" } },
                  { content: { $regex: term, $options: "i" } },
                  { tags: { $in: [new RegExp(term, "i")] } },
                ],
              })),
            },
          ],
        },
      ];

      let results = [];

      // Try exact search first
      results = await KnowledgeBase.find(searchQueries[0]).sort({ priority: -1 }).limit(3);

      console.log(`🔍 Knowledge Base Search - Exact search results: ${results.length}`);

      // If no exact matches, try individual word search
      if (results.length === 0 && searchTerms.includes(" ")) {
        results = await KnowledgeBase.find(searchQueries[1]).sort({ priority: -1 }).limit(3);
        console.log(`🔍 Knowledge Base Search - Individual word search results: ${results.length}`);
      }

      // Log what we found
      if (results.length > 0) {
        console.log(`🔍 Knowledge Base Search - Found ${results.length} results:`);
        results.forEach((result, index) => {
          console.log(`  ${index + 1}. "${result.title}" (Category: ${result.category})`);
        });
      } else {
        console.log(`🔍 Knowledge Base Search - No results found for "${query}"`);

        // Debug: Let's see what's actually in the database
        const totalCount = await KnowledgeBase.countDocuments({ websiteId: "nimitechit" });
        console.log(`🔍 Knowledge Base Debug - Total entries in DB: ${totalCount}`);

        // Show a few sample entries for debugging
        const sampleEntries = await KnowledgeBase.find({ websiteId: "nimitechit" })
          .select("title category")
          .limit(5);
        console.log(
          `🔍 Knowledge Base Debug - Sample entries:`,
          sampleEntries.map(e => `"${e.title}" (${e.category})`)
        );
      }

      return results;
    } catch (error) {
      console.error("🔍 Knowledge Base Search Error:", error);
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
    const contextHash = context
      .slice(-2)
      .map(msg => msg.content.substring(0, 50))
      .join("");
    return `${message.toLowerCase().trim()}_${contextHash}`
      .replace(/[^a-zA-Z0-9_]/g, "_")
      .substring(0, 100);
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
      timestamp: Date.now(),
    });
  }
}

module.exports = new AIService();
