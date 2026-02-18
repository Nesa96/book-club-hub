import { useState, useRef, useEffect } from 'react';
import './AddButton.css';

const AddBookButton = ({ onAddRead, onAddRecommended, closeMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="add-book-dropdown" ref={dropdownRef}>
      <button className="add-btn-main" onClick={() => setIsOpen(!isOpen)}>
        + Add Book
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={() => { onAddRead(); setIsOpen(false); if(closeMenu) closeMenu();}}>
            New read book
          </button>
          <button className="dropdown-item" onClick={() => { onAddRecommended(); setIsOpen(false); if(closeMenu) closeMenu();}}>
            New next book
          </button>
        </div>
      )}
    </div>
  );
};

export default AddBookButton;