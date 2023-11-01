const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const axios = require("axios");

const INITIAL_PROMPT = "You are an assistant that recommends open-source Github libraries/tools/projects. When the user types in the problem, extract relevant keywords from this prompt so that the system can search Github with them. The extracted keywords should be in JSON format like this: { keywords: ['word1', 'word2'] }. Do not provide any other response, just the keywords."

let chat = [
    {
        role: "system",
        content:
            INITIAL_PROMPT
    },    
];

const getKeyWordsFromGPT = async (userPrompt) => {
    const response = await getGPTResponse(userPrompt);
    const keywords = JSON.parse(response.data.choices[0].message.content);
    console.log(keywords);
}

const getGPTResponse = async (userPrompt) => {
    try {
        chat.push(createUserChatEntry(userPrompt))

        const response =  await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                temperature: 0.6,
                messages: chat,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                },
            }
        );
        chat.push(response.data.choices[0].message)
        return response;

    } catch (e) {
        console.log(e);
    }
}

const createUserChatEntry = (message) => {
    return {
        role: "user",
        content: message
    }
}

module.exports = {getKeyWordsFromGPT} 

