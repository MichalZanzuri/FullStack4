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
      
      {/* שימי לב איך הוספנו 2 קלאסים שונים לכל כפתור: אחד לעיצוב הכללי ואחד לצבע */}
      <button className="file-menu-button btn-save" onClick={props.onSave}>
        Save
      </button>
      
      <button className="file-menu-button btn-open" onClick={props.onOpen}>
        Open
      </button>
    </div>
  );
}

export default FileMenu;