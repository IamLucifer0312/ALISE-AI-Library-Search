import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"

function App() {
  const [inputValue, setInputValue] = useState(""); 
  const [userPrompt, setUserPrompt] = useState(""); // State to store user's input
  const [chat, setChat] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value); 
  }

  const handleClick = async () => {    
    const response = await axios.post("http://localhost:3000/prompt", {
      userPrompt: inputValue,
    });
    console.log(response.data);
    setChat(response.data)
  }

  return (
    <div className='container'>
      <div className = 'header'>ALiSe</div>
      <div className = 'chatbox'>
         <div className = 'message' id = 'user-prompt'> </div>
        {chat.map((entry, key) => {
          if (entry.role == "system") return

          if (entry.role == "user") {
            return <div className = 'message user-message' key={key}>{entry.content}</div>  
          }

          if (entry.role == "assistant") {
            return <div className = 'message ai-message' key={key}>{entry.content}</div>  
          }

        })}
      </div>
      <div id = 'chat-bar'>
          <input type="text" id="chat-input" placeholder="Type a message..." value={inputValue}
            onChange={handleInputChange}/>
          <button id ="chat-button" onClick={handleClick}>Send</button>
       </div>
    </div>
  );
}

export default App;
