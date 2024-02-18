import React, { useState } from 'react';
import './chat.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

const API_KEY = "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";
const systemMessage = { "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience." };

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedSkills, setSelectedSkills] = useState('');
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState(0);
  const [llmProvider, setLLMProvider] = useState('');

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    // Format messages for chatGPT API
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === 'ChatGPT' ? 'assistant' : 'user';
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, ...apiMessages],
    };

    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: 'ChatGPT',
          },
        ]);
        setIsTyping(false);
      });
  }

  const renderSteps = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <label>LLM Provider:</label>
            <select
              value={llmProvider}
              onChange={(e) => setLLMProvider(e.target.value)}
            >
              <option value="provider1">Select the Provider</option>
              <option value="openai">OpenAi</option>
            </select>
            &nbsp;&nbsp;&nbsp;
            <label>Model Name:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="model1">Select the model name</option>
              <option value="gpt3.5">gpt-3.5-turbo</option>
            </select>
            <br/>
            <button onClick={handleNextStep}>Next</button>
          </div>
        );
      case 1:
        return (
          <div>
            <label>Choose the Skill Needed:</label>
            <select
              value={selectedSkills}
              onChange={(e) => setSelectedSkills(e.target.value)}
            >
              <option value="skill1">Select the skills</option>
              <option value="wiki">Wikipeida</option>
              <option value="arvix">Arvix</option>
            </select>
            <br/>
            <button onClick={handleNextStep}>Next</button>
          </div>
        );
      case 2:
        return (
          <div>
            <h4>What Your Bot Should Do:</h4>
            <br/>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <br/>
            <button onClick={handleNextStep}>Submit</button>
          </div>
        );
      case 3:
        return (
          <div className="App">
            <div class="main__cards cards">
              <div class="cards__inner">
                <div class="cards__card card">
                  <div style={{ position: 'relative', height: '800px', width: '700px' }}>
                    <MainContainer>
                      <ChatContainer>
                        <MessageList
                          scrollBehavior="smooth"
                          typingIndicator={
                            isTyping ? <TypingIndicator content="Kutty is typing" /> : null
                          }
                        >
                          {messages.map((message, i) => {
                            return <Message key={i} model={message} />;
                          })}
                        </MessageList>
                        <MessageInput placeholder="Type message here" onSend={handleSend} />
                      </ChatContainer>
                    </MainContainer>
                  </div>
                </div>
              </div>
              <div class="overlay cards__inner"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderSteps()}</div>;
};

export default Chat;
