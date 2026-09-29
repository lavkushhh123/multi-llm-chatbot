
import { useState } from 'react'  
import './App.css'
import geminiIcon from './assets/gemini.png'
import groqIcon from './assets/groq.png'
import claudeIcon from './assets/claude.png'

 function App() {

  
  const [prompt, setPrompt] = useState("");              // User input me jo prompt likhega, wo yaha store hoga

  
  const [responses, setResponses] = useState([]);          // Gemini, Groq aur Mistral ke responses yaha store honge

  
  const [loading, setLoading] = useState(false);                   // API request chal rahi hai ya nahi, ye track karega
  const [history , setHistory] = useState(()=>{                  // previous prompt ko browser me store krne ke liye
  const savedHistory = localStorage.getItem("chatHistory");      // browser me save history  read kr rha hai
  
  return savedHistory ? JSON.parse(savedHistory) :[];            // agar history save hai to use array me convert kr do 
  })
  
  const sendPrompt = async () => {                    // Ye function user ke prompt ko backend par send karega

   
    if (!prompt.trim()) {                          // Agar input empty hai to API call nahi hogi
      return;
    }

   
    setLoading(true);                    // API request start hote hi loading true

    try {

      
      const response = await fetch("/api/chat", {                   // React se hamare backend /api/chat par request bhej rahe hain
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
      console.log("Backend response :", data)
      // agar backend ne error return kiya hai
      if(!response.ok){
        console.log("Backend error:",data);
        return ;
      }

      // Gemini, Groq aur Mistral ke responses state me save honge
      setResponses(data.responses);

      const updateHistory = [prompt , ...history];                                   // current prompt ko history me add kar rhe hain 
      setHistory(updateHistory);                                                     // History state update
      localStorage.setItem("chatHistory" , JSON.stringify(updateHistory));            // browser local storage me history save

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

        <button onClick = {() => {
          setResponses([]);                     /* current chat ke response clear kr rha hain */
        
          setPrompt("");                          // ip box ko bhi empty kr rhe hain
          setLoading(false);                      // loading state ko reset kr rha hai
        
        }}> + New Chat </button>               {/*New Chat dabane par current response cards clear honge, but history delete nahi hogi. */}

        <h3>Recent Chats</h3>

        {history.length === 0 ?(
           <p> No recent chats</p>
        ):( 
          history.slice(0,5).map((chat , index) => (              /* this will show the latest 5 prompts in your sidebart*/                     
            <p key = {index}
            onClick={() => {

              setPrompt(chat);                                    /* previous prompt ko input box me wapas le rhe hai */
              setResponses([]);                                   /* previous response card clear kr rhe hain */
            
            }} > {chat}</p>

          ))
          
        )}
       
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
              <p>
            {loading
              ? "Generating response..."
              : responses.find((item) => item.provider === "Gemini")?.success
                ? responses.find((item) => item.provider === "Gemini").response
                : responses.find((item) => item.provider === "Gemini")?.error
                  ? `Error: ${responses.find((item) => item.provider === "Gemini").error}`
                  : "No response yet"}
          </p>

            </p>
            </div>
            
            <div className = "response-card">

              <div className="card-header">
             <img src={groqIcon} alt="Groq" />
            <h3> 𝙂𝙍𝙊𝙌 </h3>
            </div>
           <p>
            <p>
            {loading
              ? "Generating response..."
              : responses.find((item) => item.provider === "Groq")?.success
                ? responses.find((item) => item.provider === "Groq").response
                : responses.find((item) => item.provider === "Groq")?.error
                  ? `Error: ${responses.find((item) => item.provider === "Groq").error}`
                  : "No response yet"}
         </p>
          </p>
            </div>

            <div className = "response-card">

              <div className="card-header">
              <img src={claudeIcon} alt="Claude" />
               <h3> ⟡ 𝙈𝙄𝙎𝙏𝙍𝘼𝙇 ⟡ </h3>
              </div>
        <p>
          {loading
            ? "Generating response..."
            : responses.find((item) => item.provider === "Mistral")?.success
              ? responses.find((item) => item.provider === "Mistral").response
              : responses.find((item) => item.provider === "Mistral")?.error
                ? `Error: ${responses.find((item) => item.provider === "Mistral").error}`
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
