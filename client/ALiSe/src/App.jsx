import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"

function App() {
  const [inputValue, setInputValue] = useState(""); 

  const handleInputChange = (e) => {
    setInputValue(e.target.value); 
  }

  const handleClick = async () => {
    const response = await axios.post("http://localhost:3000/prompt", {
      userPrompt: inputValue,
    });
    console.log(response);
  }

  return (
    <div class='container'>
      <div class = 'header'>ALiSe</div>
      <div class = 'chatbox'>
        <div class = 'message' id = 'user-prompt'>Hello fasjkfjadsfjasfadsfadsfasdfadsfsdfdsaf</div>
        <div class = 'message' id = 'AI-answer-title'>Here's what I have found</div>
        <div class = 'message' id = 'AI-answers'>Library one</div>
        <div id = 'chat-bar'>
          <input type="text" id="chat-input" placeholder="Type a message..." value={inputValue}
            onChange={handleInputChange}/>
          <button id ="chat-button" onClick={handleClick}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
