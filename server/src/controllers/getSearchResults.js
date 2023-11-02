const axios = require("axios")

const {getKeyWordsFromGPT, generateSearchResultPrompt, giveGPTSearchResults} = require("../gptQuery")
const {searchGithub} = require("../phase_2")
const {extractDataFromURLs, createRecommendationObj} = require("../phase_3")

const processPrompt = async (req, res) => {
    const {userPrompt} = req;

    const keywords = await getKeyWordsFromGPT(userPrompt);
    const urls = await searchGithub(keywords);
    const extractedData = await extractDataFromURLs(urls);
    const recommendationObj = createRecommendationObj(extractedData, userPrompt);

    // Post to recommendation API
    console.log("Ranking relevant results...");    //DEBUG
    const recommendationResponse = await axios.post("http://127.0.0.1:8000/recommend", recommendationObj);
    
    for (let i = 0; i < recommendationResponse.data.count; i++) {
        console.log(recommendationResponse.data.results[i].url);
    }

    const resultPrompt = generateSearchResultPrompt(recommendationResponse.data)
    const gptResponse = await giveGPTSearchResults(resultPrompt);
}

req = {
    userPrompt: "I want a Python library for 2D graphics"
}

processPrompt(req, null)

module.exports = {processPrompt}