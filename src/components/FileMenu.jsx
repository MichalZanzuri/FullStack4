import React from 'react';

function FileMenu(props) {
  return (
    <div className="file-menu-container">
      <input 
        type="text" 
        placeholder="Filename..." 
        value={props.fileName}
        onChange={(e) => props.onFileNameChange(e.target.value)}
        className="file-menu-input"
      />
      
      <button className="file-menu-button btn-save" onClick={props.onSave} title="save current file">
        Save
      </button>

      <button className="file-menu-button" style={{ backgroundColor: '#0ea5e9' }} onClick={props.onSaveAs} title="save file with a new name">
        Save As...
      </button>
      
      <button className="file-menu-button btn-open" onClick={props.onOpen} title="open a existing file">
        Open
      </button>
    </div>
  );
}

export default FileMenu;