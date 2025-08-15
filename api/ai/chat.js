import OpenAI from 'openai';

// In-memory storage for serverless functions
const storage = {
  aiQueries: new Map(),
  currentQueryId: 1
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

// Validation function
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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json({
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
}
