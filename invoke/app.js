import Groq from "groq-sdk";
import dotenv from "dotenv"
dotenv.config()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


async function main() {
    const completion = await groq.chat.completions.create({
        temperature:0.8,
        // top_p:0.2,
        // stop:'end',
        // max_completion_tokens:1000,
        // presence_penalty:1,
        // frequency_penalty:1,
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role:'system',
                content:'You are Jarvis, a smart personal assistant. be always polite.'
            },
            {
                role: "user",
                content: "who are you?",
            },
        ],
    })
    console.log(completion.choices[0].message.content)
}


main();