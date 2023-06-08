import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useState } from "react";
import "./App.css";

const API_KEY = "INSERT_API_KEY_HERE";

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT",
      sender: "ChatGPT",
      direction: "incoming",
      position: "single"
    },
  ]);
  const [typing, setTyping] = useState(false);

  const handleSend = async (message: any) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
      position: "single"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  const processMessageToChatGPT = async (chatMessages: any[]) => {
    const apiMessages = chatMessages.map((messageObject: { sender: string; message: any; }) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old.",
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        console.log(data.choices[0].message.content);
        const newMessage = {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming",
          position: "single"
        };
        setMessages((prev) => [...prev, newMessage]);
        setTyping(false);
      });
  };

  return (
    <>
      <div className="App">
        <div
          style={{
            position: "relative",
            height: "900px",
            width: "900px",
            backgroundColor: "darkgrey",
          }}
        >
          <MainContainer>
            <ChatContainer>
              <MessageList
                typingIndicator={
                  typing ? (
                    <TypingIndicator content="ChatGPT is typing" />
                  ) : null
                }
              >
                {messages.map((message, i) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  return <Message key={i} model={message as any}></Message>;
                })}
              </MessageList>
              <MessageInput
                placeholder="Type message here..."
                onSend={handleSend}
              ></MessageInput>
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
    </>
  );
}

export default App;