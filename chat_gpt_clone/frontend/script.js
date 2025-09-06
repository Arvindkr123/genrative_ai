const input = document.getElementById('input');
const chatContainer = document.getElementById('chatContainer');
const askButton = document.getElementById('ask');
const welcomeMsg = document.getElementById('welcomeMsg');
const userMessageTextArea = document.getElementById('userMessageTextArea');

const threadId = Date.now().toString(36) + Math.random().toString(36).substring(2,10);


input.addEventListener('keyup', handEnter)
askButton.addEventListener('click', handAskButtonClick)
const loaderDiv = document.createElement('div');
loaderDiv.className = 'my-6 animate-pulse';
loaderDiv.textContent = 'Thinking...';

async function handEnter(e) {
    if (e.key === 'Enter') {
        const text = input?.value.trim()
        if (!text) {
            return;
        }
        await generate(text)
    }
}

async function handAskButtonClick(e) {
    const text = input?.value.trim()
    if (!text) {
        return;
    }
    await generate(text)
}

async function generate(text) {
    chatContainer.className = 'container mx-auto max-w-3xl pb-44 px-2';
    userMessageTextArea.classList = 'fixed inset-x-0 bottom-0 flex justify-center items-center bg-neutral-900'
    welcomeMsg.remove();


    const msg = document.createElement('div');
    msg.className = 'my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit';
    msg.textContent = text;
    input.value = ''
    chatContainer.appendChild(msg)

    // call to ther server
    chatContainer.appendChild(loaderDiv);
    const assistantRes = await callServer(text);
    const AssistantContantEle = document.createElement('div');
    AssistantContantEle.className = 'max-w-fit';
    AssistantContantEle.textContent = assistantRes?.message;
    loaderDiv.remove()
    chatContainer.appendChild(AssistantContantEle)
}


async function callServer(inputText) {
    try {
        const res = await fetch('http://localhost:3001/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: inputText, threadId })
        })
        return res.json();
    } catch (error) {
        console.log(error)
    }
}