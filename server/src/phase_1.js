const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const axios = require("axios");
const maxReadmeLength = 50;

const INITIAL_PROMPT = "You are an assistant that recommends open-source Github libraries/tools/projects. When the user types in the problem, extract relevant keywords from this prompt so that the system can search Github with them. The extracted keywords should be a format like this: 'word1', 'word2'. Do not provide any other response, just the keywords."

let chat = [
    {
        role: "system",
        content: INITIAL_PROMPT
    },    
];

const getKeyWordsFromGPT = async (userPrompt) => {
    console.log(`User Prompt: ${userPrompt}`); // DEBUG

    console.log("Prompting GPT...");    // DEBUG
    const response = await getGPTResponse("user", userPrompt);
    const keywords = response.data.choices[0].message.content.split(", ");
    console.log(`Keywords: ${keywords}`);   // DEBUG
    return keywords
}

const giveGPTSearchResults = async (prompt) => {
    console.log("Prompting GPT...");    // DEBUG
    const response = await getGPTResponse("system", prompt);
    return response.data;
}

const getGPTResponse = async (role, prompt) => {
    try {
        const chatEntry = (role == "user" ? createUserChatEntry(prompt) : createSystemChatEntry(prompt))
        chat.push(chatEntry)

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


const generateSearchResultPrompt = (result) => {
    let prompt = "Here's what the search engine found: \n"
    for (let i = 0; i < result.results.length; i++) {
        const repo = result.results[i];
        prompt += `RESULT ${i+1}:\n`;
        prompt += `Owner: ${repo.owner}\n`;
        prompt += `Repo Name: ${repo.repo}\n`;
        prompt += `Repo URL: ${repo.url}\n`;        
        prompt += `Description: ${repo.readme.slice(0, maxReadmeLength)}\n`;
        prompt += "\n"
    }
    prompt += `Please give a summarised presentation of these repo details to the user`;
    return prompt
}

const createUserChatEntry = (message) => {
    return {
        role: "user",
        content: message
    }
}

const createSystemChatEntry = (message) => {
    return {
        role: "system",
        content: message
    }
}

module.exports = {getKeyWordsFromGPT, generateSearchResultPrompt, giveGPTSearchResults} 

