const axios = require("axios")

const {getKeyWordsFromGPT, generateSearchResultPrompt, giveGPTSearchResults} = require("../phase_1")
const {searchGithub} = require("../phase_2")
const {extractDataFromURLs, createRecommendationObj} = require("../phase_3")

const getSearchResult = async (req, res) => {
    const {userPrompt} = req;

    const keywords = await getKeyWordsFromGPT(userPrompt);
    const urls = await searchGithub(keywords);
    const extractedData = await extractDataFromURLs(urls);
    const recommendationObj = createRecommendationObj(extractedData, userPrompt);

    const response = await axios.post("http://127.0.0.1:8000/recommend", recommendationObj);
    
    for (let i = 0; i < response.data.count; i++) {
        console.log(response.data.results[i].url);
    }

    const resultPrompt = generateSearchResultPrompt(response.data)
    const gptResponse = await giveGPTSearchResults(resultPrompt);
    console.log(gptResponse.choices[0].message.content);
    // res.json("Testing")
}

req = {
    userPrompt: "I want a Python library for 2D graphics"
}

getSearchResult(req, null)

module.exports = {getSearchResult}