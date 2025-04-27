const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

const { GoogleGenAI } = require("@google/genai");

// In-memory store for conversation history
const conversationHistory = [];

// Define the text content in a separate variable
const getArtDescriptionPrompt = (
  previousDiscussions,
  followUpQuestion = null
) => {
  const styleGuide =
    "Use plain text only - no markdown, asterisks, emojis, or special formatting. Be detailed and engaging.";

  if (followUpQuestion) {
    let contextPrompt =
      "You are Wit, a witty art expert. Provide a comprehensive answer to this question about the artwork: " +
      followUpQuestion +
      "\n\n";

    if (previousDiscussions.length > 0) {
      contextPrompt +=
        "Context from last chat: " +
        previousDiscussions[previousDiscussions.length - 1].summary;
    }

    return contextPrompt + "\n" + styleGuide;
  }

  let contextPrompt =
    "You are Wit, a witty art expert. Share the captivating story behind this artwork - give me just enough detail to make me want to learn more. " +
    styleGuide;

  if (previousDiscussions.length > 0) {
    contextPrompt +=
      "\nPreviously discussed: " +
      previousDiscussions.map((disc) => disc.summary).join(". ");
  }

  return contextPrompt;
};

async function fetchImage(base64ImageData) {
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyDe-nlAWbib3CtiksYRx3WS8LX8VhIb164",
  });

  // Get the prompt with context from conversation history
  const contextualPrompt = getArtDescriptionPrompt(conversationHistory);
  console.log("contextualPrompt", contextualPrompt);

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        inlineData: {
          mimeType: "image/png",
          data: base64ImageData,
        },
      },
      {
        text: contextualPrompt,
      },
    ],
    generationConfig: {
      maxOutputTokens: 500, // Increased to allow for more detailed responses
      temperature: 0.7,
    },
  });
  return result.text;
}

// Increase payload size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

app.post("/test", async (req, res) => {
  try {
    console.log("Received request");
    const imageData = req.body.image;
    const prompt = "No prompt provided";

    if (!imageData) {
      return res.status(400).json({ error: "No image data provided" });
    }
    console.log("Image data received");

    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const filename = `image_${timestamp}.jpg`;
    const filepath = path.join(uploadsDir, filename);

    let base64Data = imageData;
    if (base64Data.includes("base64,")) {
      base64Data = base64Data.split("base64,")[1];
    }
    console.log("Base64 data received");

    fs.writeFileSync(filepath, base64Data, "base64");

    console.log("querying API");
    const capiResponse = await fetchImage(base64Data);

    // Store this conversation in history
    // Keep only the last 3 conversations to maintain relevant context
    if (conversationHistory.length >= 3) {
      conversationHistory.shift(); // Remove oldest conversation
    }
    conversationHistory.push({
      timestamp: new Date(),
      summary: capiResponse,
      imageFile: filename,
    });

    console.log(`Image saved to ${filepath}`);
    console.log(`Prompt received: ${prompt}`);
    console.log(`Caption: ${capiResponse}`);

    res.status(200).json({
      choices: [
        {
          message: {
            content: `${capiResponse}`,
          },
        },
      ],
      conversationHistory: conversationHistory,
    });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Failed to save image" });
  }
});
app.post("/voice", async (req, res) => {
  try {
    console.log("Received voice request");
    const { voiceText } = req.body;
    console.log("Voice text received:", voiceText);

    if (!voiceText) {
      console.log("No voice text provided");
      return res.status(400).json({ error: "No voice text provided" });
    }
    if (!voiceText.toLowerCase().includes("wit")) {
      console.log("Voice text missing 'Wit' keyword");
      return res.status(400).json({
        error: "Voice text must include the word 'Wit'",
      });
    }

    if (conversationHistory.length === 0) {
      console.log("No previous artwork discussion found");
      return res.status(400).json({
        error:
          "No artwork has been discussed yet. Please analyze an artwork first.",
      });
    }

    console.log("Initializing GoogleGenAI");
    const ai = new GoogleGenAI({
      apiKey: "AIzaSyDe-nlAWbib3CtiksYRx3WS8LX8VhIb164",
    });

    // Get the last discussed artwork's base64 data
    const lastImageFile =
      conversationHistory[conversationHistory.length - 1].imageFile;
    console.log("Last image file:", lastImageFile);

    const imagePath = path.join(uploadsDir, lastImageFile);
    console.log("Image path:", imagePath);

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Data = imageBuffer.toString("base64");
    console.log("Image converted to base64");

    const contextualPrompt = getArtDescriptionPrompt(
      conversationHistory,
      voiceText
    );
    console.log("Generated contextual prompt");

    console.log("Querying Gemini API");
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Data,
          },
        },
        {
          text: contextualPrompt,
        },
      ],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });
    console.log("Received response from Gemini API");

    // Add this follow-up conversation to history
    if (conversationHistory.length >= 3) {
      console.log("Removing oldest conversation from history");
      conversationHistory.shift();
    }
    console.log("Adding new conversation to history");
    conversationHistory.push({
      timestamp: new Date(),
      summary: result.text,
      imageFile: lastImageFile,
      question: voiceText,
    });

    console.log("Sending response to client");
    res.status(200).json({
      voiceText: result.text,
    });
    console.log("Response sent to client");
  } catch (error) {
    console.error("Error processing voice text:", error);
    res.status(500).json({ error: "Failed to process voice text" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
