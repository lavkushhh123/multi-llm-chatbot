import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import geminiIcon from './assets/gemini.png'
import groqIcon from './assets/groq.png'
import claudeIcon from './assets/claude.png'

 function App() {                                        {/* App()this is the main component of webpage */}

  return (
      < div className = "app">

      {/* Sidebar */}

      <aside className = "sidebar">                 {/* aside ka use side information/navigation ke liye hota ha */}
        <h2>⟡ 𝙈𝙐𝙇𝙏𝙄-𝙇𝙇𝙈 ⟡</h2>

        <button> + New Chat </button>

        <h3>Recent Chats</h3>
        <p> No recent chats</p>

      </aside>

      {/* main chat area */}
      <main className = "chat-area">

        <header className = "chat-header">
          <h1>𝑴𝑼𝑳𝑻𝑰-𝑳𝑳𝑴 𝑪𝑯𝑨𝑻𝑩𝑶𝑻</h1>
          <p>⌁ ᴄᴏᴍᴘᴀʀᴇ ʀᴇsᴘᴏɴsᴇs · ᴍᴜʟᴛɪᴘʟᴇ ᴀɪ ᴍᴏᴅᴇʟs ⌁</p>
        </header>

        <section className = "responses">                           {/* bad me mai yhi pr teen response cards add krunga */}
          
           <div className = "response-card">

            <div className="card-header">
            <img src={geminiIcon} alt="Gemini" />
            <h3> 𝙂𝙀𝙈𝙄𝙉𝙄 </h3>
            </div>
            <p>Gemini response will appearhere</p>
            </div>
            
            <div className = "response-card">

              <div className="card-header">
             <img src={groqIcon} alt="Groq" />
            <h3> 𝙂𝙍𝙊𝙌 </h3>
            </div>
              <p>Groq response will appear here</p>              
            </div>

            <div className = "response-card">

              <div className="card-header">
              <img src={claudeIcon} alt="Claude" />
               <h3> 𝘾𝙇𝘼𝙐𝘿𝙀 </h3>
              </div>
              <p>Claude response will appear here</p>
            </div>
        </section>

        {/* prompt section */}

        <div className = "prompt-area">

          <input 
          type = "text"
          placeholder= "Ask something to compare AI responses"/>

          <button>Send Button</button>
        </div>

      </main>
      </div>
  );
}

export default App ;                                  {/* this is for so that app component can be used by other file */}
