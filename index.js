import OpenAI from "openai"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from 'dotenv'
const app = express()

app.use(bodyParser.json())
app.use(cors())
dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.KEY_CHAT,
})

app.post("/send-message", async (req, res) => {
    const textContent = req.body.content
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: textContent }],
            model: "gpt-3.5-turbo",
            // model: "gpt-4",
        })

        const codeContent = chatCompletion.choices[0].message.content.replace(/```([\s\S]+?)```/g, '<div class="code"><code>$1</code></div>');


        res.json({
            text: {
                role: "assistant",
                content: codeContent
            },
        })
    } catch (error) {
        res.json({
            text: {
                content: error
            }
        })
    }
})

app.post("/create-image", async (req, res) => {
    try {
        const image = await openai.images.generate({
            model: "dall-e-3",
            prompt: req.body.content,
            n: 1,
            size: "1024x1024",
        })
        res.json({
            text: {
                role: "assistant",
                url: image.data[0].url
            }
        })
    } catch (error) {
        console.log(error)
        res.json({
            text: {
                content: error
            }
        })
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`)
})