const SPEAKER_PREFIX_REGEX = /^([A-Za-z][A-Za-z ]{0,20}):\s*/i;

export const normalizeDialogueText = (text = '') => (
    text
        .replace(SPEAKER_PREFIX_REGEX, '')
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase()
);

const getTokenSet = (text = '') => new Set(
    normalizeDialogueText(text)
        .split(' ')
        .filter((token) => token.length > 2)
);

export const isLikelyDuplicate = (firstText = '', secondText = '') => {
    const first = normalizeDialogueText(firstText);
    const second = normalizeDialogueText(secondText);

    if (!first || !second) return false;
    if (first === second) return true;

    const [shorter, longer] = first.length <= second.length ? [first, second] : [second, first];
    if (shorter.length > 24 && longer.includes(shorter)) {
        return true;
    }

    const firstTokens = getTokenSet(first);
    const secondTokens = getTokenSet(second);
    const smallerSet = firstTokens.size <= secondTokens.size ? firstTokens : secondTokens;
    const largerSet = firstTokens.size <= secondTokens.size ? secondTokens : firstTokens;

    if (smallerSet.size < 4) {
        return false;
    }

    let overlap = 0;
    smallerSet.forEach((token) => {
        if (largerSet.has(token)) {
            overlap += 1;
        }
    });

    return overlap / smallerSet.size >= 0.85;
};

export const stripRepeatedSentences = (text = '') => {
    const parts = text
        .split(/(?<=[.!?])\s+|\n+/)
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length <= 1) {
        return text.replace(/\s+/g, ' ').trim();
    }

    const uniqueParts = [];

    parts.forEach((part) => {
        if (!uniqueParts.some((existing) => isLikelyDuplicate(existing, part))) {
            uniqueParts.push(part);
        }
    });

    return uniqueParts.join(' ').replace(/\s+/g, ' ').trim();
};

export const cleanInterviewReply = (text = '') => (
    stripRepeatedSentences(text)
        .replace(/\*+/g, '')
        .replace(/^["'`\s]+|["'`\s]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim()
);

export const cleanPodcastScript = (script = '') => {
    const cleanedLines = [];
    const speakerMemory = new Map();

    script
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => {
            const match = line.match(/^([A-Za-z][A-Za-z ]{0,20}):\s*(.+)$/);
            const speaker = match?.[1]?.trim() || null;
            const rawContent = match?.[2] || line;
            const content = stripRepeatedSentences(rawContent).replace(/\s+/g, ' ').trim();

            if (!content) return;

            const normalized = normalizeDialogueText(content);
            if (!normalized) return;

            const previousLine = cleanedLines[cleanedLines.length - 1];
            if (previousLine && isLikelyDuplicate(previousLine.normalized, normalized)) {
                return;
            }

            if (speaker) {
                const recentSpeakerLines = speakerMemory.get(speaker) || [];
                if (recentSpeakerLines.some((previous) => isLikelyDuplicate(previous, normalized))) {
                    return;
                }
                speakerMemory.set(speaker, [...recentSpeakerLines.slice(-2), normalized]);
            }

            cleanedLines.push({ speaker, content, normalized });
        });

    return cleanedLines
        .map(({ speaker, content }) => (speaker ? `${speaker}: ${content}` : content))
        .join('\n')
        .trim();
};

export const getSpeechLines = (text = '') => (
    text
        .split('\n')
        .map((line) => stripRepeatedSentences(line).replace(/\s+/g, ' ').trim())
        .filter(Boolean)
);
