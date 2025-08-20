import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

class LangChainAgent {
  private model: ChatOllama;
  private outputParser: StringOutputParser;

  constructor() {
    this.model = new ChatOllama({
      model: "deepseek-r1:1.5b",
      baseUrl: "http://localhost:11434",
      temperature: 0.7,
    });

    this.outputParser = new StringOutputParser();
  }

  async simpleChat(message: string): Promise<string> {
    try {
      const response = await this.model.invoke([
        new SystemMessage("You are a helpful AI assistant."),
        new HumanMessage(message),
      ]);

      return this.outputParser.invoke(response);
    } catch (error) {
      console.error("Error in simple chat:", error);
      return "Sorry, I encountered an error processing your request.";
    }
  }

  async chainExample(topic: string): Promise<string> {
    try {
      // Create a prompt template
      const promptTemplate = ChatPromptTemplate.fromMessages([
        [
          "system",
          "You are an expert teacher who explains complex topics in simple terms.",
        ],
        [
          "human",
          "Explain {topic} in a way that a beginner can understand. Include key concepts and practical applications.",
        ],
      ]);

      // Create a chain
      const chain = promptTemplate.pipe(this.model).pipe(this.outputParser);

      // Execute the chain
      const result = await chain.invoke({ topic });
      return result;
    } catch (error) {
      console.error("Error in chain example:", error);
      return "Sorry, I encountered an error processing your request.";
    }
  }

  getModelInfo(): string {
    return "DeepSeek-R1:1.5b (Local via Ollama)";
  }
}

async function main() {
  console.log("🚀 Starting DeepSeek Agent...\n");

  const agent = new LangChainAgent();
  console.log(`🤖 Using model: ${agent.getModelInfo()}\n`);

  console.log("=== Simple Chat Example ===");
  const chatResponse = await agent.simpleChat(
    "What is artificial intelligence?"
  );
  console.log("🤖 AI Response:", chatResponse);
  console.log();

  console.log("=== Chain Example ===");
  const chainResponse = await agent.chainExample("machine learning");
  console.log("📚 Educational Response:", chainResponse);
  console.log();

  console.log("✅ DeepSeek agent completed successfully!");
}

// Run the main function
main().catch((error) => {
  console.error("❌ Application error:", error);
  process.exit(1);
});
