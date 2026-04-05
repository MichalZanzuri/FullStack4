import React from 'react';

function StyleControls(props) {
  
  // יצרנו רכיב פנימי קטן כדי לא לשכפל את העיצוב לכל כפתור
  const FormatButton = ({ onClick, children, textColor = '#1f2937' }) => (
    <button
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(2px)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 3px 0px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 3px 0px rgba(0,0,0,0.2)';
      }}
      onClick={onClick}
      style={{
        padding: '8px 12px',
        margin: '0 4px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: textColor,
        backgroundColor: '#ffffff',
        border: 'none',
        borderRadius: '8px', // פינות מעוגלות כמו במקלדת
        cursor: 'pointer',
        transition: 'all 0.05s',
        boxShadow: '0 3px 0px rgba(0,0,0,0.2)' // ההצללה של המקלדת
      }}
    >
      {children}
    </button>
  );

  return (
    <div style={{ padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      
      {/* אזור הצבעים */}
      <span style={{ marginLeft: '8px', color: '#1f2937', fontWeight: 'bold', fontSize: '14px' }}>צבע:</span>
      <FormatButton onClick={() => props.onColorChange('black')} textColor="black">שחור</FormatButton>
      <FormatButton onClick={() => props.onColorChange('#3b82f6')} textColor="#3b82f6">כחול</FormatButton>
      <FormatButton onClick={() => props.onColorChange('#ef4444')} textColor="#ef4444">אדום</FormatButton>
      
      {/* קו הפרדה עדין */}
      <span style={{ borderLeft: '2px solid #d1d5db', margin: '0 12px', height: '20px' }}></span>
      
      {/* אזור הגדלים */}
      <span style={{ marginLeft: '8px', color: '#1f2937', fontWeight: 'bold', fontSize: '14px' }}>גודל:</span>
      <FormatButton onClick={() => props.onSizeChange('16px')}>קטן</FormatButton>
      <FormatButton onClick={() => props.onSizeChange('24px')}>רגיל</FormatButton>
      <FormatButton onClick={() => props.onSizeChange('32px')}>גדול</FormatButton>
      
    </div>
  );
}

export default StyleControls;