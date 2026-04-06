import React from 'react';

function StyleControls(props) {
  const FormatButton = ({ onClick, children, isActive }) => (
    <button onClick={onClick} className={isActive ? "format-btn active" : "format-btn"}>
      {children}
    </button>
  );

  return (
    <div className="style-controls-container">
      <select value={props.fontFamily} onChange={(e) => props.onFontChange(e.target.value)} className="font-select">
        <option value="Arial, sans-serif">Arial</option>
        <option value="'Courier New', Courier, monospace">Courier New</option>
        <option value="'Times New Roman', Times, serif">Times New Roman</option>
        <option value="Tahoma, sans-serif">Tahoma</option>
        <option value="Verdana, sans-serif">Verdana</option>
        <option value="Georgia, serif">Georgia</option>
        <option value="'Comic Sans MS', cursive">Comic Sans</option>
        <option value="Impact, sans-serif">Impact</option>
        <option value="'Lucida Console', monospace">Lucida Console</option>
      </select>

      <input type="color" value={props.textColor} onChange={(e) => props.onColorChange(e.target.value)} className="color-picker" />

      <div className="size-controls">
        <button onClick={() => props.onSizeChange(-2)}>-</button>
        <span className="size-display">{props.textSize}</span>
        <button onClick={() => props.onSizeChange(2)}>+</button>
      </div>

      <div className="format-group">
        <FormatButton isActive={props.isBold} onClick={props.toggleBold}>B</FormatButton>
        <FormatButton isActive={props.isItalic} onClick={props.toggleItalic}>I</FormatButton>
        <FormatButton isActive={props.isUnderline} onClick={props.toggleUnderline}>U</FormatButton>
      </div>
    </div>
  );
}

export default StyleControls;