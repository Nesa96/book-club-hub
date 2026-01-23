import { useEffect, useState } from 'react';
import Book from '../components/Book';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import './BooksPage.css';

function BooksPage(){

    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch("http://localhost:8000/books?status=read");
            const books = await response.json();
            setBooks(books);
        }

        fetchBooks();
    }, []);

    return ( 
        <>
            <div className='books-container'>
                {books.map((book) => {return (
                    <Link key={book.id} to={`/book/${book.id}`} className="book-card-link" state={{ book: book }}>
                        <Book  data={book}/>
                    </Link>
                )})}
            </div>
        </>
    );


}

export default BooksPage