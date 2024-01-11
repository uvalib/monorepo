import { LLMSingleActionAgent, AgentExecutor } from "langchain/agents";
import { BaseChain, LLMChain } from "langchain/chains";
import { loadStageAnalyzerChain, loadLibraryConversationChain } from './prompts.js';
import { get_tools } from './tools.js';
import { CustomPromptTemplateForLibrary } from './templates.js';
import { LibraryConvoOutputParser } from './parsers.js';
import { LIBRARY_AGENT_TOOLS_PROMPT } from './prompts.js';
import { CONVERSATION_STAGES } from './stages.js';

export class LibraryGPT extends BaseChain {
  constructor(args) {
    super();

    this.conversation_stage_id = '';
    this.conversation_history = [];
    this.current_conversation_stage = '1';
    this.stage_analyzer_chain = args.stage_analyzer_chain;
    this.library_conversation_utterance_chain = args.library_conversation_utterance_chain;
    this.library_agent_executor = args.library_agent_executor;
    this.use_tools = args.use_tools;
    this.conversation_stage_dict = CONVERSATION_STAGES;
    this.librarian_name = "Library Assistant";
  }

  retrieve_conversation_stage(key = "0") {
    const _key = parseInt(key).toString();
console.log(`retrieve_conversation_stage: ${_key}`);
console.log(this.conversation_stage_dict);
console.log(this.conversation_stage_dict[_key]);
    return this.conversation_stage_dict[_key] || "1";
  }

  seed_agent() {
    this.current_conversation_stage = this.retrieve_conversation_stage("1");
    this.conversation_stage_id = "0";
    this.conversation_history = [];
  }

  async determine_conversation_stage() {
    let text = await this.stage_analyzer_chain.call({
      conversation_history: this.conversation_history.join("\n"),
      current_conversation_stage: this.current_conversation_stage,
      conversation_stage_id: this.conversation_stage_id,
    });

console.log('stage analysis:'); 
console.log(text);

    this.conversation_stage_id = parseInt(text.text).toString();
    this.current_conversation_stage = this.retrieve_conversation_stage(text.text);

//    return text;
    return this.current_conversation_stage;
  }

  human_step(human_input) {
    this.conversation_history.push(`User: ${human_input} <END_OF_TURN>`);
  }

  async step() {
    const res = await this._call({ inputs: {} });
    return res;
  }

  async _call(_values, runManager) {
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
    ai_message = `${this.librarian_name}: ${ai_message}`;
    if (!ai_message.includes("<END_OF_TURN>")) {
      ai_message += " <END_OF_TURN>";
    }
    this.conversation_history.push(ai_message);
    return out_message;
  }

  static async from_llm(llm, verbose, config) {
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

  _chainType() {
    return "library_gpt";
  }

  get inputKeys() {
    return [];
  }

  get outputKeys() {
    return [];
  }
  
}

