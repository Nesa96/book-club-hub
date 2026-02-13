import { useState } from "react";
import Book from "../components/Book";
import { Link } from 'react-router-dom';
import './NextBook.css';
import { API_URL } from '../config.js';

function NextBook({recBooks, onRefresh}){

    const [selectNextBook, setSelectNextBook] = useState(null);

    function pickNextBook() {
        if (recBooks.length === 0) return;

        const randomNumber = Math.floor(Math.random() * recBooks.length);
        setSelectNextBook(recBooks[randomNumber]);
    }

    async function confirmSelection() {
        try {
            const response = await fetch(`${API_URL}/books/${selectNextBook.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: 'read',
                    year_read: new Date().getFullYear() 
                }),
            });

            if (response.ok) {
                setSelectNextBook(null); // Cerramos el pop-up
                onRefresh(); 
            }
        } catch (error) {
            console.error("Error updating the book", error);
        }
    }

    return ( 
        <>
            <div className='books-container'>
                {recBooks.map((book) => {return (
                    <Link key={book.id} 
                          to={`/book/${book.id}`} 
                          className="book-card-link" 
                          state={{ isRecommended: true }}>
                        <Book  data={book} isRecommended={true}/>
                    </Link>
                )})}
            </div>

            <div className="next-book-page">
                <div className="next-book-btn">
                    <button onClick={pickNextBook} className="pick-btn">
                        ✨ Pick Next Read ✨
                    </button>
                </div>

                {selectNextBook && (
                    <div className="next-book-pop-up">
                        <div className="next-book-content">
                            <h2>Your next book is...</h2>
                            <h1>{selectNextBook.title}</h1>
                            <div className="next-book-options">
                                <button className="confirm-btn" onClick={confirmSelection}>Confirm</button>
                                <button className="discard-btn" onClick={() => setSelectNextBook(null)}>Discard</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default NextBook