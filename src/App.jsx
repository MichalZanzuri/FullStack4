import { useState } from 'react';
import Keyboard from './components/Keyboard';
import StyleControls from './components/StyleControls';
import FileMenu from './components/FileMenu';
import './App.css';

function App() {
  // הטקסט הוא עכשיו מערך של אובייקטים: { char, color, size, selected }
  const [textArray, setTextArray] = useState([]);
  const [language, setLanguage] = useState("he");
  const [textColor, setTextColor] = useState("#1f2937");
  const [textSize, setTextSize] = useState("24px");
  const [fileName, setFileName] = useState("");

  // הוספת תו חדש (לפי העיצוב הנוכחי בסרגל)
  const handleKeyPress = (char) => {
    const newChar = {
      char: char,
      color: textColor,
      size: textSize,
      selected: false
    };
    setTextArray(prev => [...prev, newChar]);
  };

  // מחיקת תו אחרון
  const handleDeleteChar = () => setTextArray(prev => prev.slice(0, -1));
  
  // ניקוי כל המסך
  const handleClearAll = () => setTextArray([]);

  // בחירה/ביטול בחירה של תו ספציפי בלחיצה עליו
  const toggleSelectChar = (index) => {
    setTextArray(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  // בחירת כל הטקסט
  const selectAll = () => {
    setTextArray(prev => prev.map(item => ({ ...item, selected: true })));
  };

  // החלת העיצוב הנוכחי רק על מה שנבחר
  const applyToSelected = () => {
    setTextArray(prev => prev.map(item => 
      item.selected ? { ...item, color: textColor, size: textSize, selected: false } : item
    ));
  };

  // החלת העיצוב הנוכחי על כל הטקסט הקיים
  const applyToAll = () => {
    setTextArray(prev => prev.map(item => ({
      ...item, color: textColor, size: textSize, selected: false
    })));
  };

  // שמירה ופתיחה (משתמשים ב-JSON כי זה מערך אובייקטים)
  const handleSave = () => {
    if (!fileName) return alert("נא להזין שם קובץ!");
    localStorage.setItem(fileName, JSON.stringify(textArray));
    alert(`הקובץ ${fileName} נשמר!`);
  };

  const handleOpen = () => {
    const saved = localStorage.getItem(fileName);
    if (saved) {
      setTextArray(JSON.parse(saved));
    } else alert("קובץ לא נמצא");
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <FileMenu fileName={fileName} onFileNameChange={setFileName} onSave={handleSave} onOpen={handleOpen} />
      </div>

      <div className="display-area">
        <div className="text-content">
          {textArray.map((item, index) => (
            <span 
              key={index} 
              onClick={() => toggleSelectChar(index)}
              className={item.selected ? "char-selected" : ""}
              style={{ color: item.color, fontSize: item.size, cursor: 'pointer' }}
            >
              {item.char}
            </span>
          ))}
        </div>
      </div>

      <div className="bottom-console">
        <div className="style-controls-wrapper">
          <StyleControls onColorChange={setTextColor} onSizeChange={setTextSize} />
          
          <div className="edit-actions">
            <button className="action-btn" onClick={selectAll}>בחר הכל</button>
            <button className="action-btn btn-apply-sel" onClick={applyToSelected}>עדכן בחירה</button>
            <button className="action-btn btn-apply-all" onClick={applyToAll}>עדכן הכל</button>
          </div>
        </div>

        <Keyboard 
          onKeyPress={handleKeyPress} 
          onDelete={handleDeleteChar}
          onClear={handleClearAll}
          language={language}
          onChangeLanguage={setLanguage}
        />
      </div>
    </div>
  );
}

export default App;