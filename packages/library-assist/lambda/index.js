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
      // Refined prompt with JSON format and increased token limit.
      const prompt = `
  You are a library search assistant. A user typed the query: "${query}". 
  Return exactly 3 alternative search terms or related subject headings as a JSON array.
  Do not include any extra text or commentary.
      `.trim();
  
      const commandInput = {
        modelId: process.env.BEDROCK_MODEL_ID, // e.g. "amazon.titan-text-lite"
        contentType: "application/json",
        body: JSON.stringify({
          inputText: prompt,
          textGenerationConfig: {
            maxTokenCount: 80, // Increased token count
            temperature: 0.2,
          },
        }),
      };
  
      const command = new InvokeModelCommand(commandInput);
      const response = await bedrockClient.send(command);
      console.log("Bedrock raw response:", response);
  
      const decoded = new TextDecoder("utf-8").decode(response.body);
      console.log("Decoded model output:", decoded);
  
      const output = JSON.parse(decoded);
      const rawText = output.results?.[0]?.outputText || "";
  
      // Try to parse rawText as JSON if it looks like an array.
      try {
        const suggestionsArray = JSON.parse(rawText);
        if (Array.isArray(suggestionsArray)) {
          console.log("Final suggestions:", suggestionsArray);
          return suggestionsArray;
        }
      } catch (parseError) {
        console.error("Error parsing output as JSON array:", parseError);
      }
  
      // If JSON parsing fails, fallback to splitting lines.
      let lines = rawText.split("\n").map(line => line.trim()).filter(line => line.length > 0);
      // Remove any preamble if present.
      if (lines.length > 0 && (
        lines[0].toLowerCase().includes("alternative search terms") ||
        lines[0].toLowerCase().includes("help find relevant items")
      )) {
        lines.shift();
      }
  
      console.log("Final suggestions (fallback):", lines);
      return lines;
    } catch (error) {
      console.error("Error calling Bedrock:", error);
      return [
        `Try synonyms of "${query}"`,
        `Consider using subject headings for "${query}"`
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
