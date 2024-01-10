import { RetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "@langchain/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { ChainTool } from "langchain/tools";
import url from "url";
import path from "path";
import { ChatOpenAI } from "@langchain/openai";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const retrievalLlm = new ChatOpenAI({ temperature: 0, openAIApiKey: process.env.OPENAI_API_KEY||"foobar" });
const embeddings = new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY||"foobar" });

export async function loadLibraryDocVectorStore(FileName) {
  const fullpath = path.resolve(__dirname, `./${FileName}`);
  const loader = new TextLoader(fullpath);
  const docs = await loader.load();
  const splitter = new CharacterTextSplitter({
    chunkSize: 10,
    chunkOverlap: 0,
  });
  const new_docs = await splitter.splitDocuments(docs);
  return HNSWLib.fromDocuments(new_docs, embeddings);
}

export async function setup_knowledge_base(FileName, llm) {
  const vectorStore = await loadLibraryDocVectorStore(FileName);
  const knowledge_base = RetrievalQAChain.fromLLM(
    retrievalLlm,
    vectorStore.asRetriever()
  );
  return knowledge_base;
}

export async function get_tools(library_collection) {
  const chain = await setup_knowledge_base(library_collection, retrievalLlm);
  const tools = [
    new ChainTool({
      name: "CollectionSearch",
      description:
        "useful for when you need to answer questions about library collection information",
      chain,
    }),
  ];
  return tools;
}
