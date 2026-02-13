import { useLocation } from 'react-router-dom';
import './Book.css';

function Book({data, isRecommended}){

    return (

        <div className="book-card">
            <div className='book-image-card'>
                <img src={data.cover_url} alt={data.title} />
            </div>
            <div className='book-info'>
                {!isRecommended && (<h2>{data.month_read ? data.month_read : "READING"}</h2>)}
                <h3>{data.title}</h3>
                <p>{data.author}</p>
            </div>
        </div>
    )

}

export default Book