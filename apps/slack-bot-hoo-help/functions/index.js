'use strict'
const { logger, https } = require("firebase-functions/v2");
const { App, ExpressReceiver } = require('@slack/bolt');

const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');

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

app.command('/hoo-helper-prompt', async ({ command, ack, say }) => {
    // Acknowledge command request
    await ack();
    
    const chat = new ChatOpenAI({openAIApiKey: process.env.OPENAI_API_KEY});
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a librarian at the University of Virginia Library. Format your responses in Markdown"],
        ["user", "{input}"],
      ]);
    const chain = prompt.pipe(chat);
    const response = await chain.invoke({input: command.text});
    await say({blocks: [{
        type: "section",
        text: {
          type: "mrkdwn",
          text: response.content,
        },
      }]});
//    await say(response.content);
});

app.command('/hoo-helper-echo', async ({ command, ack, say }) => {
    // Acknowledge command request
    await ack();
    await say(`You said "${command.text}"`);
});

// https://{your domain}.cloudfunctions.net/slack/events
exports.slack = https.onRequest(
    {secrets: ["SLACK_SIGNING_SECRET","SLACK_BOT_TOKEN","OPENAI_API_KEY"]}, 
    expressReceiver.app);