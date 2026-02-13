import { NavLink, useLocation } from "react-router-dom";
import './Header.css';
import AddButton from '../AddButton/AddButton.jsx';
import SelectYear from "../selectYear/SelectYear.jsx";
import { useState } from "react";

function Header({ onAddRead, onAddRecommended, selectedYear, totalYears, setSelectedYear}) {

    const location = useLocation();

    const title_pages = {'/': "Book club read books",
                         '/stats': 'Reading Statistics',
                         '/next-book': 'Which would be the next book?'
    }

    const currentTitle = title_pages[location.pathname] || 'Book Club';
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <>

        <header className="main-header">
            <div className="header-container">
                <div className="header-brand">
                    <h1>{currentTitle}</h1>
                </div>

                <button className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? '✕' : '☰'} 
                </button>

                {isMenuOpen && (
                    <div className="nav-overlay" onClick={() => setIsMenuOpen(false)}></div>
                )}
                
                <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        Home
                    </NavLink>
                    <NavLink to="/all_books" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        All Books
                    </NavLink>
                    <NavLink to="/book_month" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        Book of the month
                    </NavLink>
                    <NavLink to="/next-book" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
                             onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        Next Book
                    </NavLink>
                    <NavLink to="/stats" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        Statistics
                    </NavLink>
                    <AddButton onAddRead={onAddRead} onAddRecommended={onAddRecommended} onClick={() => setIsMenuOpen(!isMenuOpen)}/>
                    <SelectYear totalYears={totalYears} selectedYear={selectedYear} setSelectedYear={setSelectedYear} 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}/>
                </nav>
            </div>
        </header>
    
      </>
    )
  }
  
  export default Header