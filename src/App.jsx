import { useState } from 'react';
import Keyboard from './components/Keyboard';
import StyleControls from './components/StyleControls';
import FileMenu from './components/FileMenu';
import './App.css';

function App() {
  // --- חלק ג': ניהול חלונות מרובים ---
  // כל חלון מחזיק את הטקסט, ההיסטוריה ושם הקובץ שלו
  const [windows, setWindows] = useState([
    { id: Date.now(), fileName: "", textArray: [], history: [], redoStack: [] }
  ]);
  const [activeWindowId, setActiveWindowId] = useState(windows[0].id);

  const [language, setLanguage] = useState("he");
  const [fileToOpen, setFileToOpen] = useState(""); // הסטייט של תיבת הייבוא
  const [searchChar, setSearchChar] = useState("");
  const [replaceChar, setReplaceChar] = useState("");

  // כלי העיצוב (גלובליים, משפיעים על החלון הפעיל)
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // מציאת החלון הפעיל כרגע
  const activeWindow = windows.find(w => w.id === activeWindowId) || windows[0];

  // פונקציית עזר לעדכון סטייט של החלון הפעיל
  const updateActiveWindow = (updates) => {
    setWindows(prev => prev.map(w => w.id === activeWindowId ? { ...w, ...updates } : w));
  };

  // עדכון טקסט עם שמירת היסטוריה לחלון הפעיל
  const updateTextWithHistory = (newArr) => {
    const newHistory = [...activeWindow.history, activeWindow.textArray].slice(-20);
    updateActiveWindow({
      textArray: newArr,
      history: newHistory,
      redoStack: [] // איפוס Redo
    });
  };

  // ניהול חלונות חדשים
  const handleNewWindow = () => {
    const newWin = { id: Date.now(), fileName: `מסמך חדש`, textArray: [], history: [], redoStack: [] };
    setWindows(prev => [...prev, newWin]);
    setActiveWindowId(newWin.id); // מעביר פוקוס מיד לחלון החדש
  };

  const handleCloseWindow = (idToClose, e) => {
    e.stopPropagation(); // מונע בחירה של החלון כשלוחצים על ה-X
    if (windows.length === 1) return alert("אי אפשר לסגור את החלון האחרון!");
    
    // מציאת החלון שאנחנו רוצים לסגור
    const winToClose = windows.find(w => w.id === idToClose);
    
    // ההצעה לשמור את הקובץ לפני הסגירה (הדרישה של חלק ג')
    const confirmSave = window.confirm(`האם תרצי לשמור את "${winToClose.fileName || 'מסמך ללא שם'}" לפני הסגירה?`);
    
    if (confirmSave) {
      let saveName = winToClose.fileName;
      // אם אין לקובץ שם, נבקש מהמשתמש להזין אחד
      if (!saveName) {
        saveName = prompt("הכניסי שם לשמירת הקובץ:", "מסמך_שנסגר");
      }
      // מבצעים את השמירה ל-Local Storage
      if (saveName) {
        localStorage.setItem(saveName, JSON.stringify(winToClose.textArray));
        alert(`הקובץ "${saveName}" נשמר בהצלחה!`);
      }
    }
    
    // סגירת החלון בפועל
    const newWindows = windows.filter(w => w.id !== idToClose);
    setWindows(newWindows);
    
    // אם סגרנו את החלון הפעיל, נעביר פוקוס לחלון הראשון ברשימה שנשארה
    if (activeWindowId === idToClose) {
      setActiveWindowId(newWindows[0].id);
    }
  };

  // --- פעולות עריכה על החלון הפעיל ---
  const handleUndo = () => {
    if (activeWindow.history.length === 0) return;
    const previousState = activeWindow.history[activeWindow.history.length - 1];
    updateActiveWindow({
      history: activeWindow.history.slice(0, -1),
      redoStack: [...activeWindow.redoStack, activeWindow.textArray],
      textArray: previousState
    });
  };

  const handleRedo = () => {
    if (activeWindow.redoStack.length === 0) return;
    const nextState = activeWindow.redoStack[activeWindow.redoStack.length - 1];
    updateActiveWindow({
      redoStack: activeWindow.redoStack.slice(0, -1),
      history: [...activeWindow.history, activeWindow.textArray],
      textArray: nextState
    });
  };

  const handleSearch = () => {
    if (!searchChar) return;
    updateActiveWindow({
      textArray: activeWindow.textArray.map(item => ({ ...item, selected: item.char === searchChar }))
    });
  };

  const handleReplace = () => {
    if (!searchChar) return;
    updateTextWithHistory(activeWindow.textArray.map(item => 
      item.char === searchChar ? { ...item, char: replaceChar || "" } : item
    ));
    setSearchChar("");
    setReplaceChar("");
  };

  const handleKeyPress = (char) => {
    const newChar = { char, color: textColor, size: `${textSize}px`, font: fontFamily, bold: isBold, italic: isItalic, underline: isUnderline, selected: false };
    updateTextWithHistory([...activeWindow.textArray, newChar]);
  };

  const handleDeleteChar = () => updateTextWithHistory(activeWindow.textArray.slice(0, -1));

  const handleDeleteWord = () => {
    if (activeWindow.textArray.length === 0) return;
    let lastSpaceIndex = -1;
    for (let i = activeWindow.textArray.length - 2; i >= 0; i--) {
      if (activeWindow.textArray[i].char === ' ') { lastSpaceIndex = i; break; }
    }
    updateTextWithHistory(lastSpaceIndex === -1 ? [] : activeWindow.textArray.slice(0, lastSpaceIndex + 1));
  };
  
  const handleClearAll = () => updateTextWithHistory([]);

  const toggleSelectChar = (index) => {
    updateActiveWindow({
      textArray: activeWindow.textArray.map((item, i) => i === index ? { ...item, selected: !item.selected } : item)
    });
  };

  const selectAll = () => updateActiveWindow({
    textArray: activeWindow.textArray.map(item => ({ ...item, selected: true }))
  });

  const applyToSelected = () => {
    updateTextWithHistory(activeWindow.textArray.map(item => 
      item.selected ? { ...item, color: textColor, size: `${textSize}px`, font: fontFamily, bold: isBold, italic: isItalic, underline: isUnderline, selected: false } : item
    ));
  };

  const applyToAll = () => {
    updateTextWithHistory(activeWindow.textArray.map(item => ({
      ...item, color: textColor, size: `${textSize}px`, font: fontFamily, bold: isBold, italic: isItalic, underline: isUnderline, selected: false
    })));
  };

  // --- ניהול קבצים (פועל על החלון הפעיל) ---
  const handleSave = () => {
    if (!activeWindow.fileName) return alert("נא להזין שם קובץ, או להשתמש ב-Save As!");
    localStorage.setItem(activeWindow.fileName, JSON.stringify(activeWindow.textArray));
    alert(`הקובץ "${activeWindow.fileName}" נשמר בהצלחה!`);
  };

  const handleSaveAs = () => {
    const newFileName = prompt("הכניסי שם חדש לשמירת הקובץ:", activeWindow.fileName || "עותק_חדש");
    if (newFileName) {
      updateActiveWindow({ fileName: newFileName });
      localStorage.setItem(newFileName, JSON.stringify(activeWindow.textArray));
      alert(`הקובץ נשמר בשם החדש: "${newFileName}"`);
    }
  };

  const handleOpen = () => {
    if (!fileToOpen) return alert("נא להזין שם קובץ לפתיחה בתיבת הייבוא!");
    
    const saved = localStorage.getItem(fileToOpen);
    
    if (saved) {
      try {
        const loadedContent = JSON.parse(saved);
        
        // יצירת חלון חדש לגמרי
        const newWin = { 
          id: Date.now(), 
          fileName: fileToOpen, 
          textArray: loadedContent, 
          history: [], 
          redoStack: [] 
        };
        
        setWindows(prev => [...prev, newWin]);
        setActiveWindowId(newWin.id);
        
        // מנקים את תיבת החיפוש אחרי שהקובץ נפתח בהצלחה
        setFileToOpen(""); 
        
      } catch (e) {
        alert("שגיאה בקריאת הקובץ.");
      }
    } else {
      alert(`לא נמצא קובץ בשם "${fileToOpen}" ב-Local Storage.`);
    }
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        {/* מכולה ראשית שמחלקת את המסך לצד ימין (כלים) וצד שמאל (Undo/Redo) */}
        <div className="top-bar-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', paddingBottom: '5px' }}>
          
          {/* --- צד ימין: חלון חדש, קבצים, חיפוש והחלפה --- */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            
            {/* כפתור חלון חדש (נשאר בצד ימין למעלה) */}
            <button className="action-btn" style={{ backgroundColor: '#10b981', color: 'white', height: '38px', padding: '0 15px', whiteSpace: 'nowrap' }} onClick={handleNewWindow}>
              + חלון חדש
            </button>
            
            {/* עמודה ששמה את השמירה/ייבוא למעלה, ואת החיפוש/החלפה למטה */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* שורה 1: שמירה וייבוא (FileMenu) */}
              <FileMenu 
                fileName={activeWindow.fileName} 
                onFileNameChange={(name) => updateActiveWindow({ fileName: name })} 
                onSave={handleSave} 
                onSaveAs={handleSaveAs}
                fileToOpen={fileToOpen}                 
                onFileToOpenChange={setFileToOpen}      
                onOpen={handleOpen} 
              />
              
              {/* שורה 2: בלוק חיפוש והחלפה (מתחת לקבצים) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '6px 12px', backgroundColor: '#fef9c3', borderRadius: '8px', border: '1px solid #fde047', alignSelf: 'flex-start' }}>
                
                {/* שורת חיפוש */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#854d0e', width: '45px' }}>חפש:</span>
                  <input 
                    placeholder="תו..." 
                    value={searchChar} 
                    onChange={(e) => setSearchChar(e.target.value)} 
                    maxLength="1" 
                    className="file-menu-input" 
                    style={{ width: '45px', textAlign: 'center', borderColor: '#facc15', padding: '4px' }} 
                  />
                  <button className="file-menu-button" style={{ backgroundColor: '#3b82f6', padding: '4px 10px', fontSize: '12px' }} onClick={handleSearch}>חפש</button>
                </div>

                {/* שורת החלפה */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#854d0e', width: '45px' }}>החלף:</span>
                  <input 
                    placeholder="תו..." 
                    value={replaceChar} 
                    onChange={(e) => setReplaceChar(e.target.value)} 
                    maxLength="1" 
                    className="file-menu-input" 
                    style={{ width: '45px', textAlign: 'center', borderColor: '#facc15', padding: '4px' }} 
                  />
                  <button className="file-menu-button" style={{ backgroundColor: '#2563eb', padding: '4px 10px', fontSize: '12px' }} onClick={handleReplace}>החלף</button>
                </div>

              </div>
            </div>
          </div>

          {/* --- צד שמאל למעלה: Undo ו-Redo --- */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="undo-btn" style={{ padding: '8px 15px', fontSize: '14px' }} onClick={handleUndo} disabled={activeWindow.history.length === 0} title="בטל פעולה">↩ Undo</button>
            <button className="undo-btn" style={{ padding: '8px 15px', fontSize: '14px' }} onClick={handleRedo} disabled={activeWindow.redoStack.length === 0} title="בצע שוב">Redo ↪</button>
          </div>

        </div>
      </div>

      {/* תצוגת החלונות */}
      <div className="windows-workspace">
        {windows.map((win) => (
          <div 
            key={win.id} 
            className={`window-frame ${win.id === activeWindowId ? 'window-active' : ''}`}
            onClick={() => setActiveWindowId(win.id)}
          >
            <div className="window-header">
              <span className="window-title">{win.fileName || "מסמך ללא שם"}</span>
              <button className="window-close" onClick={(e) => handleCloseWindow(win.id, e)}>✖</button>
            </div>
            <div className="window-content">
              {win.textArray.map((item, index) => (
                <span key={index} onClick={(e) => { e.stopPropagation(); toggleSelectChar(index); }} className={item.selected ? "char-selected" : ""}
                  style={{ color: item.color, fontSize: item.size, fontFamily: item.font, fontWeight: item.bold ? 'bold' : 'normal', fontStyle: item.italic ? 'italic' : 'normal', textDecoration: item.underline ? 'underline' : 'none', cursor: 'pointer' }}>
                  {item.char}
                </span>
              ))}
            </div>
          </div>
        ))}
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
            <button className="action-btn" onClick={selectAll}>בחר הכל</button>
            <button className="action-btn btn-apply-sel" onClick={applyToSelected}>עדכן בחירה</button>
            <button className="action-btn btn-apply-all" onClick={applyToAll}>עדכן הכל</button>
          </div>
        </div>

        <Keyboard onKeyPress={handleKeyPress} onDelete={handleDeleteChar} onDeleteWord={handleDeleteWord} onClear={handleClearAll} language={language} onChangeLanguage={setLanguage} />
      </div>
    </div>
  );
}

export default App;