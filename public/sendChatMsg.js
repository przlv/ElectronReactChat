const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/chat/completions';

document.addEventListener("DOMContentLoaded", function () {
    const messageInput = document.querySelector("input[type='text']");
    const dialog = document.querySelector(".dialog");

    function createMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        if (sender === "user") {
            messageDiv.classList.add("sent");
        } else {
            messageDiv.classList.add("received");
        }

        const messageText = document.createElement("div");
        messageText.classList.add("message-text");
        messageText.textContent = text;

        messageDiv.appendChild(messageText);
        dialog.appendChild(messageDiv);
        dialog.scrollTop = dialog.scrollHeight;
    }

    function createChatGptResponse(text) {
        const chatGptResponseDiv = document.createElement("div");
        chatGptResponseDiv.classList.add("message-received");

        const iconDiv = document.createElement("div");
        iconDiv.classList.add("icon");

        const messageSenderDiv = document.createElement("div");
        messageSenderDiv.classList.add("message-sender");

        const messageTextDiv = document.createElement("div");
        messageTextDiv.classList.add("message-text");
        messageTextDiv.classList.add("text-received");
        messageTextDiv.textContent = text;

        chatGptResponseDiv.appendChild(iconDiv);
        chatGptResponseDiv.appendChild(messageSenderDiv);
        chatGptResponseDiv.appendChild(messageTextDiv);

        dialog.appendChild(chatGptResponseDiv);
        dialog.scrollTop = dialog.scrollHeight;
    }

    async function sendMessageToChatGpt(text) {
        try {
            const response = await axios.post(apiUrl, {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are ChatGPT, a large language model trained by OpenAI.'
                    },
                    {
                        role: 'user',
                        content: text,
                    },
                ],
                temperature: 0.7,
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            const responseData = response.data;
            if (responseData.choices && responseData.choices.length > 0) {
                const chatGptResponse = responseData.choices[responseData.choices.length - 1].message.content;
                createChatGptResponse(chatGptResponse);
            } else {
                console.error('Пустой ответ от GPT-3 API');
            }
        } catch (error) {
            console.error('Ошибка при запросе к GPT-3 API:', error);
        }
    }

    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText !== "") {
            createMessage(messageText, "user");
            messageInput.value = "";
            sendMessageToChatGpt(messageText);
        }
    }

    messageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            sendMessage();
            event.preventDefault();
        }
    });
});
