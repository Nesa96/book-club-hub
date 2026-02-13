import Book from '../components/Book';
import { Link } from 'react-router-dom';
import './BooksPage.css';

function BooksPage({books}){

    const monthOrder = {"ENERO": 1, "FEBRERO": 2, "MARZO": 3, "ABRIL": 4, "MAYO": 5, "JUNIO": 6, "JULIO": 7, "AGOSTO": 8, 
                        "SEPTIEMBRE": 9, "OCTUBRE": 10, "NOVIEMBRE": 11, "DICIEMBRE": 12};

    books.sort((a, b) => {
        const monthA = a.month_read ? monthOrder[a.month_read.toUpperCase()] : 13;
        const monthB = b.month_read ? monthOrder[b.month_read.toUpperCase()] : 13;
        
        return monthA - monthB;
    })

    return ( 
        <>
            <div className='books-container'>
                {books.map((book) => {return (
                    <Link key={book.id} to={`/book/${book.id}`} className="book-card-link">
                        <Book  data={book} isRecommended={false}/>
                    </Link>
                )})}
            </div>
        </>
    );


}

export default BooksPage