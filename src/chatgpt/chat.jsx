import { useState } from 'react';
import './chat.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const questions = [
  "Choose [LLM provider, model name]",
  "Choose the skill needed [Drop down box] (I'll provide the available skills)",
  "What your bot should do:",
];


const systemMessage = { 
  "role": "system", 
  "content": "Explain things like you're talking to a software professional with 2 years of experience."
}

function Chat() {
  const [messages, setMessages] = useState([
    {
      message: "Choose [LLM provider, model name]",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    if (questionIndex < questions.length - 1) {
      // If there are more questions, ask the next one
      const nextQuestion = questions[questionIndex + 1];
      const botMessage = {
        message: nextQuestion,
        sentTime: "just now",
        sender: "ChatGPT"
      };
      setMessages([...newMessages, botMessage]);
      setQuestionIndex(questionIndex + 1);
    } else {
      // If all questions are answered, show the submit button
      setShowSubmitButton(true);
    }
  };

  return (
    <div className="App">
      <div className="main__cards cards">
        <div className="cards__inner">
          <div className="cards__card card">
            <div style={{ position:"relative", height: "800px", width: "700px" }}>
              <MainContainer>
                <ChatContainer>       
                  <MessageList 
                    scrollBehavior="smooth"
                  >
                    {messages.map((message, i) => (
                      <Message key={i} model={message} />
                    ))}
                  </MessageList>
                  {!showSubmitButton && (
                    <MessageInput 
                      placeholder="Type your answer here" 
                      onSend={handleSend} 
                    />
                  )}
                  
                </ChatContainer>
              </MainContainer>
              {showSubmitButton && (
                    <button onClick={() => handleSend("Submit")} className="submit-button">
                      Submit
                    </button>
                  )}
            </div>
          </div>
        </div>
        <div className="overlay cards__inner"></div>
      </div>
    </div>
  )
}

export default Chat;
