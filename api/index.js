
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage for serverless functions
const storage = {
  aiQueries: new Map(),
  sessionStats: new Map(),
  currentQueryId: 1,
  currentStatsId: 1
};

// Create ultimate prompt function
const createUltimatePrompt = (userInput) => {
  return `You are an intelligent AI Assistant that can perform different tasks based on user needs. The tasks include:

1. Answering factual questions — Provide accurate, concise, factual responses to knowledge-based questions.
2. Summarizing text — Given a block of text, extract key points, main ideas, and provide a short summary.
3. Generating creative content — Generate short stories, poems, or ideas with creativity and imagination based on user input.
4. Giving advice — Offer practical, thoughtful suggestions or tips on specific topics when asked.

The user will indicate the task they want in brackets at the beginning, such as:
- [question] What is the capital of France?
- [summary] Summarize this: Artificial Intelligence is transforming industries...
- [creative] Write a short story about a lonely robot.
- [advice] How to improve focus while studying?

Based on the bracket, follow the appropriate style:
- For [question], give direct, factual information.
- For [summary], provide a concise, clear summary.
- For [creative], use your imagination to craft engaging content.
- For [advice], give useful, actionable suggestions.

Always keep the tone human-friendly, clear, and relevant to the task. Respond accordingly:

User: ${userInput}`;
};

// Process AI request function
const processAIRequest = async (request) => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
    throw new Error("OpenAI API key is required but not configured. Please add your API key.");
  }

  try {
    const openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
    });

    const prompt = createUltimatePrompt(request.input);
    console.log(`Processing ${request.taskType} request: ${request.input.substring(0, 100)}...`);

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: request.taskType === "creative" ? 0.8 : 0.3,
    });

    const aiResponse = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
    console.log(`Successfully generated response for ${request.taskType} request`);

    return {
      response: aiResponse,
      taskType: request.taskType
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);

    if (error?.status === 429) {
      throw new Error("OpenAI API quota exceeded. Please add credits to your OpenAI account or wait for quota reset.");
    } else if (error?.status === 401) {
      throw new Error("Invalid OpenAI API key. Please check your API key is correct and active.");
    } else if (error?.status === 403) {
      throw new Error("OpenAI API access forbidden. Please verify your API key permissions.");
    } else if (error?.code === 'insufficient_quota') {
      throw new Error("OpenAI account has insufficient quota. Please add credits to your OpenAI account.");
    }

    if (error instanceof Error) {
      throw new Error(`AI Service Error: ${error.message}`);
    }

    throw new Error("Failed to process AI request. Please check your API configuration.");
  }
};

// Validation schemas
const validateAiRequest = (body) => {
  const { input, taskType } = body;

  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    throw new Error("Input cannot be empty");
  }

  const validTaskTypes = ["question", "summary", "creative", "advice"];
  if (!validTaskTypes.includes(taskType)) {
    throw new Error("Invalid task type");
  }

  return { input: input.trim(), taskType };
};

const validateFeedback = (body) => {
  const { id, isHelpful } = body;

  if (typeof id !== 'number' || id <= 0) {
    throw new Error("Invalid query ID");
  }

  if (typeof isHelpful !== 'boolean') {
    throw new Error("isHelpful must be a boolean");
  }

  return { id, isHelpful };
};

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { input, taskType } = validateAiRequest(req.body);

    // Validate bracket format
    const bracketPattern = new RegExp(`^\\[${taskType}\\]`);
    if (!bracketPattern.test(input)) {
      return res.status(400).json({
        error: `Input must start with [${taskType}] for the selected task type`
      });
    }

    const aiResponse = await processAIRequest({ input, taskType });

    // Store the query in memory
    const id = storage.currentQueryId++;
    const storedQuery = {
      id,
      taskType,
      userInput: input,
      response: aiResponse.response,
      isHelpful: null,
      timestamp: new Date()
    };
    storage.aiQueries.set(id, storedQuery);

    res.json({
      id: storedQuery.id,
      response: aiResponse.response,
      taskType: aiResponse.taskType
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process AI request'
    });
  }
});

// Feedback endpoint
app.post('/api/ai/feedback', async (req, res) => {
  try {
    const { id, isHelpful } = validateFeedback(req.body);

    const query = storage.aiQueries.get(id);
    if (!query) {
      return res.status(404).json({ error: "Query not found" });
    }

    query.isHelpful = isHelpful;
    storage.aiQueries.set(id, query);

    res.json({ success: true, isHelpful });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      error: error.message || 'Failed to submit feedback'
    });
  }
});

// Session stats endpoint
app.get('/api/stats/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const stats = storage.sessionStats.get(sessionId);

    if (!stats) {
      return res.json({
        queriesCount: 0,
        helpfulCount: 0,
        successRate: 0
      });
    }

    const successRate = (stats.queriesCount || 0) > 0
      ? Math.round(((stats.helpfulCount || 0) / (stats.queriesCount || 0)) * 100)
      : 0;

    res.json({
      queriesCount: stats.queriesCount || 0,
      helpfulCount: stats.helpfulCount || 0,
      successRate
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      error: error.message || 'Failed to fetch stats'
    });
  }
});

// Update session stats
app.post('/api/stats/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { queriesCount, helpfulCount } = req.body;

    const existing = storage.sessionStats.get(sessionId);
    if (existing) {
      existing.queriesCount = queriesCount;
      existing.helpfulCount = helpfulCount;
      existing.timestamp = new Date();
      storage.sessionStats.set(sessionId, existing);
    } else {
      const id = storage.currentStatsId++;
      const stats = {
        id,
        sessionId,
        queriesCount,
        helpfulCount,
        timestamp: new Date()
      };
      storage.sessionStats.set(sessionId, stats);
    }

    const stats = storage.sessionStats.get(sessionId);
    const successRate = (stats.queriesCount || 0) > 0
      ? Math.round(((stats.helpfulCount || 0) / (stats.queriesCount || 0)) * 100)
      : 0;

    res.json({
      queriesCount: stats.queriesCount || 0,
      helpfulCount: stats.helpfulCount || 0,
      successRate
    });
  } catch (error) {
    console.error('Update Stats error:', error);
    res.status(500).json({
      error: error.message || 'Failed to update stats'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;