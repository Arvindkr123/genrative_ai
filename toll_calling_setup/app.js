import Groq from "groq-sdk";
import dotenv from "dotenv";
import readline from "readline"
import { tavily } from "@tavily/core"
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVLIY_WEB_SEARCH_API_KEY });

function askQuestion(rl, query) {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const messages = [
        {
            role: "system",
            content: `
          You are a smart personal assistant who answers questions.
          You have access to the following tools:
          1. webSearch({query}:{query:string}) // Search latest information
        `,
        },
    ]
    while (true) {
        const question = await askQuestion(rl, "You:");
        if (question === "bye") {
            console.log("Assistant: Goodbye!");
            rl.close();
            break;
        }
        messages.push(
            {
                role: "user",
                content: question,
            }
        )
        while (true) {
            const completion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                temperature: 0,
                messages: messages,
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "webSearch",
                            description:
                                "Search the latest information and realtime data from the internet",
                            parameters: {
                                type: "object",
                                properties: {
                                    query: {
                                        type: "string",
                                        description: "The search query to perform search on",
                                    },
                                },
                                required: ["query"],
                            },
                        },
                    },
                ],
                tool_choice: "auto",
            });

            messages.push(completion.choices[0].message)

            const toolCalls = completion.choices[0].message.tool_calls;

            if (!toolCalls) {
                console.log(`Assistant: ${completion.choices[0].message.content}`);
                break;
            }

            for (const tool of toolCalls) {
                const functionName = tool.function.name;
                const functionParams = JSON.parse(tool.function.arguments);

                if (functionName === "webSearch") {
                    const toolResult = await webSearch(functionParams);

                    // add function tool result also to messages
                    messages.push({
                        tool_call_id: tool.id,
                        role: 'tool',
                        name: functionName,
                        content: toolResult
                    })
                }
            }
            // console.log(JSON.stringify(completion.choices[0].message, null, 2))
        }
    }
    rl.close()
}

async function webSearch({ query }) {
    console.log("Calling web search...");
    const response = await tvly.search(query);
    const finalResult = response.results.map((result) => result.content).join('\n\n')
    return finalResult;
}

main();
