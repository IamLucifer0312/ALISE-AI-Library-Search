const axios = require("axios");

let keywords = ["Java", "2D", "Graphics"]

async function searchGithub(keywords) {
    try {
        let url ='https://api.github.com/search/repositories?q=';
        for (let keyword of keywords) {
            url += keyword + '+';
        }
        url.slice(0, -1);
        const response = await axios.get(url);
        console.log(response.data);
        return response.data;
    } catch (e) {
        console.log(e);
    }
}

searchGithub(keywords);
