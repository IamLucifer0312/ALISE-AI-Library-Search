const axios = require("axios");

const INITIAL_PROMPT = "You are an assistant that recommends open-source Github libraries/tools/projects. When the user types in the problem, extract relevant keywords from this prompt so that the system can search Github with them. The extracted keywords should be in JSON format like this: keywords=['word1', 'word2']. Do not provide any other response, just the keywords."
const OPENAI_API_KEY = "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"

let chat = [
    {
        role: "system",
        content:
            INITIAL_PROMPT
    },    
    {
        role: "user",
        content:
            "Im new to Python, I need to draw 2D graphics"
    },
];


const getKeyWordsFromGPT = async (userPrompt) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                temperature: 0.6,
                messages: chat,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );
            const keywords = JSON.parse(response.data.choices[0].message.content)
            console.log(keywords);
    } catch (e) {
        console.log(e);
    }


}

getKeyWordsFromGPT();


