import { useEffect, useState } from "react";
import Book from "../components/Book";
import Header from "../components/Header";

function NextBook(){

    const [recBooks, setRecBooks] = useState([]);
    const page_title = "What would be the next book";

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
            <Header pageTitle={page_title} />
            <div className='books-container'>
                {recBooks.map((book) => (<Book key={book.id} data={book}/>))}
            </div>
        </>
    );


}

export default NextBook