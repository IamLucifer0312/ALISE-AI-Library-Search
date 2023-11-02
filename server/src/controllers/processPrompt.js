const axios = require("axios")

const {getKeyWordsFromGPT, generateSearchResultPrompt, giveGPTSearchResults, createJSONfromGPTResponse, getChat} = require("../gptQuery")
const {searchGithub} = require("../githubQuery")
const {extractDataFromURLs, createRecommendationObj} = require("../repoProcessing")

const processPrompt = async (req, res) => {
    const {userPrompt} = req.body;

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
    return res.status(200).json(getChat())
    // const json = createJSONfromGPTResponse(recommendationResponse.data, gptResponse.data.choices[0].message.content)
    // console.log(json);
}

module.exports = {processPrompt}