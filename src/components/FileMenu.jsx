import React from 'react';

function FileMenu(props) {
  return (
    <div className="file-menu-container" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      
      {/* אזור 1: ניהול החלון הפעיל (שמירה ושינוי שם) */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 12px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>current file:</span>
        <input 
          type="text" 
          placeholder="document name..." 
          value={props.fileName}
          onChange={(e) => props.onFileNameChange(e.target.value)}
          className="file-menu-input"
          style={{ width: '120px' }}
        />
        <button className="file-menu-button btn-save" onClick={props.onSave} title="Save">
          Save
        </button>
        <button className="file-menu-button" style={{ backgroundColor: '#0ea5e9' }} onClick={props.onSaveAs} title="Save As">
          Save As...
        </button>
      </div>

      {/* אזור 2: פתיחת מסמכים מהזיכרון */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 12px', backgroundColor: '#e0e7ff', borderRadius: '8px', border: '1px solid #c7d2fe' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#3730a3' }}>import file:</span>
        <input 
          type="text" 
          placeholder="search for file name..." 
          value={props.fileToOpen}
          onChange={(e) => props.onFileToOpenChange(e.target.value)}
          className="file-menu-input"
          style={{ width: '130px', borderColor: '#a5b4fc' }}
        />
        <button className="file-menu-button btn-open" onClick={props.onOpen}>
          Open
        </button>
      </div>

    </div>
  );
}

export default FileMenu;