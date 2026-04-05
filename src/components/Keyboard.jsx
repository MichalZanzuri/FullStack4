import React from 'react';

function Keyboard(props) {
  // הגדרת מערכים לשפות השונות
  const hebrew = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת',' '];
  const english = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',' '];
  const emojis = ['😀','😂','🥰','😎','🤔','🙌','👍','❤️','🔥','✨','🚀',' '];

  // בחירת המערך הנכון לפי השפה שהגיעה מה-App
  let currentKeys = hebrew;
  if (props.language === 'en') currentKeys = english;
  if (props.language === 'emoji') currentKeys = emojis;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '10px' }}>
      {currentKeys.map((char, index) => (
        <button 
          key={index} 
          onClick={() => props.onKeyPress(char)}
          style={{ padding: '10px 15px', fontSize: '18px', cursor: 'pointer', borderRadius: '5px' }}
        >
          {char === ' ' ? 'רווח' : char}
        </button>
      ))}
    </div>
  );
}

export default Keyboard;