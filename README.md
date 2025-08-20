# ReAct Product Comparison Agent

An intelligent **ReAct (Reasoning and Acting)** agent powered by **DeepSeek-R1:1.5b** that systematically analyzes and compares products between Amazon and Flipkart using a step-by-step reasoning approach.

## 🧠 What is ReAct?

**ReAct** combines **Reasoning** and **Acting** in language models:

- **Reasoning**: The agent thinks through problems step by step
- **Acting**: The agent uses tools to gather information
- **Observing**: The agent analyzes results before proceeding

This creates a more systematic and transparent decision-making process compared to simple chat agents.

## 🔧 How This Agent Works

The ReAct agent follows this pattern for every product comparison:

1. **🤔 Reasoning**: "I need to analyze this product's features first"
2. **🛠️ Acting**: Uses `analyze_product_features` tool
3. **👀 Observing**: Reviews the analysis results
4. **🤔 Reasoning**: "Now I need price information"
5. **🛠️ Acting**: Uses `research_price_trends` tool
6. **👀 Observing**: Analyzes price patterns
7. **🤔 Reasoning**: "Finally, I should check customer experience"
8. **🛠️ Acting**: Uses `analyze_customer_experience` tool
9. **👀 Observing**: Evaluates service quality
10. **🎯 Final Answer**: Provides comprehensive recommendation

## 🛠️ Available Tools

The agent has access to three specialized tools:

### 1. 🔍 Product Analysis Tool

- Analyzes features, specifications, and selling points
- Evaluates build quality and brand reputation
- Reviews user ratings and availability

### 2. 💰 Price Research Tool

- Researches pricing patterns and trends
- Compares promotional strategies
- Identifies best deal opportunities

### 3. 🏪 Customer Experience Tool

- Analyzes delivery and return policies
- Compares customer service quality
- Evaluates payment and exchange options

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- [Ollama](https://ollama.com/download) installed
- DeepSeek-R1:1.5b model downloaded

### Setup

```bash
# 1. Download and start Ollama with DeepSeek
ollama pull deepseek-r1:1.5b
ollama serve

# 2. Install dependencies
npm install

# 3. Run the ReAct agent
npm run dev
```

## 🎮 Usage Example

```bash
$ npm run dev

🤖 ReAct Product Comparison Agent

🧠 Reasoning + Acting Framework for Intelligent Product Analysis

🔧 Using: DeepSeek-R1:1.5b ReAct Agent (Reasoning & Acting)

🛍️  Enter product to compare (Amazon vs Flipkart): iPhone 15 Pro

🔍 Starting ReAct analysis for: "iPhone 15 Pro"

📝 The agent will reason through the problem step by step...

================================================================================

> Entering new AgentExecutor chain...

Thought: I need to analyze the iPhone 15 Pro systematically. Let me start by understanding its key features and specifications.

Action: analyze_product_features
Action Input: iPhone 15 Pro

Observation: PRODUCT ANALYSIS: iPhone 15 Pro
KEY FEATURES TO ANALYZE:
- Price range and value proposition
- Technical specifications
- Build quality and materials
- Brand reputation and warranty
- User reviews and ratings
- Availability and variants...

Thought: Now I have the product analysis. I should research the pricing trends to understand how Amazon and Flipkart typically price this product.

Action: research_price_trends
Action Input: iPhone 15 Pro

Observation: PRICE RESEARCH: iPhone 15 Pro
PRICING PATTERNS:
- Amazon typically offers: Competitive base prices, Prime member discounts...

Thought: Good, I have pricing information. Now I need to analyze the customer experience on both platforms.

Action: analyze_customer_experience
Action Input: iPhone 15 Pro

Observation: CUSTOMER EXPERIENCE ANALYSIS: iPhone 15 Pro
AMAZON EXPERIENCE:
✅ Pros: Prime delivery, easy returns...

Thought: I now have comprehensive information about the iPhone 15 Pro across all important factors. Let me provide a final recommendation.

Final Answer: Based on my systematic analysis of the iPhone 15 Pro...

================================================================================
🎯 FINAL COMPARISON RESULT:
================================================================================
[Detailed comparison and recommendation]
================================================================================

✅ ReAct agent analysis completed!
💭 Notice how the agent reasoned through each step using tools
```

## 🎯 Key Benefits

### Compared to Simple Chat Agents:

| Feature                   | Chat Agent | ReAct Agent              |
| ------------------------- | ---------- | ------------------------ |
| **Reasoning Process**     | Hidden     | ✅ **Transparent**       |
| **Tool Usage**            | None       | ✅ **Specialized Tools** |
| **Systematic Analysis**   | Random     | ✅ **Step-by-step**      |
| **Decision Traceability** | No         | ✅ **Full Audit Trail**  |
| **Error Recovery**        | Poor       | ✅ **Self-correcting**   |

### Why ReAct is Better:

- 🔍 **Methodical**: Follows logical reasoning steps
- 🛠️ **Tool-powered**: Uses specialized tools for analysis
- 📊 **Transparent**: Shows thinking process
- 🎯 **Focused**: Structured approach reduces hallucination
- 🔄 **Iterative**: Can refine analysis through multiple steps

## 📊 Project Structure

```
├── src/
│   └── index.ts          # ReAct agent implementation
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md            # This file
```

## 🧪 How to Extend

### Adding New Tools

```typescript
const newTool = new DynamicTool({
  name: "tool_name",
  description: "What this tool does",
  func: async (input: string) => {
    // Tool logic here
    return "Tool result";
  },
});
```

### Customizing Reasoning

Modify the prompt template in `createReactAgent` to change how the agent reasons through problems.

## 🔧 Available Scripts

- `npm run dev` - Start the ReAct agent
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled version
- `npm run clean` - Clean build files

## 🚨 Troubleshooting

### Agent Not Working

- ✅ Ensure Ollama is running: `ollama serve`
- ✅ Check model is available: `ollama list`
- ✅ Test model directly: `ollama run deepseek-r1:1.5b "Hello"`

### Reasoning Loops

- The agent may iterate several times - this is normal
- If stuck, it will stop after max iterations (5)
- Verbose mode shows all reasoning steps

### Tool Errors

- Tools are simulated for demo purposes
- In production, connect to real APIs for live data

## 🌟 Why ReAct Agents Matter

ReAct agents represent a significant advancement in AI reasoning:

1. **🧠 Explainable AI**: See exactly how decisions are made
2. **🔧 Tool Integration**: Combine LLM reasoning with external tools
3. **🎯 Better Accuracy**: Systematic approach reduces errors
4. **🔄 Self-correction**: Can revise decisions based on new information
5. **📈 Scalable**: Easy to add new tools and capabilities

This makes them ideal for complex tasks like product comparison, research, analysis, and decision-making where transparency and accuracy are crucial.
