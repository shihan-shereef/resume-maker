import { ResumeData } from '../../types/resume';

// @ts-ignore
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const aiService = {
  async enhanceText(text: string, context: string) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Takshila AI Resume Maker",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "anthropic/claude-3-haiku",
          "messages": [
            {
              "role": "system",
              "content": "You are an expert resume writer and career coach. Your goal is to rewrite resume content to be professional, impactful, and ATS-friendly."
            },
            {
              "role": "user",
              "content": `Context: ${context}\n\nExisting Text: ${text}\n\nTask: Rewrite the text above to be more professional and impactful. Use active verbs and quantify achievements if possible. KEEP IT CONCISE.`
            }
          ]
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI Enhancement Error:", error);
      return text;
    }
  },

  async suggestSkills(experience: string) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "anthropic/claude-3-haiku",
          "messages": [
            {
              "role": "system",
              "content": "You are an expert career consultant. Based on the job description or experience provided, suggest 5-8 highly relevant professional skills."
            },
            {
              "role": "user",
              "content": `Experience: ${experience}\n\nSuggest 8 key skills. Return ONLY a comma-separated list.`
            }
          ]
        })
      });

      const data = await response.json();
      return data.choices[0].message.content.split(',').map((s: string) => s.trim());
    } catch (error) {
      console.error("AI Skill Suggestion Error:", error);
      return [];
    }
  }
};
