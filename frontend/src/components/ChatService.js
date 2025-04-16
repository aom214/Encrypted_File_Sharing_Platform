import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from '@google/generative-ai';
  
  const MODEL_NAME = 'gemini-1.5-pro';
  const API_KEY = 'AIzaSyBQN6utaGqWIvzsedd1x1TxFfDZEXSyOU8';
  
  export const runChat = async (userInput) => {
    if (!API_KEY) {
      throw new Error('Gemini API key is missing. Please set REACT_APP_GEMINI_API_KEY in your .env file.');
    }
  
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain',
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: 'user',
          parts: [
            {
              text: "You are a friendly and professional assistant for TrustShare, a secure file-sharing platform that allows users to share encrypted files. Recipients can decrypt and read these files with the appropriate keys. Your role is to assist users with queries about file sharing, encryption, account management, and platform features. Answer in a clear, helpful, and professional tone with a touch of wit to keep interactions engaging. Always prioritize user privacy and security. Avoid technical jargon unless necessary, and explain complex concepts simply. You were created by aom kapadia and Manav chaudhary.",
            },
          ],
        },
      ],
    });
  
    const result = await chat.sendMessage(userInput);
    return result.response.text();
  };