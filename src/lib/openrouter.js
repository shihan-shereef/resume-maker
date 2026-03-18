// lib/openrouter.js

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
 * Generate text using Takshila Backend AI Proxy
 * @param {string} prompt - The user prompt to generate text for
 * @param {string} systemPrompt - Optional system prompt instruction
 * @param {string} model - The model to use for generation
 * @returns {Promise<string>} Generative response
 */
export const generateResumeContent = async (prompt, systemPrompt = "You are a professional resume writer.", model = "openai/gpt-3.5-turbo") => {
    try {
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
            throw new Error(data?.error || `Failed to generate AI content via backend (HTTP ${response.status}).`);
        }

        const content = data?.choices?.[0]?.message?.content;

        if (typeof content !== 'string' || !content.trim()) {
            throw new Error(data?.error || "AI backend returned an unexpected response format.");
        }

        return content;

    } catch (error) {
        console.error("Backend AI Error:", error);

        if (error instanceof TypeError) {
            throw new Error(`Unable to reach the AI backend. ${LOCAL_DEV_HINT}`);
        }

        throw error instanceof Error ? error : new Error("Failed to generate AI content via backend");
    }
};
