import { ChatOllama } from "@langchain/ollama";
import { DynamicTool } from "@langchain/core/tools";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { PromptTemplate } from "@langchain/core/prompts";
import * as readline from "readline";

// Create tools that the ReAct agent can use
const createProductTools = () => {
  // Tool for analyzing product features
  const productAnalysisTool = new DynamicTool({
    name: "analyze_product_features",
    description:
      "Analyzes product features, specifications, and key selling points for a given product",
    func: async (productName: string) => {
      return `
PRODUCT ANALYSIS: ${productName}

KEY FEATURES TO ANALYZE:
- Price range and value proposition
- Technical specifications
- Build quality and materials
- Brand reputation and warranty
- User reviews and ratings
- Availability and variants

PLATFORM-SPECIFIC FACTORS:
- Amazon: Prime delivery, return policy, customer reviews, seller ratings
- Flipkart: Plus delivery, exchange offers, local service centers, payment options

This analysis provides foundation for comparing ${productName} across platforms.
      `.trim();
    },
  });

  // Tool for price comparison research
  const priceComparisonTool = new DynamicTool({
    name: "research_price_trends",
    description:
      "Researches typical price trends and offers for products on Amazon vs Flipkart",
    func: async (productName: string) => {
      return `
PRICE RESEARCH: ${productName}

PRICING PATTERNS:
- Amazon typically offers: Competitive base prices, Prime member discounts, lightning deals
- Flipkart typically offers: Festival sales, exchange bonuses, cashback offers, EMI options

FACTORS AFFECTING PRICE:
- Seasonal demand variations
- Stock availability
- Seller competition
- Platform-specific promotions
- Brand partnerships

RECOMMENDATION: Check both platforms during sales events for best deals on ${productName}.
      `.trim();
    },
  });

  // Tool for customer experience analysis
  const customerExperienceTool = new DynamicTool({
    name: "analyze_customer_experience",
    description:
      "Analyzes customer service, delivery, and post-purchase experience on both platforms",
    func: async (productName: string) => {
      return `
CUSTOMER EXPERIENCE ANALYSIS: ${productName}

AMAZON EXPERIENCE:
✅ Pros: Prime delivery, easy returns, reliable customer service, extensive review system
❌ Cons: Premium costs, potential counterfeit issues with third-party sellers

FLIPKART EXPERIENCE:
✅ Pros: Competitive pricing, strong local presence, flexible payment options, exchange programs
❌ Cons: Delivery delays in some areas, inconsistent packaging

CRITICAL FACTORS for ${productName}:
- Return/exchange policy importance
- Delivery speed requirements
- Customer support needs
- Payment preferences
      `.trim();
    },
  });

  return [productAnalysisTool, priceComparisonTool, customerExperienceTool];
};

class ReActProductAgent {
  private agent!: AgentExecutor; // Using definite assignment assertion
  private model: ChatOllama;

  constructor() {
    this.model = new ChatOllama({
      model: "deepseek-r1:1.5b",
      baseUrl: "http://localhost:11434",
      temperature: 0.1, // Lower temperature for more focused reasoning
    });

    this.initializeAgent();
  }

  private async initializeAgent() {
    const tools = createProductTools();

    // Create a custom ReAct prompt template
    const reactPrompt = PromptTemplate.fromTemplate(`
You are a product comparison expert using the ReAct (Reasoning and Acting) framework.

Your goal is to help users compare products between Amazon and Flipkart by reasoning through the problem and using available tools.

INSTRUCTIONS:
1. ALWAYS start by reasoning about what information you need
2. Use tools to gather specific information
3. Observe the results and reason about next steps
4. Continue until you have enough information for a comprehensive comparison
5. Provide a final recommendation based on your analysis

Available tools: {tools}
Tool names: {tool_names}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Question: {input}
{agent_scratchpad}
    `);

    // Create the ReAct agent
    const reactAgent = await createReactAgent({
      llm: this.model,
      tools,
      prompt: reactPrompt,
    });

    this.agent = new AgentExecutor({
      agent: reactAgent,
      tools,
      verbose: true, // Shows the reasoning process
      maxIterations: 5,
      handleParsingErrors: true,
    });
  }

  async compareProduct(productName: string): Promise<string> {
    const question = `Compare ${productName} between Amazon and Flipkart. I want to know which platform offers better value, considering price, delivery, customer service, and overall buying experience. Provide specific recommendations.`;

    try {
      const result = await this.agent.invoke({
        input: question,
      });

      return result.output;
    } catch (error) {
      console.error("Error in ReAct agent:", error);
      return `I encountered an error while analyzing ${productName}. Please make sure Ollama is running with the DeepSeek model.`;
    }
  }

  getModelInfo(): string {
    return "DeepSeek-R1:1.5b ReAct Agent (Reasoning & Acting)";
  }
}

// Function to get user input
function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("🤖 ReAct Product Comparison Agent\n");
  console.log(
    "🧠 Reasoning + Acting Framework for Intelligent Product Analysis\n"
  );

  const agent = new ReActProductAgent();
  console.log(`🔧 Using: ${agent.getModelInfo()}\n`);

  try {
    const productName = await askQuestion(
      "🛍️  Enter product to compare (Amazon vs Flipkart): "
    );

    if (!productName) {
      console.log("❌ No product name provided. Exiting...");
      return;
    }

    console.log(`\n🔍 Starting ReAct analysis for: "${productName}"\n`);
    console.log(
      "📝 The agent will reason through the problem step by step...\n"
    );
    console.log("=".repeat(80));

    const result = await agent.compareProduct(productName);

    console.log("\n" + "=".repeat(80));
    console.log("🎯 FINAL COMPARISON RESULT:");
    console.log("=".repeat(80));
    console.log(result);
    console.log("=".repeat(80));

    console.log("\n✅ ReAct agent analysis completed!");
    console.log(
      "💭 Notice how the agent reasoned through each step using tools"
    );
  } catch (error) {
    console.error("❌ Application error:", error);
    console.log("🔧 Make sure Ollama is running: ollama serve");
    console.log(
      "🔧 Make sure DeepSeek model is available: ollama pull deepseek-r1:1.5b"
    );
  }
}

// Run the main function
main().catch((error) => {
  console.error("❌ Critical error:", error);
  process.exit(1);
});
