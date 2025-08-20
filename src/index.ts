import { ChatOllama } from "@langchain/ollama";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { PromptTemplate } from "@langchain/core/prompts";
import * as readline from "readline";
import { universitySearchTool } from "./tools/university-search";

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
    const tools = [universitySearchTool];

    // Create a custom ReAct prompt template
    const reactPrompt = PromptTemplate.fromTemplate(`
You are an assistant that is resposible for helping the user find best universities in the given location/country.

Instructions:
1. ALWAYS start by reasoning about what information you need
2. Use tools to gather specific information
3. Observe the results and reason about next steps
4. Continue until you have enough information for a comprehensive comparison
5. Provide a final recommendation based on your analysis

Available tools: {tools}
Tool names: {tool_names}

You must follow this process to come to conclusion:

Question: The original question that was asked to you.
Thought: Your thoughts about what you are doing.
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Final Answer: the final answer to the original input question

Output format:
1) You must only include Final answer in your response
2) Must describe the count of total results
3) Must be in bulletins, arranged alphabetically.
2) Must include, country name, university name, university website link.

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

  async searchUniversities(country: string): Promise<string> {
    const question = `Find the best universities in ${country}. I want to know about the top universities with their details including names, websites, and locations.`;

    try {
      const result = await this.agent.invoke({
        input: question,
      });

      return result.output;
    } catch (error) {
      console.error("Error in ReAct agent:", error);
      return `I encountered an error while searching universities in ${country}. Please make sure Ollama is running with the DeepSeek model.`;
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
  console.log("🤖 ReAct University Search Agent\n");
  console.log(
    "🧠 Reasoning + Acting Framework for University Discovery\n"
  );

  const agent = new ReActProductAgent();
  console.log(`🔧 Using: ${agent.getModelInfo()}\n`);

  try {
    const country = await askQuestion(
      "🏫 Enter country name to search for universities: "
    );

    if (!country) {
      console.log("❌ No country name provided. Exiting...");
      return;
    }

    console.log(`\n🔍 Starting ReAct analysis for universities in: "${country}"\n`);
    console.log(
      "📝 The agent will reason through the problem step by step...\n"
    );
    console.log("=".repeat(80));

    const result = await agent.searchUniversities(country);

    console.log("\n" + "=".repeat(80));
    console.log("🎯 UNIVERSITY SEARCH RESULTS:");
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
