import React from 'react';
import { useDynamicTranslation } from '../../hooks/useDynamicTranslation';

interface TranslatedTextProps {
  text?: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  text,
  className = '',
  as: Component = 'span'
}) => {
  const { translatedText, isTranslating } = useDynamicTranslation(text);

  return (
    <Component className={`${className} ${isTranslating ? 'opacity-80 transition-opacity' : ''}`.trim()}>
      {translatedText || text || ''}
    </Component>
  );
};
