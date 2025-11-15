import React from 'react';

interface BidiTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  autoDetect?: boolean;
}

/**
 * BidiText Component
 * 
 * Handles bidirectional text rendering for mixed Hebrew/English/Numbers content.
 * Automatically detects and isolates text segments to ensure proper reading order.
 * 
 * @example
 * <BidiText>עברית English 123</BidiText>
 * <BidiText autoDetect>המחיר הוא $50</BidiText>
 */
export default function BidiText({ 
  children, 
  className = '', 
  as: Component = 'span',
  autoDetect = true 
}: BidiTextProps) {
  // If children is a string, process it
  if (typeof children === 'string') {
    return processText(children, Component, className, autoDetect);
  }

  // For React nodes, wrap in bidi container
  return React.createElement(
    Component,
    { 
      className: `bidi-container ${className}`,
      dir: 'rtl'
    },
    children
  );
}

/**
 * Process text string and split into segments with proper direction
 * Ensures proper right-to-left reading order for mixed content
 */
function processText(
  text: string, 
  Component: keyof JSX.IntrinsicElements,
  className: string,
  autoDetect: boolean
): JSX.Element {
  if (!autoDetect) {
    return React.createElement(
      Component,
      { 
        className: `bidi-text ${className}`,
        dir: 'rtl'
      },
      text
    );
  }

  // Split text into segments: Hebrew, English, Numbers, Mixed
  const segments = splitBidiSegments(text);
  
  // Reverse segments to ensure RTL reading order
  // In RTL context, we want Hebrew first (rightmost), then English/Numbers (leftmost)
  // But we need to maintain logical order: Hebrew segments stay RTL, English/Numbers stay LTR
  const processedSegments = ensureRTLOrder(segments);
  
  return React.createElement(
    Component,
    { 
      className: `bidi-container ${className}`,
      dir: 'rtl',
      style: { direction: 'rtl', unicodeBidi: 'isolate' }
    },
    processedSegments.map((segment, index) => {
      const { text: segmentText, type } = segment;
      
      // Determine direction and bidi handling based on segment type
      let dir: 'ltr' | 'rtl' = 'rtl';
      let bidiClass = 'bidi-inline';
      
      if (type === 'english' || type === 'number') {
        dir = 'ltr';
        bidiClass = type === 'number' ? 'bidi-number' : 'bidi-english';
      } else if (type === 'hebrew') {
        dir = 'rtl';
        bidiClass = 'bidi-inline';
      } else {
        // Mixed or unknown - use auto detection
        dir = 'rtl';
        bidiClass = 'bidi-mixed';
      }
      
      return React.createElement(
        'span',
        {
          key: index,
          dir,
          className: bidiClass,
          'data-bidi-type': type,
          style: { 
            direction: dir,
            unicodeBidi: 'embed',
            display: 'inline-block'
          }
        } as React.HTMLAttributes<HTMLSpanElement> & { 'data-bidi-type': string },
        segmentText
      );
    })
  );
}

/**
 * Ensure proper RTL reading order for segments
 * In RTL context, Hebrew should be read first (rightmost), then English/Numbers (leftmost)
 */
function ensureRTLOrder(
  segments: Array<{ text: string; type: 'hebrew' | 'english' | 'number' | 'mixed' | 'punctuation' }>
): Array<{ text: string; type: 'hebrew' | 'english' | 'number' | 'mixed' | 'punctuation' }> {
  // Group consecutive segments of the same type
  const grouped: Array<Array<{ text: string; type: 'hebrew' | 'english' | 'number' | 'mixed' | 'punctuation' }>> = [];
  let currentGroup: Array<{ text: string; type: 'hebrew' | 'english' | 'number' | 'mixed' | 'punctuation' }> = [];
  let lastType: 'hebrew' | 'english' | 'number' | 'mixed' | 'punctuation' | null = null;
  
  for (const segment of segments) {
    // Group Hebrew together, English/Numbers together
    const isRTL = segment.type === 'hebrew' || segment.type === 'punctuation';
    const wasRTL = lastType === 'hebrew' || lastType === 'punctuation';
    
    if (lastType === null || (isRTL === wasRTL && segment.type !== 'punctuation')) {
      currentGroup.push(segment);
    } else {
      if (currentGroup.length > 0) {
        grouped.push([...currentGroup]);
      }
      currentGroup = [segment];
    }
    
    lastType = segment.type;
  }
  
  if (currentGroup.length > 0) {
    grouped.push(currentGroup);
  }
  
  // Flatten groups back to segments
  return grouped.flat();
}

