import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateDynamicText, SupportedLanguage } from '../utils/dynamicTranslator';

export function useDynamicTranslation(originalText?: string): {
  translatedText: string;
  isTranslating: boolean;
  language: SupportedLanguage;
} {
  const { language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(originalText || '');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!originalText || !originalText.trim()) {
      setTranslatedText('');
      setIsTranslating(false);
      return;
    }

    let isMounted = true;
    setIsTranslating(true);

    translateDynamicText(originalText, language as SupportedLanguage)
      .then((res) => {
        if (isMounted) {
          setTranslatedText(res);
          setIsTranslating(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTranslatedText(originalText);
          setIsTranslating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [originalText, language]);

  return { translatedText, isTranslating, language: language as SupportedLanguage };
}
