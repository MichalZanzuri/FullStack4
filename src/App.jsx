import { useState } from 'react';
import Keyboard from './components/Keyboard';
import StyleControls from './components/StyleControls';
import './App.css';

function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("he");
  const [textColor, setTextColor] = useState("#1f2937");
  const [textSize, setTextSize] = useState("24px");

  const handleKeyPress = (char) => {
    setText(prevText => prevText + char);
  };

  const handleDeleteChar = () => {
    setText(prevText => prevText.slice(0, -1));
  };

  const handleClearAll = () => {
    setText("");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0, padding: 0, backgroundColor: '#f9fafb', direction: 'rtl' }}>
      
      {/* אזור התצוגה (תופס את כל המקום הפנוי למעלה) */}
      <div style={{ flex: 1, padding: '40px', backgroundColor: '#ffffff', overflowY: 'auto' }}>
        <div style={{ 
          color: textColor, 
          fontSize: textSize, 
          whiteSpace: 'pre-wrap', 
          minHeight: '100%',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.5'
        }}>
          {text}
        </div>
      </div>

      {/* קונסולת השליטה התחתונה (עיצוב + מקלדת מאוחדים) */}
      <div style={{ width: '100%', backgroundColor: '#e5e7eb', padding: '10px 0 0 0' }}>
        
        {/* שורת העיצוב יושבת ממש על המקלדת */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
          <StyleControls 
            onColorChange={(color) => setTextColor(color)} 
            onSizeChange={(size) => setTextSize(size)} 
          />
        </div>

        {/* המקלדת */}
        <Keyboard 
          onKeyPress={handleKeyPress} 
          onDelete={handleDeleteChar}
          onClear={handleClearAll} // מעבירים את הפונקציה למקלדת
          language={language}
          onChangeLanguage={setLanguage}
        />
      </div>

    </div>
  );
}

export default App;