import { useState } from 'react';
import Keyboard from './components/Keyboard';
import StyleControls from './components/StyleControls';
import FileMenu from './components/FileMenu';
import './App.css';

function App() {
  const [textArray, setTextArray] = useState([]);
  
  // מחסניות לביטול ושחזור
  const [history, setHistory] = useState([]); // save action (Undo)
  const [redoStack, setRedoStack] = useState([]); // save action (Redo)
  
  const [language, setLanguage] = useState("he");
  const [fileName, setFileName] = useState("");

  const [searchChar, setSearchChar] = useState("");
  const [replaceChar, setReplaceChar] = useState("");

  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // פונקציה חכמה שמעדכנת את הטקסט, שומרת היסטוריה, ומאפסת את ה-Redo
  const updateTextWithHistory = (newArr) => {
    setHistory(prev => [...prev, textArray].slice(-20)); // save max 20 states in history
    setRedoStack([]); // איפוס Redo בכל פעולה חדשה
    setTextArray(newArr);
  };

  // Undo 
  const handleUndo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1)); // from history
    setRedoStack(prev => [...prev, textArray]); // current state to Redo
    setTextArray(previousState);
  };

  // Redo
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1)); //from Redo
    setHistory(prev => [...prev, textArray]); // to history
    setTextArray(nextState);
  };

  const handleSearch = () => {
    if (!searchChar) return;
    setTextArray(prev => prev.map(item => ({
      ...item,
      selected: item.char === searchChar
    })));
  };

  const handleReplace = () => {
    if (!searchChar) return;
    updateTextWithHistory(textArray.map(item => 
      item.char === searchChar ? { ...item, char: replaceChar || "" } : item
    ));
    setSearchChar("");
    setReplaceChar("");
  };

  const handleKeyPress = (char) => {
    const newChar = {
      char, color: textColor, size: `${textSize}px`, font: fontFamily,
      bold: isBold, italic: isItalic, underline: isUnderline, selected: false
    };
    updateTextWithHistory([...textArray, newChar]);
  };

  const handleDeleteChar = () => updateTextWithHistory(textArray.slice(0, -1));

  const handleDeleteWord = () => {
    if (textArray.length === 0) return;
    let lastSpaceIndex = -1;
    for (let i = textArray.length - 2; i >= 0; i--) {
      if (textArray[i].char === ' ') { lastSpaceIndex = i; break; }
    }
    updateTextWithHistory(lastSpaceIndex === -1 ? [] : textArray.slice(0, lastSpaceIndex + 1));
  };
  
  const handleClearAll = () => updateTextWithHistory([]);

  const toggleSelectChar = (index) => {
    setTextArray(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  const selectAll = () => setTextArray(prev => prev.map(item => ({ ...item, selected: true })));

  const applyToSelected = () => {
    updateTextWithHistory(textArray.map(item => 
      item.selected ? { ...item, color: textColor, size: `${textSize}px`, font: fontFamily, bold: isBold, italic: isItalic, underline: isUnderline, selected: false } : item
    ));
  };

  const applyToAll = () => {
    updateTextWithHistory(textArray.map(item => ({
      ...item, color: textColor, size: `${textSize}px`, font: fontFamily, bold: isBold, italic: isItalic, underline: isUnderline, selected: false
    })));
  };

  // שמירה רגילה (Save) - שומר על השם הקיים
  const handleSave = () => {
    if (!fileName) return alert("Please enter a filename, or use Save As!");
    localStorage.setItem(fileName, JSON.stringify(textArray));
    alert(`The file "${fileName}" has been saved successfully!`);
  };

  // שמירה בשם (Save As) - מבקש שם חדש
  const handleSaveAs = () => {
    const newFileName = prompt("Please enter a new filename for the file:", fileName || "new_copy");
    
    // אם המשתמש הכניס שם ולחץ אישור (ולא ביטל)
    if (newFileName) {
      setFileName(newFileName); // מעדכנים את השם בחלונית
      localStorage.setItem(newFileName, JSON.stringify(textArray));
      alert(`The file has been saved with the new name: "${newFileName}"`);
    }
  };

  const handleOpen = () => {
    if (!fileName) return alert("Please enter a filename to open!");
    const saved = localStorage.getItem(fileName);
    if (saved) {
      updateTextWithHistory(JSON.parse(saved));
    } else alert(`File not found with the name "${fileName}"`);
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <div className="top-bar-controls">
          <FileMenu 
            fileName={fileName} 
            onFileNameChange={setFileName} 
            onSave={handleSave} 
            onSaveAs={handleSaveAs}
            onOpen={handleOpen} 
          />
          
          <div className="search-replace-bar">
            <input placeholder="search..." value={searchChar} onChange={(e) => setSearchChar(e.target.value)} maxLength="1" />
            <input placeholder="replace with..." value={replaceChar} onChange={(e) => setReplaceChar(e.target.value)} maxLength="1" />
            <button onClick={handleSearch}>search</button>
            <button onClick={handleReplace}>replace</button>
          </div>

          {/* Undo and Redo buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="undo-btn" onClick={handleUndo} disabled={history.length === 0} title="cancel last action">
              ↩
            </button>
            <button className="undo-btn" onClick={handleRedo} disabled={redoStack.length === 0} title="revert undo">
              ↪
            </button>
          </div>
        </div>
      </div>

      <div className="display-area">
        <div className="text-content">
          {textArray.map((item, index) => (
            <span key={index} onClick={() => toggleSelectChar(index)} className={item.selected ? "char-selected" : ""}
              style={{ color: item.color, fontSize: item.size, fontFamily: item.font, fontWeight: item.bold ? 'bold' : 'normal', fontStyle: item.italic ? 'italic' : 'normal', textDecoration: item.underline ? 'underline' : 'none', cursor: 'pointer' }}>
              {item.char}
            </span>
          ))}
        </div>
      </div>

      <div className="bottom-console">
        <div className="style-controls-wrapper">
          <StyleControls 
            textColor={textColor} onColorChange={setTextColor}
            textSize={textSize} onSizeChange={(change) => setTextSize(prev => Math.max(10, prev + change))}
            fontFamily={fontFamily} onFontChange={setFontFamily}
            isBold={isBold} toggleBold={() => setIsBold(!isBold)}
            isItalic={isItalic} toggleItalic={() => setIsItalic(!isItalic)}
            isUnderline={isUnderline} toggleUnderline={() => setIsUnderline(!isUnderline)}
          />
          <div className="edit-actions">
            <button className="action-btn" onClick={selectAll}>select all</button>
            <button className="action-btn btn-apply-sel" onClick={applyToSelected}>update selected</button>
            <button className="action-btn btn-apply-all" onClick={applyToAll}>update all</button>
          </div>
        </div>

        <Keyboard onKeyPress={handleKeyPress} onDelete={handleDeleteChar} onDeleteWord={handleDeleteWord} onClear={handleClearAll} language={language} onChangeLanguage={setLanguage} />
      </div>
    </div>
  );
}

export default App;