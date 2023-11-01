const axios = require("axios");

async function searchGithub(keywords) {
    try {
        let url ='https://api.github.com/search/repositories?q=';
        for (let keyword of keywords) {
            url += keyword + '+';
        }
        url.slice(0, -1);
        const response = await axios.get(url);
        // console.log(response.data);
        return extractURLs(response.data);
    } catch (e) {
        console.log(e);
    }
}

function extractURLs(data) {
    let urls = [];
    for (let i = 0; i < data.items.length; i++) {
        let value = data.items[i].html_url;
        urls.push(value);
    }
    // console.log(urls);
    return urls;
}

module.exports = {searchGithub}
