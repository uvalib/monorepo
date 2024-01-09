/*
import { ChatOpenAI } from "@langchain/openai";
import { loadStageAnalyzerChain, loadLibraryConversationChain } from "./prompts.js";

// test the intermediate chains
const verbose = true;
const llm = new ChatOpenAI({ temperature: 0.9 });

const stage_analyzer_chain = loadStageAnalyzerChain(llm, verbose);

const library_conversation_utterance_chain = loadLibraryConversationChain(
  llm,
  verbose
);
*/
import { LLMSingleActionAgent, AgentExecutor } from "langchain/agents";
import { BaseChain, LLMChain } from "langchain/chains";
import { ChainValues } from "langchain/schema";
import { CallbackManagerForChainRun } from "langchain/callbacks";
import { BaseLanguageModel } from "langchain/base_language";
import { loadStageAnalyzerChain, loadLibraryConversationChain, get_tools } from './your_library_setup'; // Import your library setup functions
import { CustomPromptTemplateForLibrary } from './your_custom_prompt_template'; // Import your custom prompt template
import { LibraryConvoOutputParser } from './your_output_parser'; // Import your custom output parser
import { LIBRARY_CONVERSATION_STAGES, LIBRARY_AGENT_TOOLS_PROMPT } from './your_library_constants'; // Import your constants

import { LLMSingleActionAgent, AgentExecutor } from "langchain/agents";
import { BaseChain, LLMChain } from "langchain/chains";
import { ChainValues } from "langchain/schema";
import { CallbackManagerForChainRun } from "langchain/callbacks";
import { BaseLanguageModel } from "langchain/base_language";
import { loadStageAnalyzerChain, loadLibraryConversationChain, get_tools } from './library_setup_functions'; // Replace with actual imports
import { CustomPromptTemplateForLibrary } from './custom_prompt_template'; // Replace with actual import
import { LibraryConvoOutputParser } from './output_parser'; // Replace with actual import
import { LIBRARY_CONVERSATION_STAGES, LIBRARY_AGENT_TOOLS_PROMPT } from './library_constants'; // Replace with actual imports

export class LibraryGPT extends BaseChain {
  conversation_stage_id: string;
  conversation_history: string[];
  current_conversation_stage: string = "1";
  stage_analyzer_chain: LLMChain;
  library_conversation_utterance_chain: LLMChain;
  library_agent_executor?: AgentExecutor;
  use_tools: boolean = false;

  conversation_stage_dict: Record<string, string> = LIBRARY_CONVERSATION_STAGES;

  librarian_name: string = "Alex Morgan"; // Example name

  constructor(args: {
    stage_analyzer_chain: LLMChain;
    library_conversation_utterance_chain: LLMChain;
    library_agent_executor?: AgentExecutor;
    use_tools: boolean;
  }) {
    super();
    this.stage_analyzer_chain = args.stage_analyzer_chain;
    this.library_conversation_utterance_chain = args.library_conversation_utterance_chain;
    this.library_agent_executor = args.library_agent_executor;
    this.use_tools = args.use_tools;
  }

  retrieve_conversation_stage(key = "0") {
    return this.conversation_stage_dict[key] || "1";
  }

  seed_agent() {
    this.current_conversation_stage = this.retrieve_conversation_stage("1");
    this.conversation_stage_id = "0";
    this.conversation_history = [];
  }

  async determine_conversation_stage() {
    let { text } = await this.stage_analyzer_chain.call({
      conversation_history: this.conversation_history.join("\n"),
      current_conversation_stage: this.current_conversation_stage,
      conversation_stage_id: this.conversation_stage_id,
    });

    this.conversation_stage_id = text;
    this.current_conversation_stage = this.retrieve_conversation_stage(text);
    return text;
  }

  human_step(human_input: string) {
    this.conversation_history.push(`User: ${human_input} <END_OF_TURN>`);
  }

  async step() {
    const res = await this._call({ inputs: {} });
    return res;
  }

  async _call(
    _values: ChainValues,
    runManager?: CallbackManagerForChainRun
  ): Promise<ChainValues> {
    let ai_message;
    let res;
    if (this.use_tools && this.library_agent_executor) {
      res = await this.library_agent_executor.call(
        {
          input: "",
          conversation_stage: this.current_conversation_stage,
          conversation_history: this.conversation_history.join("\n"),
          librarian_name: this.librarian_name,
        },
        runManager?.getChild("library_agent_executor")
      );
      ai_message = res.output;
    } else {
      res = await this.library_conversation_utterance_chain.call(
        {
          librarian_name: this.librarian_name,
          conversation_history: this.conversation_history.join("\n"),
          conversation_stage: this.current_conversation_stage,
        },
        runManager?.getChild("library_conversation_utterance")
      );
      ai_message = res.text;
    }

    console.log(`${this.librarian_name}: ${ai_message}`);
    const out_message = ai_message;
    const agent_name = this.librarian_name;
    ai_message = agent_name + ": " + ai_message;
    if (!ai_message.includes("<END_OF_TURN>")) {
      ai_message += " <END_OF_TURN>";
    }
    this.conversation_history.push(ai_message);
    return out_message;
  }

  static async from_llm(
    llm: BaseLanguageModel,
    verbose: boolean,
    config: {
      use_tools: boolean;
      collection_catalog: string;
      librarian_name: string;
    }
  ) {
    const { use_tools, collection_catalog, librarian_name } = config;
    let library_agent_executor;
    let tools;
    if (use_tools) {
      tools = await get_tools(collection_catalog);

      const prompt = new CustomPromptTemplateForLibrary({
        tools,
        inputVariables: [
          "input",
          "intermediate_steps",
          "librarian_name",
          "conversation_history",
        ],
        template: LIBRARY_AGENT_TOOLS_PROMPT,
      });
      const llm_chain = new LLMChain({
        llm,
        prompt,
        verbose,
      });
      const output_parser = new LibraryConvoOutputParser({
        ai_prefix: librarian_name,
      });
      const library_agent_with_tools = new LLMSingleActionAgent({
        llmChain: llm_chain,
        outputParser: output_parser,
        stop: ["\nObservation:"],
      });
      library_agent_executor = AgentExecutor.fromAgentAndTools({
        agent: library_agent_with_tools,
        tools,
        verbose,
      });
    }

    return new LibraryGPT({
      stage_analyzer_chain: loadStageAnalyzerChain(llm, verbose),
      library_conversation_utterance_chain: loadLibraryConversationChain(llm, verbose),
      library_agent_executor,
      use_tools,
    });
  }

  _chainType(): string {
    return "library_gpt";
  }

  get inputKeys(): string[] {
    return [];
  }

  get outputKeys(): string[] {
    return [];
  }
}
