import Groq from "groq-sdk";
import dotenv from "dotenv"
dotenv.config()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


async function main() {
    const completion = await groq.chat.completions.create({
        temperature: 0.8,
        // top_p:0.2,
        // stop:'end',
        // max_completion_tokens:1000,
        // presence_penalty:1,
        // frequency_penalty:1,
        model: "llama-3.3-70b-versatile",
        response_format: {
            type: 'json_object'
        },
        messages: [
            {
                "role": "system",
                "content": `You are Jarvis, a smart review grader. Your task is to analyse given review and return the sentiment. Classify the review as positive, neutral or negative. you must return result should be JSON format.
                example:{'sentiment':'Negative'}
                `
            },
            {
                "role": "user",
                "content": `
                Review: These headphones arrived quickly and look great, but the left earcup stopped working after a week.Sentiment:
                `
            }

        ],
    })
    console.log(completion.choices[0].message.content)
}


main();