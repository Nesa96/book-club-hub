import Book from '../components/Book';
import { Link } from 'react-router-dom';
import './BooksPage.css';

function BooksPage({books, onRefresh}){

    return ( 
        <>
            <div className='books-container'>
                {books.map((book) => {return (
                    <Link key={book.id} to={`/book/${book.id}`} className="book-card-link">
                        <Book  data={book} onRefresh={onRefresh}/>
                    </Link>
                )})}
            </div>
        </>
    );


}

export default BooksPage