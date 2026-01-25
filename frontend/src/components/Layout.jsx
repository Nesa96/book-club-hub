import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import { useState } from 'react';
import NewBookInfo from './AddButton/NewBookInfo';

const Layout = ({onRefresh}) => {

    const [isAddBookOpen, setIsAddBookOpen] = useState(false);
    const [bookType, setBookType] = useState("read");

    function openAddBook(type) {
        setBookType(type);
        setIsAddBookOpen(true);
    }

    function closeAddBook() {
        setIsAddBookOpen(false);
    }


  return (
    <div>
      <Header onAddRead={() => openAddBook("read")} onAddRecommended={() => openAddBook("recommended")}/>
      <main className="page-content">
        <Outlet />
      </main>

      {isAddBookOpen && (
        <NewBookInfo type={bookType} onClose={closeAddBook} onRefresh={onRefresh}/>
      )}
    </div>
  );
};

export default Layout;