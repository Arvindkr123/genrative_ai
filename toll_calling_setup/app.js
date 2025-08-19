import Groq from "groq-sdk";
import dotenv from "dotenv"
dotenv.config()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


async function main() {
    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        response_format: {
            type: 'json_object'
        },
        messages: [
            {
                "role": "system",
                "content": `I am Jarvis, I personal assistant.`
            },
            {
                "role": "user",
                "content": `What is wheather of mumbai`
            }

        ],
    })
    console.log(completion.choices[0].message.content)
}


main();