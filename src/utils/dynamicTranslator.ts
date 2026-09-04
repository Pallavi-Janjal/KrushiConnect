// Dynamic Machine Translation Utility for User Generated Content (Equipment descriptions, reviews, names, etc.)

export type SupportedLanguage = 'en' | 'hi' | 'mr';

const memoryCache = new Map<string, string>();

function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function isDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

function isLatinOnly(text: string): boolean {
  // If it has Latin letters and no Devanagari
  return /[a-zA-Z]/.test(text) && !/[\u0900-\u097F]/.test(text);
}

function getLangPair(text: string, targetLang: SupportedLanguage): string | null {
  const hasDevanagari = isDevanagari(text);
  const latinOnly = isLatinOnly(text);

  if (targetLang === 'en') {
    if (hasDevanagari) return 'mr|en';
    return null; // already latin / english
  } else if (targetLang === 'mr') {
    if (latinOnly) return 'en|mr';
    if (hasDevanagari) return 'hi|mr';
    return null;
  } else if (targetLang === 'hi') {
    if (latinOnly) return 'en|hi';
    if (hasDevanagari) return 'mr|hi';
    return null;
  }
  return 'autodetect|' + targetLang;
}

function splitIntoChunks(text: string, maxLen = 300): string[] {
  if (text.length <= maxLen) return [text];
  
  // Split by sentence delimiters or newlines
  const sentences = text.split(/(?<=[.।\n!?])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const s of sentences) {
    if ((current + ' ' + s).trim().length > maxLen && current.length > 0) {
      chunks.push(current.trim());
      current = s;
    } else {
      current = (current ? current + ' ' : '') + s;
    }
  }
  if (current.trim().length > 0) {
    chunks.push(current.trim());
  }
  return chunks.length > 0 ? chunks : [text];
}

async function fetchChunkTranslation(chunk: string, pair: string): Promise<string> {
  const cacheKey = `${chunk}__${pair}`;
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  // Try sessionStorage cache if in browser
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const cached = window.sessionStorage.getItem(`tr_${cacheKey}`);
    if (cached) {
      memoryCache.set(cacheKey, cached);
      return cached;
    }
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${pair}`
    );
    if (!response.ok) return chunk;

    const data = await response.json();
    const resText = data.responseData?.translatedText;

    if (!resText || resText.startsWith('PLEASE SELECT') || resText.startsWith('MYMEMORY WARNING')) {
      return chunk;
    }

    const decoded = decodeHtmlEntities(resText);
    memoryCache.set(cacheKey, decoded);

    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        window.sessionStorage.setItem(`tr_${cacheKey}`, decoded);
      } catch {
        // storage quota exceeded, silently ignore
      }
    }

    return decoded;
  } catch {
    return chunk;
  }
}

export async function translateDynamicText(
  text: string,
  targetLang: SupportedLanguage
): Promise<string> {
  if (!text || typeof text !== 'string' || !text.trim()) return text;

  const pair = getLangPair(text, targetLang);
  if (!pair) return text; // no translation needed

  const overallKey = `${text}__${targetLang}`;
  if (memoryCache.has(overallKey)) {
    return memoryCache.get(overallKey)!;
  }

  try {
    const chunks = splitIntoChunks(text, 250);
    const translatedChunks = await Promise.all(
      chunks.map(chunk => fetchChunkTranslation(chunk, pair))
    );
    const result = translatedChunks.join(' ');
    memoryCache.set(overallKey, result);
    return result;
  } catch {
    return text;
  }
}
