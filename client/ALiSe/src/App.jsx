import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import stylesheet from './App.css'

function ChatBox() {
  return (
    <div class='container'>
      <div class = 'header'>ALiSe</div>
      <div class = 'chatbox'>
        <div id = 'user-prompt'>Hello fasjkfjadsfjasfadsfadsfasdfadsfsdfdsaf</div>
        <div id = 'AI-answer-title'>Here's what I have found</div>
        <div id = 'AI-answers'>Library one</div>
      </div>
    </div>
  );
}

export default ChatBox;
