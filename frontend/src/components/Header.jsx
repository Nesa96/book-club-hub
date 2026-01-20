import { NavLink } from "react-router-dom"

function Header({pageTitle}) {

    return (
      <>

            <h1>{pageTitle}</h1>

            <div className="header-btns">
                
                    <NavLink to="/">
                      <button className="btn">
                          All Books
                      </button>
                    </NavLink>

                    <NavLink to="/next-book">
                      <button className="btn">
                          Next Book
                      </button>
                    </NavLink>

                    <NavLink to="/stats">
                      <button className="btn">
                          Statistics
                      </button>
                    </NavLink>
                    
               
            </div>
    
      </>
    )
  }
  
  export default Header