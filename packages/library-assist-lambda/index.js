import AWS from 'aws-sdk';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Initialize the Bedrock client.
const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  const routeKey = event.requestContext?.routeKey;
  if (routeKey === '$connect') {
    console.log('Client connected');
    return { statusCode: 200, body: 'Connected.' };
  }
  if (routeKey === '$disconnect') {
    console.log('Client disconnected');
    return { statusCode: 200, body: 'Disconnected.' };
  }

  let body;
  try {
    if (!event.body) throw new Error("No body found in event");
    body = JSON.parse(event.body);
  } catch (error) {
    console.error("Error parsing message body", error);
    return { statusCode: 400, body: "Invalid message format" };
  }

  if (body.action === 'query') {
    const query = body.data;
    // Call Bedrock to generate real suggestions.
    const suggestions = await getSuggestions(query);
    await sendMessageToClient(event.requestContext.connectionId, { suggestions });
  }

  return { statusCode: 200, body: "Message processed" };
};

async function getSuggestions(query) {
    try {
      // Refined prompt: direct the model to produce synonyms or subject headings
      const prompt = `
  You are a library search assistant. A user typed the query: "${query}". 
  Provide 3 alternative search terms or related subject headings that might help the user find relevant items in a library catalog.
  
  Requirements:
  1. Output only the terms themselves (no extra commentary).
  2. Do not reference external web search engines.
  3. Keep it concise and factual.
      `.trim();
  
      // Adjust for Titan-Text Lite or your chosen model
      const commandInput = {
        modelId: process.env.BEDROCK_MODEL_ID, // e.g. "amazon.titan-text-lite"
        contentType: "application/json",
        body: JSON.stringify({
          inputText: prompt,
          textGenerationConfig: {
            maxTokenCount: 50, 
            temperature: 0.2, // lower temperature for more predictable results
            // you can also add topP, stopSequences, etc., if needed
          },
        }),
      };
  
      const command = new InvokeModelCommand(commandInput);
      const response = await bedrockClient.send(command);
  
      // Decode the model's response
      const decoded = new TextDecoder("utf-8").decode(response.body);
      const output = JSON.parse(decoded);
  
      // Example: Titan might return something like output.results[0].outputText
      const rawText = output.results?.[0]?.outputText || "";
  
      // We expect the model to produce something like:
      // 1. SynonymOne
      // 2. SynonymTwo
      // 3. SynonymThree
      // You can parse lines or bullet points. For example:
      const lines = rawText
        .split("\n")
        .map(line => line.replace(/^\d+\.\s*/, "").trim()) // remove "1. " prefix
        .filter(line => line.length > 0);
  
      return lines;
    } catch (error) {
      console.error("Error calling Bedrock:", error);
      // Fallback suggestions
      return [
        `Try synonyms of "${query}"`,
        `Consider using subject headings for "${query}"`,
      ];
    }
  }
  

async function sendMessageToClient(connectionId, message) {
  const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: process.env.WEBSOCKET_ENDPOINT,
  });
  const params = {
    ConnectionId: connectionId,
    Data: JSON.stringify(message),
  };

  try {
    await apiGatewayManagementApi.postToConnection(params).promise();
    console.log(`Message sent to ${connectionId}`);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}
