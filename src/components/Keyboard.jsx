import React from 'react';

function Keyboard(props) {
  const layouts = {
    he: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ["'", '-', 'ק', 'ר', 'א', 'ט', 'ו', 'ן', 'ם', 'פ'],
      ['ש', 'ד', 'ג', 'כ', 'ע', 'י', 'ח', 'ל', 'ך', 'ף'],
      ['ז', 'ס', 'ב', 'ה', 'נ', 'מ', 'צ', 'ת', 'ץ', 'DEL'],
      ['CLEAR', '?123', 'EMOJI', 'LANG', 'SPACE', '.', 'ENTER']
    ],
    en: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'DEL'],
      ['CLEAR', '?123', 'EMOJI', 'LANG', 'SPACE', '.', 'ENTER']
    ],
    symbols1: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['@', '#', '₪', '_', '&', '-', '+', '(', ')', '/'],
      ['*', '"', "'", ':', ';', '!', '?', '~', '`', '|'],
      ['=\\<', '¢', '$', '€', '£', '¥', '^', '°', '=', 'DEL'],
      ['CLEAR', 'ABC', 'EMOJI', 'LANG', 'SPACE', '.', 'ENTER'] //return to ABC
    ],
    symbols2: [
      ['~', '`', '|', '•', '√', 'π', '÷', '×', '§', 'Δ'],
      ['£', '€', '$', '¢', '^', '°', '=', '{', '}', '\\'],
      ['%', '©', '®', '™', '✓', '[', ']', '<', '>', '¥'],
      ['?123', '¡', '¿', '«', '»', '¤', '¦', '±', 'µ', 'DEL'], // retun to ?123
      ['CLEAR', 'ABC', 'EMOJI', 'LANG', 'SPACE', '.', 'ENTER']
    ],
    emoji: [
      ['😀', '😂', '🥰', '😎', '🤔', '🙌', '👍', '❤️', '🔥', '✨'],
      ['🌟', '💡', '🎉', '🚀', '💯', '🙈', '🌺', '🍔', '🍕', '⚽'],
      ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
      ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', 'DEL'],
      ['CLEAR', 'ABC', 'EMOJI', 'LANG', 'SPACE', '.', 'ENTER']
    ]
  };

  const currentLayout = layouts[props.language] || layouts.he;

  const renderKeyContent = (char) => {
    if (char === 'DEL') return '⌫';
    if (char === 'LANG') return '🌐';
    if (char === 'EMOJI') return '☺'; 
    if (char === 'SPACE') return props.language === 'he' ? 'עברית' : (props.language === 'en' ? 'English' : 'Space');
    if (char === 'ENTER') return '↵';
    if (char === 'CLEAR') return 'נקה';
    if (char === 'ABC') return 'ABC';
    if (char === '=\\<') return '= \\ <';
    return char;
  };

  const handleKeyClick = (char) => {
    if (char === 'DEL') {
      props.onDelete();
    } else if (char === 'CLEAR') {
      props.onClear();
    } else if (char === 'LANG') {
      props.onChangeLanguage(props.language === 'he' ? 'en' : 'he');
    } else if (char === 'EMOJI') {
      props.onChangeLanguage('emoji');
    } else if (char === '?123') {
      props.onChangeLanguage('symbols1');
    } else if (char === '=\\<') {
      props.onChangeLanguage('symbols2');
    } else if (char === 'ABC') {
      props.onChangeLanguage('he');
    } else if (char === 'SPACE') {
      props.onKeyPress(' ');
    } else if (char === 'ENTER') {
      props.onKeyPress('\n');
    } else {
      props.onKeyPress(char);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#e5e7eb',
      padding: '10px',
      width: '100%',
      boxSizing: 'border-box',
      gap: '8px',
      direction: 'ltr'
    }}>
      {currentLayout.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: '6px', justifyContent: 'center', width: '100%' }}>
          
          {row.map((char, charIndex) => {
            let flexValue = 1;
            let bgColor = '#ffffff';
            let textColor = '#1f2937';

            if (char === 'SPACE') flexValue = 3.5;
            if (char === 'ENTER') { bgColor = '#3b82f6'; textColor = 'white'; flexValue = 1.2; }
            if (char === 'CLEAR') { bgColor = '#ef4444'; textColor = 'white'; flexValue = 1.2; }
            if (['DEL', 'LANG', 'EMOJI', '?123', '=\\<', 'ABC'].includes(char)) { bgColor = '#d1d5db'; flexValue = 1.1; }

            return (
              <button
                key={charIndex}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(2px)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 0px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 0px rgba(0,0,0,0.2)';
                }}
                onClick={() => handleKeyClick(char)}
                style={{
                  flex: flexValue,
                  height: '45px',
                  fontSize: (char.length > 1 && char !== 'DEL') ? '13px' : '20px',
                  color: textColor,
                  backgroundColor: bgColor,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  transition: 'all 0.05s',
                  boxShadow: '0 3px 0px rgba(0,0,0,0.2)'
                }}
              >
                {renderKeyContent(char)}
              </button>
            );
          })}

        </div>
      ))}
    </div>
  );
}

export default Keyboard;