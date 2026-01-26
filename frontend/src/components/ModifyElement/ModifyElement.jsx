import { useState } from "react";
import './ModifyElement.css';

function ModifyElement({ entityType, fieldName, initialValue, onSave, onClose }) {
    const [newValue, setNewValue] = useState(initialValue);

    const renderInput = () => {
        if (fieldName === 'comment' || fieldName === 'summary') {
            return (
                <textarea 
                    autoFocus
                    value={newValue} 
                    onChange={(e) => setNewValue(e.target.value)} 
                    className="modify-textarea"
                />
            );
        }
        
        return (
            <input 
                autoFocus
                type={fieldName === 'rating' || fieldName === 'pages' ? 'number' : 'text'}
                step={fieldName === 'rating' ? '0.1' : '1'}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="modify-input"
            />
        );
    };

    return (
        <div className="review-overlay">
            <div className="modify-content">
                <h3>Edit {entityType} {fieldName}</h3>
                <div className="input-wrapper">
                    {renderInput()}
                </div>
                <div className="modify-actions">
                    <button className="save-btn" onClick={() => onSave(newValue)}>Save Change</button>
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ModifyElement