import { useParams , useLocation, useNavigate} from 'react-router-dom';
import './SingleBookPage.css';
import { useState } from 'react';
import AddReview from '../components/AddReview/AddReview';

function SingleBookPage({allBooks, onRefresh}){

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const book = allBooks.find(b => b.id === parseInt(id));
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    
    if (!book) {
        return <div className="error-message">Book wasn't found, please go back to the general view</div>;
    }

    async function removeBook() {
        const confirmed = window.confirm("Are you sure you want to delete this book?");
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:8000/books/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onRefresh(); 
                navigate('/'); 
                console.log("Book deleted successfully");
            } else {
                alert("Failed to delete the book. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    }

    async function deleteReview(indexToDelete) {
        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (!confirmed) return;

        const updatedReviews = book.reviews.filter((_, index) => index !== indexToDelete)

        try {
            const response = await fetch(`http://localhost:8000/books/${book.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviews: updatedReviews })
            });

            if (response.ok) {
                onRefresh();
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    return (
        <div className='single-book-container'>
            <div className='top-bar'>
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back to all books page
                </button>

                <button className="remove-book" onClick={removeBook}>
                        REMOVE BOOK
                </button>
            </div>

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
                <button className="add-review-btn" onClick={() => setIsReviewOpen(true)}>
                    ADD NEW REVIEW
                </button>

                {isReviewOpen && (
                    <AddReview 
                        bookId={id} 
                        currentReviews={book.reviews} 
                        onRefresh={onRefresh} 
                        onClose={() => setIsReviewOpen(false)}
                    />
                )}

                {book.reviews && book.reviews.length > 0 ? (
                    book.reviews.map((rev, index) => (
                        <div key={index} className="review-card">
                            <button className="remove-review" onClick={() => deleteReview(index)}>Remove Review</button>
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