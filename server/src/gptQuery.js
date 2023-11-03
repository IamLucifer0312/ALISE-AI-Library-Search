const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const axios = require("axios");
const maxReadmeLength = 50;

// const INITIAL_PROMPT = "You are an assistant that recommends open-source Github libraries/tools/projects based on users' queries. When the user describes a problem, extract relevant keywords from this prompt so that the system can search GitHub repositories. You should tell the user that you are trying to find results, but the keywords need to be wrapped around <<*  *>> and seperated by a coma only, no spaces. Here is an example of a response: User: I want a library to draw 2D graphics in Python; Assistant: Sure!, I will try to look for what you asked <<*python,graphic,library*>>. When you receive [SEARCHRESULT] from the system, write a brief introduction and a brief description of each repository, wrapped around one single pair of <<*  *>>, with each repository description seperated by a new line. DO NOT DEVIATE FROM THIS FORMAT. YOU MUST FOLLOW THIS FORMAT. Here is the structure for your answer: Here's what I found: <<*This tool is a Java testing library created by x, you can get started by\nThis project is a popular open-source Java testing framework, here's how to get started*>>. Maintain a natural, friendly, and helpful tone to the user."

// const INITIAL_PROMPT = "You are an assistant that recommends open-source Github libraries/tools/projects based on users' queries. When the user describes a problem, you extract relevant keywords from this prompt so that the system can search GitHub repositories. You should tell the user that you are trying to find results, but the keywords need to be wrapped around <<*  *>> and seperated by a coma only, no spaces. Here is an example of a response: Sure!, I will try to look for what you asked <<*keyword1,keyword2*>>. When you see [SEARCHRESULT], write an introduction and guide to getting started for each repository. Maintain a natural, friendly, and helpful tone to the user."

const INITIAL_PROMPT = "You are an assistant that recommends open-source Github libraries/tools/projects based on users' queries. When the user describes a problem, extract relevant keywords from this prompt so that the system can search GitHub repositories. The keywords need to be wrapped around <<*  *>> and seperated by a coma only, no spaces. Here is an example of a response: User: I want a library to draw 2D graphics in Python; Assistant: Sure!, I will try to look for what you asked <<*python,graphic,library*>>. DO NOT DEVIATE FROM THIS FORMAT. YOU MUST FOLLOW THIS FORMAT. When you receive [SEARCHRESULT] from the system, write a brief introduction and a brief description of each repository. Maintain a natural, friendly, and helpful tone to the user."

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
    const keywords = extractStr(response.data.choices[0].message.content).split(",");
    console.log(`Keywords: ${keywords}`);   // DEBUG
    return keywords
}

const giveGPTSearchResults = async (prompt) => {
    console.log("Prompting GPT...");    // DEBUG
    const response = await getGPTResponse("system", prompt);
    return response;
}

const getGPTResponse = async (role, prompt) => {
    try {
        const chatEntry = (role == "user" ? createUserChatEntry(prompt) : createSystemChatEntry(prompt))

        chat.push(chatEntry)

        const response =  await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
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
        console.log(`GPT response:\n ${response.data.choices[0].message.content}`); // DEBUG
        
        chat.push(response.data.choices[0].message)
        
        return response;

    } catch (e) {
        console.log(e.message);
    }
}


const generateSearchResultPrompt = (result) => {
    let prompt = "[SEARCHRESULT] Here's what the search engine found: \n"
    for (let i = 0; i < result.results.length; i++) {
        const repo = result.results[i];
        prompt += `RESULT ${i+1}:\n`;
        prompt += `Owner: ${repo.owner}\n`;
        prompt += `Repo Name: ${repo.repo}\n`;
        prompt += `Repo URL: ${repo.url}\n`;        
        prompt += `README: ${repo.readme.slice(0, maxReadmeLength)}\n`;
        prompt += "\n"
    }
    prompt += `You will to do two tasks, you must also must not list out the search result in any form. First, generate an introduction respond with a natural, friendly, and helpful tone. This respond only contains a sentence saying that these are the results you found then end the respond, you DO NOT list out or compile a list of repositories in the respond, here is an example: "I found some results for xxx. Here they are:". In the second task you will generate for the frontend developer instead of a user, you will generate 1 block containing the descriptions of the GitHub repositories for the regrex parsing system to effectively extract the data, lets call this Res, Res must be correctly written in a customized format, the format will be "<<*Description1%20 Description2%20 Description3*>>". You will write the description of each search repository using ONLY the "README" data from each search result, these descriptions must answer all these questions: "Who made it?, What programming language it is for?, Why is it made?, What does it do?". You will place each description in to Res, they must be placed between "<<*" and "*>>" and will have "%20" at the end. This is the an example of Res: "<<*This library is a open-source testing framework %20 This Library offers rich support for Java testing %20 This project is an experiment in Java web testing*>>". Send the full Res code block in its format after you have completed compiling, you do not mention "Res" in the respond.`;
    return prompt
}

const createJSONfromGPTResponse = (repos, gptMessage) => {
    const reposDescription = parseSearchResults(extractStr(gptMessage));
    for (let i = 0; i < repos.results.length; i++) {
        repos.results[i].desc = reposDescription[i];

        delete repos.results[i].readme;
    }
    
    return repos
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

function parseSearchResults(text){
    return text.split("%20")
}

function extractStr(str) {
    // Extract any string wrapped between <<*  *>>
    var match = str.match(/<<\*(.*?)\*\>>/);
    return match ? match[1].trim() : null;
}

const getChat = () => {
    return chat
}

module.exports = {getKeyWordsFromGPT, generateSearchResultPrompt, giveGPTSearchResults, createJSONfromGPTResponse, getChat} 

