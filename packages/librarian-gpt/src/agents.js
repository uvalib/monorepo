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