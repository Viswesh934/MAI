import axios from 'axios';

export async function fetchGeminiSummary(text) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Gemini API key. Please check your .env file for VITE_GEMINI_API_KEY.');
  }
  if (!text || text.trim().length < 10) {
    throw new Error('Text is too short to summarize');
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              { text: `Summarize the following text:\n\n${text}` }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // The summary is in response.data.candidates[0].content.parts[0].text
    const summary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!summary) {
      throw new Error('No summary returned from Gemini');
    }
    return summary;
  } catch (error) {
    throw new Error(
      error.response?.data?.error?.message ||
      error.message ||
      'Failed to summarize text'
    );
  }
}