import React from 'react';

function FileMenu(props) {
  return (
    <div className="file-menu-container">
      <button className="btn-primary" onClick={props.onSave} title="שמור">
        שמור <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>save</span>
      </button>

      <button className="btn-primary" onClick={props.onSaveAs} title="שמירה בשם">
        שמירה בשם <span className="material-symbols-outlined">save_as</span>
      </button>

      <button className="btn-primary" onClick={props.onOpenClick} title="פתח מסמך">
        פתח <span className="material-symbols-outlined">folder_open</span>
      </button>
    </div>
  );
}

export default FileMenu;