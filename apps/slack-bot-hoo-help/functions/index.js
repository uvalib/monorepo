'use strict'
const { logger, https } = require("firebase-functions/v2");
const { App, ExpressReceiver } = require('@slack/bolt');
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

// Handle `/echo` command invocations
app.command('/echo-from-hoo-helper', async ({ command, ack, say }) => {
    // Acknowledge command request
    await ack();

    // Requires:
    // Add chat:write scope + invite the bot user to the channel you run this command
    // Add chat:write.public + run this command in a public channel
    await say(`You said "${command.text}"`);
});

// https://{your domain}.cloudfunctions.net/slack/events
exports.slack = https.onRequest(
    {secrets: ["SLACK_SIGNING_SECRET","SLACK_BOT_TOKEN"]}, 
    expressReceiver.app);