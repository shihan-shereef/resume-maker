import { generateResumeContent } from '../lib/openrouter';

/**
 * Service to handle AI-based code review and analysis.
 */

/**
 * Analyze code using LLM for bugs, improvements, and documentation.
 * @param {Array} files - List of files with path and content
 * @returns {Promise<Object>} - Structured review results
 */
export const analyzeCodebase = async (files) => {
    try {
        // Filter out empty files or unsupported content
        const validFiles = files.filter(f => f.content && f.content.trim().length > 0);
        
        if (validFiles.length === 0) {
            throw new Error('No valid code files found for analysis.');
        }

        // Limit the total content size for LLM context (e.g., ~128k characters for Gemini Flash)
        // If the codebase is larger, we'll need more complex chunking/summarization logic.
        // For now, we'll take the most important files or the first few files.
        let totalContent = '';
        const limit = 100000; // Character limit for content
        const filesToAnalyze = [];

        for (const file of validFiles) {
            if (totalContent.length + file.content.length <= limit) {
                totalContent += `\n\n--- FILE: ${file.path} ---\n${file.content}`;
                filesToAnalyze.push(file.path);
            } else {
                // If the single file is too large, we take a snippet (e.g., first 20k)
                const remainingSpace = limit - totalContent.length;
                if (remainingSpace > 1000) {
                    totalContent += `\n\n--- FILE: ${file.path} (Truncated) ---\n${file.content.substring(0, remainingSpace)}`;
                    filesToAnalyze.push(file.path);
                }
                break;
            }
        }

        const prompt = `
Act as a world-class Senior Software Engineer and Security Auditor. 
Thoroughly analyze the provided codebase and generate a comprehensive AI Code Review.

CODEBASE CONTENT:
${totalContent}

TASK:
1. Identify BUGS, logical errors, edge cases, and security vulnerabilities.
2. Suggest PERFORMANCE improvements, clean code refactors, and architectural enhancements.
3. Provide a dynamic overall code quality SCORE (0-100).
4. Auto-generate HIGH-LEVEL documentation of the codebase structure and purpose.

OUTPUT FORMAT:
Return ONLY a valid JSON object with the following structure:
{
  "summary": "Overall summary of the codebase",
  "score": 85,
  "language": "Primary language detected",
  "findings": [
    {
      "file_path": "path/to/file",
      "category": "bug" | "improvement" | "documentation",
      "severity": "high" | "medium" | "low" | "info",
      "description": "Clear explanation of the finding",
      "code_snippet": "Relevant original code snippet",
      "suggested_fix": "Proposed code fix or improvement",
      "line_number": 123
    }
  ],
  "documentation": "Markdown formatted high-level documentation of the codebase"
}

CRITICAL RULES:
- Use HIGH severity for critical security flaws or breaking bugs.
- Use MEDIUM for performance bottlenecks or logical edge cases.
- Use LOW for linting or minor clean-code improvements.
- Keep the description concise but professional.
- Ensure the JSON is perfectly valid and can be parsed.
- Do NOT include any text outside the JSON block.
`;

        const response = await generateResumeContent(
            prompt, 
            "You are a master of code analysis. Output strictly JSON.", 
            "google/gemini-2.0-flash-001"
        );

        // Clean potentially problematic Markdown formatting if LLM wraps JSON in code blocks
        const cleanedResponse = response.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
        
        try {
            return JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error('Failed to parse AI response as JSON:', cleanedResponse);
            throw new Error('The AI model returned an invalid response format. Please try again.');
        }
    } catch (error) {
        console.error('Error during AI code analysis:', error);
        throw error;
    }
};

/**
 * Chunk large files for processing if needed (Advanced feature)
 */
export const chunkCode = (content, size = 20000) => {
    const chunks = [];
    for (let i = 0; i < content.length; i += size) {
        chunks.push(content.substring(i, i + size));
    }
    return chunks;
};
