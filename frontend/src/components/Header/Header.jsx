import { NavLink, useLocation } from "react-router-dom";
import './Header.css';
import AddButton from '../AddButton/AddButton.jsx';

function Header({ onAddRead, onAddRecommended }) {

    const location = useLocation();

    const title_pages = {'/': "BOOK CLUB - All our readed books",
                         '/stats': 'Reading Statistics',
                         '/next-book': 'Which would be the next book?'
    }

    const currentTitle = title_pages[location.pathname] || 'Book Club';

    return (
      <>

        <header className="main-header">
            <div className="header-container">
                <div className="header-brand">
                    <h1>{currentTitle}</h1>
                </div>
                
                <nav className="header-nav">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        All Books
                    </NavLink>
                    <NavLink to="/next-book" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Next Book
                    </NavLink>
                    <NavLink to="/stats" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Statistics
                    </NavLink>
                    <AddButton onAddRead={onAddRead} onAddRecommended={onAddRecommended} />
                </nav>
            </div>
        </header>
    
      </>
    )
  }
  
  export default Header