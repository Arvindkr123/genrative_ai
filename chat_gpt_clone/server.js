import express from "express";
import generate from "./chatbot.js";
import cors from "cors";
import NodeCache from "node-cache";
const app = express();

const port = 3001;
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 })

app.post("/chat", async (req, res) => {
    const { message, threadId } = req.body;
    if (!message && !threadId) {
        res.status(400).json({
            message: 'all fields are required'
        })
        return;
    }
    const generateRes = await generate(message, threadId)
    res.send({ message: generateRes })
})


app.get("/", (req, res) => {
    res.send('Welcome to chatDPT backend')
})


app.listen(port, () => {
    console.log('server is running on port : ', port)
})