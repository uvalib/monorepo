'use strict'

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import { logger, https } from "firebase-functions/v2";

// Bolt js imports for Slack integration
import pkg from '@slack/bolt';
const { App, ExpressReceiver } = pkg;

// Langchain imports for LLM integration
import { ChatOpenAI } from '@langchain/openai';
import { MessagesPlaceholder } from '@langchain/core/prompts';
import { PromptTemplate } from "langchain/prompts";
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
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

const handleConvo = async ({ event, context, say }) => {  

    // Setup the memory store for the conversation
    const memory = new BufferMemory({
        chatHistory: new FirestoreChatMessageHistory({
          collectionName: "chathistory",
          sessionId: context.userId,
          userId: context.userId,
          config: {   
            apiKey: process.env.OUR_FIREBASE_KEY,
            authDomain: "uvalib-api.firebaseapp.com",
            databaseURL: "https://uvalib-api.firebaseio.com",
            projectId: "uvalib-api",
            storageBucket: "uvalib-api.appspot.com",
            messagingSenderId: "602799472461",
            appId: "1:602799472461:web:b00ba08fd6fac9e4" 
          },
        }),
    });

    // Setup the LLM chatbot (OpenAI for now)
    const chat = new ChatOpenAI({openAIApiKey: process.env.OPENAI_API_KEY}); 

    const prompt = new PromptTemplate({
        template: `
    You are a librarian at the University of Virginia Library. Format your responses in Markdown.
    The following is a friendly conversation between a human and an AI. If the AI does not know the answer to a question, it truthfully says it does not know.

        Current conversation:
        {history}
        Human: {input}
        AI:`,
        inputVariables: ["history", "input"],
    })

    // Setup the conversation chain
    const chain = new ConversationChain({ 
        llm: chat, 
        memory,
        prompt,}); 

    
    return chain.invoke({input: event.text});

};


// Listening for app_mention events
app.event('app_mention', async ({ event, context, say }) => {
    logger.log(event);
    logger.log(context);
    const response = await handleConvo({ event, context, say });
    logger.log(response);
    say(response.response);
});

/*
// Listening for message events
app.message(async ({ message, context, say }) => {
    const response = await handleConvo({ event: message, context, say });
    say(response.response);
});
*/

// A simple command handling a prompt
app.command('/hoo-helper-prompt', async ({ command, ack, say, context }) => {
    // Acknowledge request
    await ack();

    logger.log(command)
    logger.log(context);
    
    // Send an immediate response
    const message = await say('Processing your request :dancingdog:');

    const response = await handleConvo({ event: command, say, context });

    logger.log(response);
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
    {secrets: ["SLACK_SIGNING_SECRET","SLACK_BOT_TOKEN","OPENAI_API_KEY","OUR_FIREBASE_KEY"]}, 
    expressReceiver.app);