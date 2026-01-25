import Book from "../components/Book";
import { Link } from 'react-router-dom';

function NextBook({recBooks, onRefresh}){

    return ( 
        <>
            <div className='books-container'>
                {recBooks.map((book) => {return (
                    <Link key={book.id} 
                          to={`/book/${book.id}`} 
                          className="book-card-link" 
                          state={{ isRecommended: true }}>
                        <Book  data={book} onRefresh={onRefresh}/>
                    </Link>
                )})}
            </div>
        </>
    );


}

export default NextBook