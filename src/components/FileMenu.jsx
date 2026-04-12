import React from 'react';

function FileMenu(props) {
  return (
    <div className="file-menu-container">
      
      <button className="btn-primary" onClick={props.onSave} title="Save">
        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>save</span>
        Save
      </button>

      <button className="btn-secondary" onClick={props.onSaveAs} title="Save As">
        <span className="material-symbols-outlined">edit_document</span>
        Save As
      </button>

      <button className="btn-secondary" onClick={props.onOpenClick} title="Open Document">
        <span className="material-symbols-outlined">folder_open</span>
        Open Document
      </button>

    </div>
  );
}

export default FileMenu;