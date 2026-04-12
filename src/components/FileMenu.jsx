import React from 'react';

function FileMenu(props) {
  return (
    <div className="modern-file-menu">
      
      {/* כפתור שמור */}
      <button className="btn-pill btn-save-pill" onClick={props.onSave} title="שמור">
        שמור <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>save</span>
      </button>

      {/* כפתור שמירה בשם */}
      <button className="btn-pill btn-action-pill" onClick={props.onSaveAs} title="שמירה בשם">
        שמירה בשם <span className="material-symbols-outlined">save_as</span>
      </button>

      {/* כפתור פתח מתיקייה */}
      <button className="btn-pill btn-action-pill" onClick={props.onOpenClick} title="פתח מסמך">
        פתח <span className="material-symbols-outlined">folder_open</span>
      </button>

    </div>
  );
}

export default FileMenu;