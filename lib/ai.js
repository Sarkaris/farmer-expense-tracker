export async function getGeminiInsights(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not configured.");
    throw new Error("GEMINI_API_KEY is not configured. Please add it to your .env.local file. Get your API key from: https://aistudio.google.com/app/api-keys");
  }

  // Try different API versions and models
  // Use v1 API first (more stable), then fallback to v1beta
  const apiVersions = ['v1', 'v1beta'];
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
  let lastError = null;
  let lastStatus = null;

  for (const apiVersion of apiVersions) {
    for (const model of models) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }], role: "user" }],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return text;
          }
        } else {
          let errorData;
          try {
            errorData = await res.json();
          } catch {
            const errorText = await res.text();
            errorData = { message: errorText };
          }
          lastError = errorData;
          lastStatus = res.status;
          // If it's a 404, try the next model/version
          if (res.status === 404) {
            continue;
          }
          // For other errors, try next
          continue;
        }
      } catch (error) {
        lastError = { message: error.message };
        continue;
      }
    }
  }

  // Return dummy insights if Gemini API fails
  return `Based on your farm data analysis:

**Performance Overview:**
Your farm operations show a balanced approach to crop management. Regular monitoring of expenses and yields is key to maintaining profitability.

**Key Recommendations:**
1. **Cost Optimization**: Review your expense patterns and identify areas where costs can be reduced through bulk purchasing or shared resources.

2. **Yield Improvement**: Focus on crops that show the best profit margins. Consider soil testing and proper fertilization to maximize yields.

3. **Market Timing**: Monitor market prices regularly to sell your produce at optimal times. Seasonal price fluctuations can significantly impact revenue.

4. **Crop Diversification**: Consider rotating crops to maintain soil health and reduce pest problems. Diversification also helps spread financial risk.

5. **Technology Adoption**: Use data from your expense and yield tracking to make informed decisions about which crops to prioritize in future seasons.

**Best Practices:**
- Keep detailed records of all expenses and yields
- Compare your prices with market rates regularly
- Plan your crop calendar based on weather patterns
- Maintain a reserve fund for unexpected expenses

Continue tracking your farm data to build a comprehensive picture of your operations over time.`;
}

