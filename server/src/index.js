const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const {processPrompt} = require("./controllers/processPrompt")

const express = require("express");
const cors = require('cors')
const app = express();

app.use(cors())
app.use(express.json());

app.post("/prompt", async (req, res) => {
    console.log("Got post request!");
    // return res.status(200).json({message: "Hello"})
    const response = await processPrompt(req, res);
    // return res.status(200).json(response);
})

const PORT = process.env.PORT || 3000

const start = () => {
    app.listen(PORT, console.log(`Server started at port ${PORT}`));
}
start()