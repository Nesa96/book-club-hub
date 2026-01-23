import { NavLink } from "react-router-dom"

function Header({pageTitle}) {

    return (
      <>

        <header className="main-header">
            <div className="header-container">
                <div className="header-brand">
                    <h1>{pageTitle}</h1>
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
                </nav>
            </div>
        </header>
    
      </>
    )
  }
  
  export default Header