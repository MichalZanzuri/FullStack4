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
  const [isLoginMode, setIsLoginMode] = useState(true);

  // סטייטים לחלונות קופצים (Modals) החדשים
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // כל חלון מחזיק את הטקסט, ההיסטוריה ושם הקובץ שלו
  const [windows, setWindows] = useState([
    { id: Date.now(), fileName: "", textArray: [], history: [], redoStack: [] }
  ]);
  const [activeWindowId, setActiveWindowId] = useState(windows[0].id);

  const [language, setLanguage] = useState("he");
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
    if (!uName || !pWord) return alert("נא להזין שם משתמש וסיסמה!");
    const usersDB = JSON.parse(localStorage.getItem("app_users_db") || "{}");

    if (isLoginMode) {
      if (usersDB[uName] && usersDB[uName] === pWord) {
        setCurrentUser(uName); setUsernameInput(""); setPasswordInput("");
      } else alert("שם משתמש או סיסמה שגויים. נסי שוב!");
    } else {
      if (usersDB[uName]) alert("שם המשתמש הזה כבר תפוס, אנא בחרי שם אחר או עברי למסך ההתחברות.");
      else {
        usersDB[uName] = pWord; 
        localStorage.setItem("app_users_db", JSON.stringify(usersDB));
        setCurrentUser(uName); setUsernameInput(""); setPasswordInput("");
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
          <input type="text" placeholder="שם משתמש" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '15px', textAlign: 'center', fontSize: '15px' }} />
          <input type="password" placeholder="סיסמה" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAuth(); }} style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '20px', textAlign: 'center', fontSize: '15px' }} />
          <button onClick={handleAuth} style={{ padding: '10px', width: '100%', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>
            {isLoginMode ? 'היכנסי למערכת' : 'הרשמה למערכת'}
          </button>
          <button onClick={() => { setIsLoginMode(!isLoginMode); setUsernameInput(""); setPasswordInput(""); }} style={{ background: 'none', border: 'none', color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}>
            {isLoginMode ? 'אין לך חשבון? לחצי כאן להרשמה' : 'יש לך כבר חשבון? לחצי כאן להתחברות'}
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setCurrentUser("");
    setWindows([{ id: Date.now(), fileName: "", textArray: [], history: [], redoStack: [] }]);
  };

  const activeWindow = windows.find(w => w.id === activeWindowId) || windows[0];
  const updateActiveWindow = (updates) => setWindows(prev => prev.map(w => w.id === activeWindowId ? { ...w, ...updates } : w));
  
  const updateTextWithHistory = (newArr) => {
    const newHistory = [...activeWindow.history, activeWindow.textArray].slice(-20);
    updateActiveWindow({ textArray: newArr, history: newHistory, redoStack: [] });
  };

  // --- יצירת חלון מתוך תבנית (Modal) ---
  const handleCreateTemplate = (templateName, templateContentStr) => {
    const textArray = templateContentStr.split('').map(char => ({
      char, color: textColor, size: `${textSize}px`, font: fontFamily, bold: isBold, italic: isItalic, underline: isUnderline, selected: false
    }));
    const newWin = { id: Date.now(), fileName: templateName, textArray: textArray, history: [], redoStack: [] };
    setWindows(prev => [...prev, newWin]);
    setActiveWindowId(newWin.id);
    setShowNewModal(false);
  };

  const handleCloseWindow = (idToClose, e) => {
    e.stopPropagation(); 
    if (windows.length === 1) return alert("cannot close the last window!"); 
    const winToClose = windows.find(w => w.id === idToClose);
    const confirmSave = window.confirm(`do you want to save "${winToClose.fileName || 'Untitled'}" before closing?`);
    if (confirmSave) {
      let saveName = winToClose.fileName || prompt("enter a name for the file:", "document");
      if (saveName) {
        localStorage.setItem(`${currentUser}_${saveName}`, JSON.stringify(winToClose.textArray));
        alert(`the file "${saveName}" was saved successfully!`);
      }
    }
    const newWindows = windows.filter(w => w.id !== idToClose);
    setWindows(newWindows);
    if (activeWindowId === idToClose) setActiveWindowId(newWindows[0].id);
  };

  // פעולות עריכה
  const handleUndo = () => { if (activeWindow.history.length === 0) return; const previousState = activeWindow.history[activeWindow.history.length - 1]; updateActiveWindow({ history: activeWindow.history.slice(0, -1), redoStack: [...activeWindow.redoStack, activeWindow.textArray], textArray: previousState }); };
  const handleRedo = () => { if (activeWindow.redoStack.length === 0) return; const nextState = activeWindow.redoStack[activeWindow.redoStack.length - 1]; updateActiveWindow({ redoStack: activeWindow.redoStack.slice(0, -1), history: [...activeWindow.history, activeWindow.textArray], textArray: nextState }); };
  const handleSearch = () => { if (!searchChar) return; updateActiveWindow({ textArray: activeWindow.textArray.map(item => ({ ...item, selected: item.char === searchChar })) }); };
  const handleReplace = () => { if (!searchChar) return; updateTextWithHistory(activeWindow.textArray.map(item => item.char === searchChar ? { ...item, char: replaceChar || "" } : item )); setSearchChar(""); setReplaceChar(""); };
  const handleKeyPress = (char) => updateTextWithHistory([...activeWindow.textArray, { char, color: textColor, size: `${textSize}px`, font: fontFamily, bold: isBold, italic: isItalic, underline: isUnderline, selected: false }]);
  const handleDeleteChar = () => updateTextWithHistory(activeWindow.textArray.slice(0, -1));
  const handleDeleteWord = () => { if (activeWindow.textArray.length === 0) return; let lastSpaceIndex = -1; for (let i = activeWindow.textArray.length - 2; i >= 0; i--) { if (activeWindow.textArray[i].char === ' ') { lastSpaceIndex = i; break; } } updateTextWithHistory(lastSpaceIndex === -1 ? [] : activeWindow.textArray.slice(0, lastSpaceIndex + 1)); };
  const handleClearAll = () => updateTextWithHistory([]);
  const toggleSelectChar = (index) => updateActiveWindow({ textArray: activeWindow.textArray.map((item, i) => i === index ? { ...item, selected: !item.selected } : item) });
  const selectAll = () => updateActiveWindow({ textArray: activeWindow.textArray.map(item => ({ ...item, selected: true })) });
  const applyToSelected = () => updateTextWithHistory(activeWindow.textArray.map(item => item.selected ? { ...item, color: textColor, size: `${textSize}px`, font: fontFamily, bold: isBold, italic: isItalic, underline: isUnderline, selected: false } : item ));
  const applyToAll = () => updateTextWithHistory(activeWindow.textArray.map(item => ({ ...item, color: textColor, size: `${textSize}px`, font: fontFamily, bold: isBold, italic: isItalic, underline: isUnderline, selected: false })));

  // שמירה וייבוא
  const handleSave = () => {
    if (!activeWindow.fileName) return handleSaveAs();
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

  // שליפת קבצים של המשתמש בלבד
  const getUserFiles = () => {
    const files = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(`${currentUser}_`)) {
        files.push(key.replace(`${currentUser}_`, ''));
      }
    }
    return files;
  };

  // פתיחת קובץ ספציפי מהחלון הקופץ
  const handleOpenSpecificFile = (fileName) => {
    const saved = localStorage.getItem(`${currentUser}_${fileName}`);
    if (saved) {
      try {
        const loadedContent = JSON.parse(saved);
        const newWin = { id: Date.now(), fileName: fileName, textArray: loadedContent, history: [], redoStack: [] };
        setWindows(prev => [...prev, newWin]);
        setActiveWindowId(newWin.id);
        setShowOpenModal(false);
      } catch (e) { alert("error reading the file."); }
    }
  };

  return (
    <div className="app-container">
      
      {/* -------------------- הבאנר העליון החדש -------------------- */}
      <header className="modern-banner">
        {/* ימין: תפריט, כותרת, ושם משתמש */}
        <div className="banner-right">
          <button className="banner-icon-btn"><span className="material-symbols-outlined">menu</span></button>
          <span className="banner-title">המסמך שלי</span>
          <span className="banner-subtitle">מחוברת כעת: {currentUser}</span>
        </div>

        {/* שמאל: כפתורי פעולה והגדרות/התנתקות */}
        <div className="banner-left">
          <FileMenu 
            onSave={handleSave} 
            onSaveAs={handleSaveAs} 
            onOpenClick={() => setShowOpenModal(true)} 
          />
          <button className="btn-new-doc" onClick={() => setShowNewModal(true)}>
            + חלון חדש
          </button>
          <button className="banner-icon-btn" title="התנתק" onClick={handleLogout}>
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      {/* -------------------- סרגל כלים משני (חיפוש ו-Undo) -------------------- */}
      {/* -------------------- סרגל כלים משני (חיפוש ו-Undo) -------------------- */}
      <div className="secondary-toolbar">
        
        {/* שורת חיפוש והחלפה בעיצוב הגלולה החדש */}
        <div className="search-replace-pill">
          <span className="sr-label">חפש:</span>
          <input placeholder="תו" value={searchChar} onChange={(e) => setSearchChar(e.target.value)} maxLength="1" className="sr-input" />
          <button className="btn-pill btn-search-pill" onClick={handleSearch}>
            חפש <span className="material-symbols-outlined" style={{fontSize: '18px'}}>search</span>
          </button>
          
          <div className="sr-divider"></div>
          
          <span className="sr-label">החלף:</span>
          <input placeholder="תו" value={replaceChar} onChange={(e) => setReplaceChar(e.target.value)} maxLength="1" className="sr-input" />
          <button className="btn-pill btn-replace-pill" onClick={handleReplace}>
            החלף <span className="material-symbols-outlined" style={{fontSize: '18px'}}>find_replace</span>
          </button>
        </div>

        {/* כפתורי Undo / Redo מעודכנים */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="undo-btn" onClick={handleUndo} disabled={activeWindow.history.length === 0} title="Undo">
            <span className="material-symbols-outlined">undo</span> Undo
          </button>
          <button className="undo-btn" onClick={handleRedo} disabled={activeWindow.redoStack.length === 0} title="Redo">
            Redo <span className="material-symbols-outlined">redo</span>
          </button>
        </div>

      </div>

      {/* -------------------- מרחב החלונות -------------------- */}
      <div className="windows-workspace">
        {windows.map((win) => (
          <div key={win.id} className={`window-frame ${win.id === activeWindowId ? 'window-active' : ''}`} onClick={() => setActiveWindowId(win.id)}>
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

      {/* -------------------- הקונסולה למטה (עיצוב + מקלדת) -------------------- */}
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

      {/* -------------------- חלונות קופצים (Modals) -------------------- */}
      
      {/* מודאל פתיחת קובץ */}
      {showOpenModal && (
        <div className="modal-overlay" onClick={() => setShowOpenModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">המסמכים השמורים של {currentUser}</h3>
            <div className="file-list">
              {getUserFiles().length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>התיקייה ריקה</p>
              ) : (
                getUserFiles().map(file => (
                  <button key={file} className="file-item" onClick={() => handleOpenSpecificFile(file)}>
                    <span className="material-symbols-outlined" style={{fontSize: '18px', color: '#0284c7'}}>description</span> 
                    {file}
                  </button>
                ))
              )}
            </div>
            <button className="btn-close-modal" onClick={() => setShowOpenModal(false)}>ביטול</button>
          </div>
        </div>
      )}

      {/* מודאל מסמך חדש מתוך תבנית */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">בחירת תבנית למסמך חדש</h3>
            <div className="template-grid">
              <button className="template-card" onClick={() => handleCreateTemplate("מסמך ריק", "")}>
                <span className="material-symbols-outlined" style={{fontSize: '32px', color: '#64748b'}}>draft</span><br/>מסמך ריק
              </button>
              <button className="template-card" onClick={() => handleCreateTemplate("מכתב רשמי", "לכבוד:\n\nהנדון: \n\nא.ג.נ,\n\n\n\nבברכה,\n")}>
                <span className="material-symbols-outlined" style={{fontSize: '32px', color: '#0284c7'}}>mail</span><br/>מכתב רשמי
              </button>
              <button className="template-card" onClick={() => handleCreateTemplate("רשימת מטלות", "מטלות להיום:\n- \n- \n- \n")}>
                <span className="material-symbols-outlined" style={{fontSize: '32px', color: '#10b981'}}>checklist</span><br/>רשימת מטלות
              </button>
            </div>
            <button className="btn-close-modal" onClick={() => setShowNewModal(false)}>ביטול</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;