/**
 * Split text into bidirectional segments
 * Processes text from right to left (RTL) to maintain proper reading order
 */
function splitBidiSegments(text: string): Array<{ text: string; type: 'hebrew' | 'english' | 'number' | 'mixed' | 'punctuation' }> {
  const segments: Array<{ text: string; type: 'hebrew' | 'english' | 'number' | 'mixed' | 'punctuation' }> = [];
  let currentSegment = '';
  let currentType: 'hebrew' | 'english' | 'number' | 'mixed' | 'punctuation' | null = null;
  
  // Hebrew character range
  const hebrewRegex = /[\u0590-\u05FF]/;
  // English/Latin character range
  const englishRegex = /[a-zA-Z]/;
  // Number range
  const numberRegex = /[0-9]/;
  // Punctuation
  const punctuationRegex = /[.,;:!?\-_=+()[\]{}'"`~@#$%^&*|\\/<>]/;
  
  // Process text from right to left (RTL reading order)
  // But we need to maintain logical character order within each segment
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    let charType: 'hebrew' | 'english' | 'number' | 'mixed' | 'punctuation';
    
    if (hebrewRegex.test(char)) {
      charType = 'hebrew';
    } else if (englishRegex.test(char)) {
      charType = 'english';
    } else if (numberRegex.test(char)) {
      charType = 'number';
    } else if (punctuationRegex.test(char)) {
      charType = 'punctuation';
    } else {
      // Space or other - attach to previous segment or create mixed
      // Spaces should maintain the direction of surrounding text
      if (char === ' ' || char === '\n' || char === '\t') {
        charType = currentType || 'hebrew'; // Default to Hebrew in RTL context
      } else {
        charType = currentType || 'mixed';
      }
    }
    
    // If type changed and we have a segment, save it
    if (currentType !== null && currentType !== charType && currentSegment.length > 0) {
      // For punctuation, attach to previous segment if it exists
      if (charType === 'punctuation' && currentType !== 'punctuation') {
        currentSegment += char;
        continue;
      }
      
      // For spaces, attach to previous segment to maintain grouping
      if (char === ' ' && currentType !== 'punctuation') {
        currentSegment += char;
        continue;
      }
      
      segments.push({ text: currentSegment, type: currentType });
      currentSegment = '';
    }
    
    currentSegment += char;
    currentType = charType;
  }
  
  // Add remaining segment
  if (currentSegment.length > 0 && currentType) {
    segments.push({ text: currentSegment, type: currentType });
  }
  
  // Ensure segments are in RTL reading order
  // In RTL, Hebrew comes first (rightmost), then English/Numbers (leftmost)
  const rtlOrdered = ensureRTLReadingOrder(segments.length > 0 ? segments : [{ text, type: 'mixed' }]);
  
  return rtlOrdered;
}

/**
 * Ensure segments are ordered correctly for RTL reading
 * Hebrew segments should appear first (rightmost), then English/Numbers (leftmost)
 */
function ensureRTLReadingOrder(
  segments: Array<{ text: string; type: 'hebrew' | 'english' | 'number' | 'mixed' | 'punctuation' }>
): Array<{ text: string; type: 'hebrew' | 'english' | 'number' | 'mixed' | 'punctuation' }> {
  // The segments are already in logical order (as they appear in the string)
  // But we need to ensure that when rendered in RTL context, they appear correctly
  // The browser's bidi algorithm will handle the visual order, but we need proper dir attributes
  return segments;
}

/**
 * Hook for programmatic bidi text handling
 */
export function useBidiText(text: string): string {
  // Return processed text with proper bidi markers
  // This is a simple version - full implementation would use Intl.Segmenter if available
  return text;
}

/**
 * Utility function to wrap text with proper bidi handling
 */
export function wrapBidiText(text: string, className?: string): JSX.Element {
  return <BidiText className={className}>{text}</BidiText>;
}

