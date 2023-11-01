// const getSearchResults = (searchResults) => {
//     let output = {
//         count: 10,
//         results: [
//                 {
//                 owner: "name",
//                 repo: "repo_name",
//                 url: "url",
//                 }
//             ]
//         }
//     return output    
// }


const extractRepoREADME = (repos) => {
  for (let i = 0; i < repos.results.length; i++) {
    const readmeText = getReadme(repos.results[i].url);
    repos.results[i].readme = readmeText; // Assign new attrb to obj
  }
  return repos
}



const { Octokit } = require("@octokit/rest");
const url = require('url');

const getReadme = async (repoUrl) => {
  const path = url.parse(repoUrl).pathname;
  const [_, owner, repo] = path.split('/');

  const octokit = new Octokit({
    auth: `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`,
  });

  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path: 'README.md',
  });

  const readmeText = Buffer.from(data.content, 'base64').toString('utf8');
  return readmeText;
};

getReadme('https://github.com/username/repo');

