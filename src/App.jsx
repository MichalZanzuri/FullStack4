import { useState } from 'react';
import Keyboard from './components/Keyboard';
import StyleControls from './components/StyleControls';
import FileMenu from './components/FileMenu';
import './App.css';

function App() {
  // --- חלק ד': ניהול משתמשים עם סיסמה ---
  const [currentUser, setCurrentUser] = useState(""); 
  
  // סטייטים למסך ההתחברות
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true); // true = התחברות, false = הרשמה

  // כל חלון מחזיק את הטקסט, ההיסטוריה ושם הקובץ שלו
  const [windows, setWindows] = useState([
    { id: Date.now(), fileName: "", textArray: [], history: [], redoStack: [] }
  ]);
  const [activeWindowId, setActiveWindowId] = useState(windows[0].id);

  const [language, setLanguage] = useState("he");
  const [fileToOpen, setFileToOpen] = useState("");
  const [searchChar, setSearchChar] = useState("");
  const [replaceChar, setReplaceChar] = useState("");

  // כלי העיצוב 
  const [textColor, setTextColor] = useState("#000000");
  const [textSize, setTextSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // --- לוגיקת אימות משתמשים ---
  const handleAuth = () => {
    const uName = usernameInput.trim();
    const pWord = passwordInput.trim();

    if (!uName || !pWord) {
      return alert("נא להזין שם משתמש וסיסמה!");
    }

    // משיכת "מסד הנתונים" של המשתמשים מהזיכרון
    const usersDB = JSON.parse(localStorage.getItem("app_users_db") || "{}");

    if (isLoginMode) {
      // ניסיון התחברות
      if (usersDB[uName] && usersDB[uName] === pWord) {
        setCurrentUser(uName);
        setUsernameInput("");
        setPasswordInput("");
      } else {
        alert("שם משתמש או סיסמה שגויים. נסי שוב!");
      }
    } else {
      // ניסיון הרשמה
      if (usersDB[uName]) {
        alert("שם המשתמש הזה כבר תפוס, אנא בחרי שם אחר או עברי למסך ההתחברות.");
      } else {
        usersDB[uName] = pWord; // שמירת הסיסמה למשתמש
        localStorage.setItem("app_users_db", JSON.stringify(usersDB));
        setCurrentUser(uName);
        setUsernameInput("");
        setPasswordInput("");
        alert("החשבון נוצר בהצלחה! ברוכה הבאה למערכת.");
      }
    }
  };

  // --- מסך התחברות/הרשמה ---
  if (!currentUser) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f9ff', fontFamily: 'Arial' }}>
        <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center', borderTop: '5px solid #0ea5e9', width: '300px' }}>
          <h2 style={{ color: '#0369a1', marginBottom: '5px' }}>מערכת עריכת טקסטים</h2>
          <p style={{ marginBottom: '25px', color: '#64748b', fontWeight: 'bold' }}>
            {isLoginMode ? 'התחברות לחשבון קיים' : 'יצירת חשבון חדש'}
          </p>
          
          <input 
            type="text" 
            placeholder="שם משתמש" 
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '15px', textAlign: 'center', fontSize: '15px' }}
          />
          
          <input 
            type="password" 
            placeholder="סיסמה" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAuth(); }}
            style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '20px', textAlign: 'center', fontSize: '15px' }}
          />
          
          <button 
            onClick={handleAuth}
            style={{ padding: '10px', width: '100%', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>
            {isLoginMode ? 'היכנסי למערכת' : 'הרשמה למערכת'}
          </button>

          <button 
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setUsernameInput("");
              setPasswordInput("");
            }}
            style={{ background: 'none', border: 'none', color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}>
            {isLoginMode ? 'אין לך חשבון? לחצי כאן להרשמה' : 'יש לך כבר חשבון? לחצי כאן להתחברות'}
          </button>
        </div>
      </div>
    );
  }

  // --- פונקציית התנתקות ---
  const handleLogout = () => {
    setCurrentUser("");
    setWindows([{ id: Date.now(), fileName: "", textArray: [], history: [], redoStack: [] }]);
    setFileToOpen("");
  };

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
      redoStack: [] // reset Redo
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
    if (windows.length === 1) return alert("cannot close the last window!"); 
    
    const winToClose = windows.find(w => w.id === idToClose);
    
    const confirmSave = window.confirm(`do you want to save "${winToClose.fileName || 'Untitled'}" before closing?`);
    
    if (confirmSave) {
      let saveName = winToClose.fileName;
      if (!saveName) {
        saveName = prompt("enter a name for the file:", "document");
      }
      if (saveName) {
        localStorage.setItem(`${currentUser}_${saveName}`, JSON.stringify(winToClose.textArray));
        alert(`the file "${saveName}" was saved successfully!`);
      }
    }
    
    const newWindows = windows.filter(w => w.id !== idToClose);
    setWindows(newWindows);
    
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

  // --- ניהול קבצים מופרד למשתמשים ---
  const handleSave = () => {
    if (!activeWindow.fileName) return alert("Save As!");
    localStorage.setItem(`${currentUser}_${activeWindow.fileName}`, JSON.stringify(activeWindow.textArray));
    alert(`the file "${activeWindow.fileName}" was saved successfully!`);
  };

  const handleSaveAs = () => {
    const newFileName = prompt("enter a new name for the file:", activeWindow.fileName || "Untitled");
    if (newFileName) {
      updateActiveWindow({ fileName: newFileName });
      localStorage.setItem(`${currentUser}_${newFileName}`, JSON.stringify(activeWindow.textArray));
      alert(`the file was saved with the new name: "${newFileName}"`);
    }
  };

  const handleOpen = () => {
    if (!fileToOpen) return alert("please enter a file name to open in the import box!");

    const saved = localStorage.getItem(`${currentUser}_${fileToOpen}`);
    
    if (saved) {
      try {
        const loadedContent = JSON.parse(saved);
        
        const newWin = { 
          id: Date.now(), 
          fileName: fileToOpen, 
          textArray: loadedContent, 
          history: [], 
          redoStack: [] 
        };
        
        setWindows(prev => [...prev, newWin]);
        setActiveWindowId(newWin.id);
        
        setFileToOpen(""); 
        
      } catch (e) {
        alert("error reading the file.");
      }
    } else {
      alert(`file not found: "${fileToOpen}" for user "${currentUser}".`);
    }
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <div className="top-bar-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', paddingBottom: '5px' }}>
          
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', backgroundColor: '#f0f9ff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0369a1', textAlign: 'center' }}>Hello, {currentUser}</span>
              <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Logout</button>
            </div>

            <button className="action-btn" style={{ backgroundColor: '#10b981', color: 'white', height: '38px', padding: '0 15px', whiteSpace: 'nowrap' }} onClick={handleNewWindow}>
              + חלון חדש
            </button>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              <FileMenu 
                fileName={activeWindow.fileName} 
                onFileNameChange={(name) => updateActiveWindow({ fileName: name })} 
                onSave={handleSave} 
                onSaveAs={handleSaveAs}
                fileToOpen={fileToOpen}                 
                onFileToOpenChange={setFileToOpen}      
                onOpen={handleOpen} 
              />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px 12px', backgroundColor: '#fef9c3', borderRadius: '8px', border: '1px solid #fde047', width: '390px', alignSelf: 'flex-start', boxSizing: 'border-box', direction: 'rtl' }}>
                
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#854d0e', flex: '0 0 60px', textAlign: 'left' }}>search:</span>
                  <input 
                    placeholder="char" 
                    value={searchChar} 
                    onChange={(e) => setSearchChar(e.target.value)} 
                    maxLength="1" 
                    className="file-menu-input" 
                    style={{ flex: 1, textAlign: 'center', borderColor: '#facc15', padding: '0 8px', height: '32px', boxSizing: 'border-box' }} 
                  />
                  <button className="file-menu-button" style={{ backgroundColor: '#3b82f6', padding: '0 15px', fontSize: '13px', flex: '0 0 85px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleSearch}>search</button>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#854d0e', flex: '0 0 60px', textAlign: 'left' }}>change:</span>
                  <input 
                    placeholder="char" 
                    value={replaceChar} 
                    onChange={(e) => setReplaceChar(e.target.value)} 
                    maxLength="1" 
                    className="file-menu-input" 
                    style={{ flex: 1, textAlign: 'center', borderColor: '#facc15', padding: '0 8px', height: '32px', boxSizing: 'border-box' }} 
                  />
                  <button className="file-menu-button" style={{ backgroundColor: '#2563eb', padding: '0 15px', fontSize: '13px', flex: '0 0 85px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleReplace}>change</button>
                </div>

              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="undo-btn" style={{ padding: '8px 15px', fontSize: '14px' }} onClick={handleUndo} disabled={activeWindow.history.length === 0} title="Undo">↩ Undo</button>
            <button className="undo-btn" style={{ padding: '8px 15px', fontSize: '14px' }} onClick={handleRedo} disabled={activeWindow.redoStack.length === 0} title="Redo">Redo ↪</button>
          </div>

        </div>
      </div>

      <div className="windows-workspace">
        {windows.map((win) => (
          <div 
            key={win.id} 
            className={`window-frame ${win.id === activeWindowId ? 'window-active' : ''}`}
            onClick={() => setActiveWindowId(win.id)}
          >
            <div className="window-header">
              <span className="window-title">{win.fileName || "Untitled Document"}</span>
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
            <button className="action-btn" onClick={selectAll}>Select All</button>
            <button className="action-btn btn-apply-sel" onClick={applyToSelected}>Apply to Selection</button>
            <button className="action-btn btn-apply-all" onClick={applyToAll}>Apply to All</button>
          </div>
        </div>

        <Keyboard onKeyPress={handleKeyPress} onDelete={handleDeleteChar} onDeleteWord={handleDeleteWord} onClear={handleClearAll} language={language} onChangeLanguage={setLanguage} />
      </div>
    </div>
  );
}

export default App;