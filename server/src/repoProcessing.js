const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const maxNumResults = 20

// Fuctions to extract data from URLs
const extractDataFromURLs = async (reposURLs) => {
  console.log("Extracting Repo Info..."); // DEBUG
  const reposResult = {
    results: []
  };
  let counter = 0

  for (let i = 0; i < reposURLs.length; i++) {
    if (counter >= maxNumResults) break
    
    let repo = await createRepoObj(reposURLs[i]);
    if (!repo) {
      continue
    }

    reposResult.results.push(repo);
    counter ++;
  }
  
  reposResult.count = reposResult.results.length;
  
  return reposResult;
}

const createRecommendationObj = (reposResult, userPrompt) => {
  reposResult.userPrompt = userPrompt;
  return reposResult
}

const createRepoObj = async (url) => {
  // Define a regular expression pattern to match the owner and repo name
  const pattern = /https:\/\/github\.com\/([^/]+)\/([^/]+)/;

  // Use the `match` method to extract the owner and repo name
  const match = url.match(pattern);

  const owner = match[1];
  const repo = match[2];
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

module.exports = {extractDataFromURLs, createRecommendationObj}