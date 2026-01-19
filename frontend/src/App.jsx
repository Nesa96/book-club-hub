import './App.css';
import { useEffect, useState } from 'react';

function App() {

    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch("http://localhost:8000/books");
            const books = await response.json();
            setBooks(books);
        }

        fetchBooks();
    }, []);

    return ( 
        <>
            <h1>MY BOOK CLUB</h1>

            <div>
                {books.map((book) => {
                    return(
                        <div key={book.id}>
                            <h2>{book.title}</h2>
                            <p>{book.author}</p>
                            <p>{book.summary}</p>
                        </div>
                    )
                })}
                
            </div>
        </>
    );
}

export default App
