// This function receives the prompt from React
// and sends it to Gemini, Groq and Mistral.
export default async function handler(req, res) {

  // Only POST requests are allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  // Get the prompt sent by React
  const { prompt } = req.body;

  // Check if user actually entered a prompt
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({
      error: "Prompt is required"
    });
  }

  // API keys are read from .env on the server
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const mistralKey = process.env.MISTRAL_API_KEY;

  // Gemini request
  const geminiRequest = fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    }
  );

  // Groq request
  const groqRequest = fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    }
  );

  // Mistral request
  const mistralRequest = fetch(
    "https://api.mistral.ai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mistralKey}`
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    }
  );

  // All three API requests run at the same time
  const results = await Promise.allSettled([
    geminiRequest,
    groqRequest,
    mistralRequest
  ]);

  // Helper function to read each API response
  async function getResponse(result, provider) {

    // If the request itself failed
    if (result.status === "rejected") {
      return {
        provider,
        success: false,
        error: "Request failed"
      };
    }

    // Read API response
    const data = await result.value.json();

    // If API returned an error
    if (!result.value.ok) {
      return {
        provider,
        success: false,
        error: data.error?.message || "API error"
      };
    }

    // Gemini response format
    if (provider === "Gemini") {
      return {
        provider,
        success: true,
        response: data.candidates?.[0]?.content?.parts?.[0]?.text || ""
      };
    }

    // Groq and Mistral response format
    return {
      provider,
      success: true,
      response: data.choices?.[0]?.message?.content || ""
    };
  }

  // Convert all three API results into simple objects
  const responses = await Promise.all([
    getResponse(results[0], "Gemini"),
    getResponse(results[1], "Groq"),
    getResponse(results[2], "Mistral")
  ]);

  // Send all three results back to React
  return res.status(200).json({
    responses
  });
}