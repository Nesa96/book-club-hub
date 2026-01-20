import { useEffect, useState } from 'react';
import Book from '../components/Book';
import Header from '../components/Header';

function BooksPage(){

    const [books, setBooks] = useState([]);
    const page_title = "All our books of 2026";

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
            <Header pageTitle={page_title} />
            <div className='books-container'>
                {books.map((book) => (<Book key={book.id} data={book}/>))}
            </div>
        </>
    );


}

export default BooksPage