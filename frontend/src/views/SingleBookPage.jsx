import { useParams , useLocation, useNavigate} from 'react-router-dom';
import './SingleBookPage.css';

function SingleBookPage(){

    const location = useLocation();
    const navigate = useNavigate();
    const { book } = location.state || {};
    
    if (!book) {
        return <div className="error-message">Book wasn't found, please go back to the general view</div>;
    }

    return (
        <div className='single-book-container'>
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back to all books page
            </button>

            <div className="book-main-content"> 
                <div className='book-detail-image'>
                    <img src={book.cover_url} alt={`${book.title} cover`} />
                </div>

                <div className='book-detail-info'>
                    <span className="book-category">{book.genre || 'Other'}</span>
                    <h1>{book.title}</h1>
                    <h2 className="book-author">by {book.author}</h2>
                    
                    <div className="book-description">
                        <h3>Summary</h3>
                        {book.summary ? (
                            book.summary.split('\n').map((text, index) => (
                                text.trim() !== '' && <p key={index} style={{ marginBottom: '3px' }}>{text}</p>
                            ))
                        ) : (<p> No available summary for this book</p>
                        )}
                    </div>

                    <div className="book-meta">
                        <p><strong>Published:</strong> {book.year}</p>
                        <p><strong>Year Read:</strong> {book.year_read}</p>
                        <p><strong>Pages:</strong> {book.pages || 'N/A'}</p>
                    </div>
                </div> 
            </div>

            <div className="book-reviews-section">
                <h3>Our Reviews</h3>
                {book.reviews && book.reviews.length > 0 ? (
                    book.reviews.map((rev, index) => (
                        <div key={index} className="review-card">
                            <div className="review-header">
                                <strong>{rev.user}</strong>
                                <span className="rating">⭐ {rev.rating}</span>
                            </div>
                            <p className="review-comment">"{rev.comment}"</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet</p>
                )}
            </div>   
        </div>
    );

}

export default SingleBookPage