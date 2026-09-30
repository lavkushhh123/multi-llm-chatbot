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

  // Gemini request
  const geminiRequest = fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-google-api-key": geminiKey
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

  // GEmini key request runs
  const results = await Promise.allSettled([
    geminiRequest,
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
        error: `HTTP ${result.value.status}: ${
        data.error?.message || data.message || JSON.stringify(data)
        }`
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
  }

  // Convert Gemini result into a simple object 
  const responses = await Promise.all([
    getResponse(results[0], "Gemini"),
  ]);

  // Send Gemini results back to React
  return res.status(200).json({
    responses
  });
}