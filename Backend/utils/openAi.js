import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5.4-nano",
          messages: [
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    // ✅ FIX 1: await here
    const data = await response.json();

    // 🔥 DEBUG (VERY IMPORTANT)
    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    // ❌ Handle API errors
    if (!response.ok) {
      console.log("❌ OpenAI API Error:", data);
      return null;
    }

    // ❌ Handle missing choices
    if (!data.choices || data.choices.length === 0) {
      console.log("❌ No choices in response");
      return null;
    }

    // ✅ SAFE ACCESS
    return data.choices[0].message.content;

  } catch (err) {
    console.log("❌ Fetch Error:", err);
    return null;
  }
};

export default getOpenAIAPIResponse;