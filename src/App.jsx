
import { useState } from 'react'  
import './App.css'
import geminiIcon from './assets/gemini.png'
import groqIcon from './assets/groq.png'
import claudeIcon from './assets/claude.png'

 function App() {

  // User input me jo prompt likhega, wo yaha store hoga
  const [prompt, setPrompt] = useState("");

  // Gemini, Groq aur Mistral ke responses yaha store honge
  const [responses, setResponses] = useState([]);

  // API request chal rahi hai ya nahi, ye track karega
  const [loading, setLoading] = useState(false);

  // Ye function user ke prompt ko backend par send karega
  const sendPrompt = async () => {

    // Agar input empty hai to API call nahi hogi
    if (!prompt.trim()) {
      return;
    }

    // API request start hote hi loading true
    setLoading(true);

    try {

      // React se hamare backend /api/chat par request bhej rahe hain
      const response = await fetch("/api/chat", {
        method: "POST",

        // Backend ko bata rahe hain ki data JSON format me hai
        headers: {
          "Content-Type": "application/json"
        },

        // User ka prompt JSON me convert karke bhej rahe hain
        body: JSON.stringify({
          prompt: prompt
        })
      });

      // Backend se aaya JSON response JavaScript object me convert hoga
      const data = await response.json();

      // Gemini, Groq aur Mistral ke responses state me save honge
      setResponses(data.responses);

    } catch (error) {

      // Agar API request me error aaye to console me show hoga
      console.error("Error:", error);

    } finally {

      // Request complete hone ke baad loading false
      setLoading(false);
    }
  };

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
            <p>
              {responses.find((item) => item.provider === "Gemini")?.success    // responses.find(...) responses array ke andar Gemini ka response find karta hai.
              ? responses.find((item) => item.provider === "Gemini").response   // item.provider === "Gemini" check karta hai ki current item Gemini ka hai ya nahi.
              : loading             //?.success check karta hai ki Gemini API successfully response de payi ya nahi.
              ? "GEnerating response..."
              : "No response yet"
              }

            </p>
            </div>
            
            <div className = "response-card">

              <div className="card-header">
             <img src={groqIcon} alt="Groq" />
            <h3> 𝙂𝙍𝙊𝙌 </h3>
            </div>
           <p>
            {responses.find((item) => item.provider === "Groq")?.success
            ? responses.find((item) => item.provider === "Groq").response
            : loading
            ? "Generating response..."
            : "No response yet"}
          </p>
            </div>

            <div className = "response-card">

              <div className="card-header">
              <img src={claudeIcon} alt="Claude" />
               <h3> ⟡ 𝙈𝙄𝙎𝙏𝙍𝘼𝙇 ⟡ </h3>
              </div>
        <p>
          {responses.find((item) => item.provider === "Mistral")?.success
            ? responses.find((item) => item.provider === "Mistral").response
            : loading
              ? "Generating response..."
              : "No response yet"}
        </p>
            </div>
        </section>

        {/* prompt section */}

        <div className = "prompt-area">

          <input 
          type = "text"
          placeholder= "Ask something to compare AI responses"

          // input me jo user type krega vo prompt state me save hoga 
          value = {prompt}
          // hr typing ke sath prompt ki value change hogi 
          onChange = {(e) => setPrompt (e.target.value)}
          />
          <button onClick={sendPrompt}>{loading ? "Sending...":"send"}</button>
        </div>

      </main>
      </div>
  );
}

export default App ;                                  {/* this is for so that app component can be used by other file */}
