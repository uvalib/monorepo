'use strict';

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import { logger, https } from "firebase-functions/v2";

// Bolt js imports for Slack integration
import pkg from '@slack/bolt';
const { App, ExpressReceiver } = pkg;

// Initialize the Bolt app with the signing secret and bot token as an Express app
// secrets are set in the firebase console like `firebase functions:secrets:set SLACK_BOT_TOKEN`
const expressReceiver = new ExpressReceiver({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    endpoints: '/events',
    processBeforeResponse: true,
});
const app = new App({
    receiver: expressReceiver,
    token: process.env.SLACK_BOT_TOKEN || "foobar",
    processBeforeResponse: true,
});

// Global error handler
app.error(logger.log);

// Listening for app_mention events
app.event('app_mention', async ({ event, context, say }) => {
    logger.log(event);
    logger.log(context);
    const response = { response: "Hello World!" };  // Simplified response
    logger.log(response);
    say(response.response);
});

// A simple command handling a prompt
app.command('/hoo-helper-prompt', async ({ command, ack, say, context }) => {
    // Acknowledge request
    await ack();

    logger.log(command);
    logger.log(context);
    
    // Send an immediate response
    const message = await say('Processing your request :dancingdog:');

    const response = { response: "Hello World!" };  // Simplified response

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
    { secrets: ["SLACK_SIGNING_SECRET", "SLACK_BOT_TOKEN"] }, 
    expressReceiver.app);
