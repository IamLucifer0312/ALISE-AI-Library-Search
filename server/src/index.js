const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const {getKeyWordsFromGPT} = require("./phase_1")

const express = require("express");
const app = express();

app.get("/", async (req, res) => {
    // await getKeyWordsFromGPT(req.prompt)
    res.status(200).json({message: "Hello!"})
})

getKeyWordsFromGPT("Im want to test my Java program, I need an easy to use library for that"); // Execute immediately, just for testing

const PORT = process.env.PORT || 3000

const start = () => {
    app.listen(PORT, console.log(`Server started at port ${PORT}`));
}