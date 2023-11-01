const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const {searchGithub} = require("./phase_2");


const maxNumResults = 6

// Fuctions to extract data from URLs
const extractDataFromURLs = async (reposURLs) => {
  const reposResult = {
    results: []
  };
  let counter = 0

  for (let i = 0; i < reposURLs.length; i++) {
    if (counter == maxNumResults) break
    
    let repo = await createRepoObj(reposURLs[i]);
    if (!repo) {
      continue
    }

    reposResult.results.push(repo);
    counter += 1;
  }
  
  reposResult.count = reposResult.results.length;
  
  return reposResult;
}

const createRecommendationObj = (reposResult, userPrompt) => {
  reposResult.userPrompt = userPrompt;
  return reposResult
}

const createRepoObj = async (url) => {
  const [_, owner, repo] = url.split('/');
  const readme = await getReadme(url);
  if (readme == "error") {
    return null;
  }

  return {
    owner: owner,
    repo: repo,
    url: url,
    readme: readme
  }
}

const { Octokit } = require("@octokit/rest");
const url = require('url');

const getReadme = async (repoUrl) => {
  const path = url.parse(repoUrl).pathname; 
  const [_, owner, repo] = path.split('/');

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
  
  //If there is no readme file it will throw an error
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'README.md',
    });
  
    const readmeText = Buffer.from(data.content, 'base64').toString('utf8');
    return readmeText;
  } catch (error) {
      if (error.response.status == 404) { // No readme error
        return "error"
      }
      console.log(error.message);
      return "error"
  }
}

// // Testing
// let keywords = ["NodeJS", "Testing", "Library"]

// const test = async () => {
//   const urls = await searchGithub(keywords);
//   const extractedData = await extractDataFromURLs(urls);
//   const recommendationObj = createRecommendationObj(extractedData, "I want to test my Java program, I need an easy to use library for that")
//   console.log(recommendationObj);
//   // console.log(extractedData);
// }

// test();

module.exports = {extractDataFromURLs, createRecommendationObj}