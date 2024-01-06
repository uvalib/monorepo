'use strict'

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import { logger, https } from "firebase-functions/v2";

// Bolt js imports for Slack integration
import pkg from '@slack/bolt';
const { App, ExpressReceiver } = pkg;

// Langchain imports for LLM integration
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { FirestoreChatMessageHistory } from '@langchain/community/stores/message/firestore';

// Initialize the Bolt app with the signing secret and bot token as an Express app
// secrets are set in the firebase console like `firebase functions:secrets:set SLACK_BOT_TOKEN`
const expressReceiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    endpoints: '/events',
    processBeforeResponse: true,
});
const app = new App({
    receiver: expressReceiver,
    token: process.env.SLACK_BOT_TOKEN||"foobar",
    processBeforeResponse: true,
});

// Global error handler
app.error(logger.log);

// Listening for app_mention events
app.event('app_mention', async ({ event, context, say }) => {
    await say(`Hello, <@${event.user}>!`);
});

// A simple command handling a prompt
app.command('/hoo-helper-prompt', async ({ command, ack, say, context }) => {
    // Acknowledge command request
    await ack();
    
    // Send an immediate response
    const message = await say('Processing your request...');  

    const memory = new BufferMemory({
        chatHistory: new FirestoreChatMessageHistory({
          collectionName: "chathistory",
          sessionId: context.userId, //"lc-example",
          userId: context.userId,
          config: {   
            apiKey: "AIzaSyDsTrjUL9kRug7fw_sNU31cy7JYzJAUvmQ",
            authDomain: "uvalib-api.firebaseapp.com",
            databaseURL: "https://uvalib-api.firebaseio.com",
            projectId: "uvalib-api",
            storageBucket: "uvalib-api.appspot.com",
            messagingSenderId: "602799472461",
            appId: "1:602799472461:web:b00ba08fd6fac9e4" 
          },
        }),
    });

    const chat = new ChatOpenAI({openAIApiKey: process.env.OPENAI_API_KEY});
    const chain = new ConversationChain({ llm: chat, memory});

    const response = await chain.invoke({input: command.text});

//    const prompt = ChatPromptTemplate.fromMessages([
//        ["system", "You are a librarian at the University of Virginia Library. Format your responses in Markdown"],
//        ["user", "{input}"],
//    ]);
    
//    const chain = prompt.pipe(chat);
//    const response = await chain.invoke({input: command.text}); 

    // update the message with the response
    await app.client.chat.update({
        token: context.botToken,
        channel: message.channel,
        ts: message.ts,
        text: response.response,
    });
  
});

// https://{your domain}.cloudfunctions.net/slack/events
export const slack = https.onRequest(
    {secrets: ["SLACK_SIGNING_SECRET","SLACK_BOT_TOKEN","OPENAI_API_KEY"]}, 
    expressReceiver.app);