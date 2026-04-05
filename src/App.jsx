import { useState } from 'react';
import Keyboard from './components/Keyboard';
import './App.css';

function App() {
  const [text, setText] = useState("");
  // State חדש ששומר את השפה הנוכחית (ברירת מחדל: עברית)
  const [language, setLanguage] = useState("he");

  const handleKeyPress = (char) => {
    setText(prevText => prevText + char);
  };

  // פונקציה למחיקת תו בודד (לוקחת את הטקסט ומורידה את האות האחרונה)
  const handleDeleteChar = () => {
    setText(prevText => prevText.slice(0, -1));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial' }}>
      
      <div style={{ flex: 1, padding: '20px', borderBottom: '2px solid #ccc', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ color: '#333' }}>תצוגה:</h2>
        <div style={{ fontSize: '24px', whiteSpace: 'pre-wrap', minHeight: '50px' }}>
          {text}
        </div>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#e0e0e0' }}>
        
        {/* לוח בקרה: כפתורי שפות ופעולות מיוחדות */}
        <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
          <button onClick={() => setLanguage("he")}>עברית</button>
          <button onClick={() => setLanguage("en")}>English</button>
          <button onClick={() => setLanguage("emoji")}>אימוג'ים</button>
          <span style={{ borderLeft: '2px solid #999', margin: '0 5px' }}></span>
          <button onClick={handleDeleteChar} style={{ backgroundColor: '#ffaa00' }}>מחק תו ⌫</button>
          <button onClick={() => setText("")} style={{ backgroundColor: '#ff4c4c', color: 'white' }}>נקה הכל</button>
        </div>

        {/* העברת השפה הנוכחית כ-Prop למקלדת */}
        <Keyboard onKeyPress={handleKeyPress} language={language} />
        
      </div>
    </div>
  );
}

export default App;