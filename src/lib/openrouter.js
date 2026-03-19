// lib/openrouter.js
import DOMPurify from 'isomorphic-dompurify';


const LOCAL_DEV_HINT = "If you're running locally, start the app with `npm run dev:full` so the `/api/ai` backend is available.";

const getBodyPreview = (bodyText = '') => bodyText.replace(/\s+/g, ' ').trim().slice(0, 160);

const looksLikeHtml = (bodyText = '', contentType = '') =>
    contentType.includes('text/html') ||
    /^\s*<!doctype html/i.test(bodyText) ||
    /^\s*<html/i.test(bodyText);

const parseJsonBody = (bodyText) => {
    try {
        return { data: JSON.parse(bodyText) };
    } catch (error) {
        return { error };
    }
};

/**
 * Generate text using Takshila Backend AI Proxy with Client-side Fallback
 * @param {string} prompt - The user prompt to generate text for
 * @param {string} systemPrompt - Optional system prompt instruction
 * @param {string} model - The model to use for generation
 * @returns {Promise<string>} Generative response
 */
export const generateResumeContent = async (prompt, systemPrompt = "You are a professional resume writer.", model = "openai/gpt-3.5-turbo") => {
    try {
        // Try the backend proxy first
        const response = await fetch("/api/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
                systemPrompt,
                model
            })
        });

        if (response.status === 404) {
            // Fallback to direct client-side call if backend is not found (e.g., npm run dev)
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
            
            if (!apiKey) {
                throw new Error(`AI backend returned 404. ${LOCAL_DEV_HINT}`);
            }

            console.warn("Backend 404 detected. Falling back to direct client-side AI call...");
            
            const directResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://takshila.ai",
                    "X-Title": "Takshila AI (Direct)"
                },
                body: JSON.stringify({
                    model: model || "openai/gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: prompt }
                    ]
                })
            });

            if (!directResponse.ok) {
                const errorData = await directResponse.json();
                throw new Error(errorData?.error?.message || `Direct AI call failed (HTTP ${directResponse.status}).`);
            }

            const directData = await directResponse.json();
            return directData?.choices?.[0]?.message?.content || "";
        }

        const contentType = response.headers.get("content-type") || "";
        const responseText = await response.text();
        const trimmedText = responseText.trim();
        const preview = getBodyPreview(trimmedText);

        if (!trimmedText) {
            throw new Error(`AI backend returned an empty response (HTTP ${response.status}). ${LOCAL_DEV_HINT}`);
        }

        if (looksLikeHtml(trimmedText, contentType)) {
            throw new Error(`AI backend returned HTML instead of JSON (HTTP ${response.status}). ${LOCAL_DEV_HINT}`);
        }

        const { data, error: parseError } = parseJsonBody(trimmedText);

        if (parseError) {
            throw new Error(`AI backend returned invalid JSON (HTTP ${response.status}). Preview: ${preview || 'No response body.'} ${LOCAL_DEV_HINT}`);
        }

        if (!response.ok) {
            // Check if the backend specifically says the API key is missing
            if (data?.error?.includes('OpenRouter API key is missing')) {
                const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
                if (apiKey) {
                    console.warn("Backend API key missing. Falling back to direct client-side AI call...");
                    return await generateResumeContentDirect(prompt, systemPrompt, model, apiKey);
                }
            }
            throw new Error(data?.error || `Failed to generate AI content via backend (HTTP ${response.status}).`);
        }



        let content = data?.choices?.[0]?.message?.content;

        if (typeof content !== 'string' || !content.trim()) {
            throw new Error(data?.error || "AI backend returned an unexpected response format.");
        }

        // Sanitize on the client side
        return DOMPurify.sanitize(content);

    } catch (error) {

        console.error("AI Error:", error);

        if (error instanceof TypeError && error.message.includes('fetch')) {
             // Second attempt fallback for networking errors
             const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
             if (apiKey) {
                 return await generateResumeContentDirect(prompt, systemPrompt, model, apiKey);
             }
        }

        throw error instanceof Error ? error : new Error("Failed to generate AI content");
    }
};

const generateResumeContentDirect = async (prompt, systemPrompt, model, apiKey) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://takshila.ai",
            "X-Title": "Takshila AI (Direct Fallback)"
        },
        body: JSON.stringify({
            model: model || "openai/gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ]
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || `Direct AI call failed (HTTP ${response.status}).`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content || "";
};
