import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

 function App() {                                        {/* App()this is the main component of webpage */}

  return (
      < div className = "app">

      {/* Sidebar */}

      <aside className = "sidebar">                 {/* aside ka use side information/navigation ke liye hota ha */}
        <h2>Multi-LLM</h2>

        <button> + New Chat </button>

        <h3>Recent Chats</h3>
        <p> No recent chats</p>

      </aside>

      {/* main chat area */}
      <main className = "chat-area">

        <header className = "chat-header">
          <h1>Multi-LLm Chatbot</h1>
          <p>Compare respoonses from multiple AI models</p>
        </header>

        <section className = "responses">                                 {/* bad me mai yhi pr teen response cards add krunga */}
          <p>AI response wil appear here.</p>
        </section>

      </main>
      </div>
  );
}

export default App ;                                  {/* this is for so that app component can be used by other file */}
