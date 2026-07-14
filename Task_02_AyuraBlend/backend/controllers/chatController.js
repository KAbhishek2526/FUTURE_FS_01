const { GoogleGenerativeAI, FunctionCallingMode } = require('@google/generative-ai');
const Lead = require('../models/Lead');

// ─── Gemini client ─────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Current stable model available on all API key types
const GEMINI_MODEL = 'gemini-2.0-flash';


// ─────────────────────────────────────────────────────────────────────
// TOOL DEFINITIONS  (declared to Gemini as callable functions)
// ─────────────────────────────────────────────────────────────────────
const toolDefinitions = [
  {
    name: 'getLeadsByDate',
    description:
      'Fetch all CRM leads created or updated on a specific date. Use when the user asks about leads or purchases on a particular day.',
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'The date to query in ISO 8601 format (YYYY-MM-DD), e.g. "2025-11-24".',
        },
      },
      required: ['date'],
    },
  },
  {
    name: 'getLeadsByStatus',
    description: 'Fetch all CRM leads that currently have a given pipeline status.',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
          description: 'The pipeline status to filter leads by.',
        },
      },
      required: ['status'],
    },
  },
  {
    name: 'getSalesSummary',
    description:
      'Return aggregate pipeline statistics: total leads, status breakdown, top product by value, and total pipeline value. Use when the user asks for a summary, overview, or trends.',
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'searchLeads',
    description: 'Search leads by name, email, phone, or product keyword.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search keyword to look for in name, email, phone, or product fields.',
        },
      },
      required: ['query'],
    },
  },
];

// ─────────────────────────────────────────────────────────────────────
// TOOL EXECUTORS  — actual MongoDB queries
// ─────────────────────────────────────────────────────────────────────
async function runTool(name, args) {
  switch (name) {

    case 'getLeadsByDate': {
      const day   = new Date(args.date);
      const start = new Date(day); start.setUTCHours(0, 0, 0, 0);
      const end   = new Date(day); end.setUTCHours(23, 59, 59, 999);
      const leads = await Lead.find({ createdAt: { $gte: start, $lte: end } })
                              .select('name email status source product value createdAt')
                              .lean();
      return { count: leads.length, leads };
    }

    case 'getLeadsByStatus': {
      const leads = await Lead.find({ status: args.status })
                              .select('name email status source product value createdAt')
                              .lean();
      return { count: leads.length, status: args.status, leads };
    }

    case 'getSalesSummary': {
      const [leads, agg] = await Promise.all([
        Lead.find().select('name status product value').lean(),
        Lead.aggregate([
          {
            $group: {
              _id: '$status',
              count:      { $sum: 1 },
              totalValue: { $sum: '$value' },
            },
          },
        ]),
      ]);

      const byProduct = {};
      for (const l of leads) {
        if (!l.product) continue;
        byProduct[l.product] = (byProduct[l.product] || 0) + (l.value || 0);
      }
      const topProduct = Object.entries(byProduct).sort((a, b) => b[1] - a[1])[0];

      const totalValue = leads.reduce((s, l) => s + (l.value || 0), 0);
      return {
        totalLeads: leads.length,
        totalPipelineValue: totalValue,
        statusBreakdown: agg,
        topProductByValue: topProduct ? { product: topProduct[0], value: topProduct[1] } : null,
      };
    }

    case 'searchLeads': {
      const q = args.query;
      const leads = await Lead.find({
        $or: [
          { name:    { $regex: q, $options: 'i' } },
          { email:   { $regex: q, $options: 'i' } },
          { phone:   { $regex: q, $options: 'i' } },
          { product: { $regex: q, $options: 'i' } },
        ],
      }).select('name email status source product value createdAt').lean();
      return { count: leads.length, query: q, leads };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// ─────────────────────────────────────────────────────────────────────
// POST /api/chat   — Gemini agent with tool calling
// ─────────────────────────────────────────────────────────────────────
exports.chat = async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ message: 'message field is required.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      message: 'AI agent is not configured. Add GEMINI_API_KEY to your .env file.',
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: `You are AyuraBlend CRM Assistant — an expert sales analyst AI.
You have access to the live CRM database through tools. When the user asks about leads, sales, pipeline status, 
trends, or any specific customer data, ALWAYS use the appropriate tool to fetch real data from MongoDB before answering.
Never guess or make up data. Be concise, professional, and data-driven. Format numbers with Indian Rupee (₹) symbol.
Today's date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
      tools: [{ functionDeclarations: toolDefinitions }],
      toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.AUTO } },
    });

    // Convert stored history to Gemini format
    let geminiHistory = history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // 1. Remove any leading 'model' messages (like the welcome text)
    while (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
        geminiHistory.shift();
    }

    // 2. Start the chat with the clean history
    const chat = model.startChat({
        history: geminiHistory,
        generationConfig: {
            maxOutputTokens: 1000,
        },
    });

    let response = await chat.sendMessage(message);
    let candidate = response.response;

    // ── Agentic loop: keep calling tools until model gives a text response ──
    let loopCount = 0;
    while (loopCount < 5) {
      const functionCalls = candidate.functionCalls?.();
      if (!functionCalls || functionCalls.length === 0) break;

      loopCount++;
      const toolResults = await Promise.all(
        functionCalls.map(async (fc) => {
          const result = await runTool(fc.name, fc.args);
          console.log(`[AI] Tool called: ${fc.name}`, JSON.stringify(fc.args));
          return {
            functionResponse: {
              name: fc.name,
              response: result,
            },
          };
        })
      );

      response  = await chat.sendMessage(toolResults);
      candidate = response.response;
    }

    const text = candidate.text();
    return res.status(200).json({ reply: text });

  } catch (err) {
    console.error('[AI Chat] Error:', err.message);

    if (err.message?.includes('API_KEY')) {
      return res.status(401).json({ message: 'Invalid Gemini API key.' });
    }
    if (err.message?.includes('429')) {
      return res.status(429).json({ message: 'Rate limit hit! Please wait a moment for the quota to reset.' });
    }
    return res.status(500).json({ message: 'AI agent error.', error: err.message });
  }
};
