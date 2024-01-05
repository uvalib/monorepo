'use strict'

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const { logger, https } = require("firebase-functions/v2");

// Bolt js imports for Slack integration
const { App, ExpressReceiver } = require('@slack/bolt');

// Langchain imports for LLM integration
const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');

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

    const chat = new ChatOpenAI({openAIApiKey: process.env.OPENAI_API_KEY});
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a librarian at the University of Virginia Library. Format your responses in Markdown"],
        ["user", "{input}"],
      ]);
    const chain = prompt.pipe(chat);
    const response = await chain.invoke({input: command.text}); 

    // update the message with the response
    await app.client.chat.update({
        token: context.botToken,
        channel: message.channel,
        ts: message.ts,
        text: response.content,
    });
  
});

// https://{your domain}.cloudfunctions.net/slack/events
exports.slack = https.onRequest(
    {secrets: ["SLACK_SIGNING_SECRET","SLACK_BOT_TOKEN","OPENAI_API_KEY"]}, 
    expressReceiver.app);