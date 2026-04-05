import React from 'react';
// לא לשכוח לוודא שה-CSS מיובא באפליקציה (הוא מיובא דרך App.jsx)

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
      ['CLEAR', 'ABC', 'EMOJI', 'LANG', 'SPACE', '.', 'ENTER']
    ],
    symbols2: [
      ['~', '`', '|', '•', '√', 'π', '÷', '×', '§', 'Δ'],
      ['£', '€', '$', '¢', '^', '°', '=', '{', '}', '\\'],
      ['%', '©', '®', '™', '✓', '[', ']', '<', '>', '¥'],
      ['?123', '¡', '¿', '«', '»', '¤', '¦', '±', 'µ', 'DEL'],
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
    if (char === 'DEL') props.onDelete();
    else if (char === 'CLEAR') props.onClear();
    else if (char === 'LANG') props.onChangeLanguage(props.language === 'he' ? 'en' : 'he');
    else if (char === 'EMOJI') props.onChangeLanguage('emoji');
    else if (char === '?123') props.onChangeLanguage('symbols1');
    else if (char === '=\\<') props.onChangeLanguage('symbols2');
    else if (char === 'ABC') props.onChangeLanguage('he');
    else if (char === 'SPACE') props.onKeyPress(' ');
    else if (char === 'ENTER') props.onKeyPress('\n');
    else props.onKeyPress(char);
  };

  return (
    <div className="keyboard-container">
      {currentLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          
          {row.map((char, charIndex) => {
            // כאן נשאר רק מה שדינמי!
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
                className="keyboard-key"
                onClick={() => handleKeyClick(char)}
                style={{
                  flex: flexValue,
                  fontSize: (char.length > 1 && char !== 'DEL') ? '13px' : '20px',
                  color: textColor,
                  backgroundColor: bgColor,
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