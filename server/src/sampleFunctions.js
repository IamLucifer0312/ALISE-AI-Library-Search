const getKeyWordsFromGPT = (userPrompt) => {
    let res = {
        keywords: ["cum", "sexxxyyy"]
    }
    return res
}

const findWithGHSearchAPI = (keywords) => {
    searchResults = "blabla"
    return searchResults
} 

const extractRepoURLs = (searchResults) => {
    let repos = {
        count: 10,
        results: [
                {
                owner: "name",
                repo: "repo_name",
                url: "url",
                }
            ]
        }

    return repos
}

const extractRepoREADME = (repos) => {
    let repos = {
        count: 10,
        results: [
                {
                owner: "name",
                repo: "repo_name",
                url: "url",
                readme: "blabla"
                }
            ]
        }

    return repos
}

const sendToRecommendationAPI = (userPrompt, repos) =>  {
    // send
    let message = {
        userPrompt: "name",
        repos: {
            count: 10,
            results: [
                    {
                    owner: "name",
                    repo: "repo_name",
                    url: "url",
                    readme: "blabla"
                    }
                ]
            }
    }

    //send message
}