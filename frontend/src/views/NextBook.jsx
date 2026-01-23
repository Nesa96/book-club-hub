import { useEffect, useState } from "react";
import Book from "../components/Book";

function NextBook(){

    const [recBooks, setRecBooks] = useState([]);

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch("http://localhost:8000/books?status=recommended");
            const books = await response.json();
            setRecBooks(books);
        }

        fetchBooks();
    }, []);

    return ( 
        <>
            <div className='books-container'>
                {recBooks.map((book) => (<Book key={book.id} data={book}/>))}
            </div>
        </>
    );


}

export default NextBook