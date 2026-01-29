import { useParams , useLocation, useNavigate} from 'react-router-dom';
import './SingleBookPage.css';
import { useState } from 'react';
import AddReview from '../components/AddReview/AddReview';
import ModifyElement from '../components/ModifyElement/ModifyElement';
import { API_URL } from "../config.js"

function SingleBookPage({allBooks, onRefresh}){

    const location = useLocation();
    const isRecommended = location.state?.isRecommended || false;

    const navigate = useNavigate();
    const { id } = useParams();
    const book = allBooks.find(b => b.id === parseInt(id));
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editValue, setEditValue] = useState("");
    const [editType, setEditType] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [initialValue, setInitialValue] = useState("");
    
    if (!book) {
        return <div className="error-message">Book wasn't found, please go back to the general view</div>;
    }

    async function removeBook() {
        const confirmed = window.confirm("Are you sure you want to delete this book?");
        if (!confirmed) return;

        try {
            const response = await fetch(`${API_URL}/books/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onRefresh(); 
                isRecommended ? navigate('/next-book') : navigate('/');; 
                console.log("Book deleted successfully");
            } else {
                alert("Failed to delete the book. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    async function backToRec() {
        const confirmed = window.confirm("Are you sure you want to put this book back in the next book section?");
        if (!confirmed) return;

        try {
            const response = await fetch(`${API_URL}/books/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({status: 'recommended'})
            });

            if (response.ok) {
                onRefresh(); 
                isRecommended ? navigate('/next-book') : navigate('/');; 
                console.log("Book move successfully");
            } else {
                alert("Failed to move the book. Please try again.");
            }
        } catch (error) {
            console.error("Error moving book:", error);
        }
    };

    async function deleteReview(indexToDelete) {
        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (!confirmed) return;

        const updatedReviews = book.reviews.filter((_, index) => index !== indexToDelete);
        const totalScore = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const new_media_review = (totalScore / updatedReviews.length).toFixed(1);

        try {
            const response = await fetch(`${API_URL}/books/${book.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviews: updatedReviews, media_rating: new_media_review })
            });

            if (response.ok) {
                onRefresh();
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    async function onEditSave(newValue) {
        let payload = {};

        if (editType === "Review") {
            const updatedReviews = [...book.reviews];
            
            updatedReviews[editIndex] = { 
                ...updatedReviews[editIndex],
                [editValue]: editValue === 'rating' ? parseFloat(newValue) : newValue 
            };

            const totalScore = updatedReviews.reduce((sum, rev) => sum + parseFloat(rev.rating), 0);
            const newMedia = (totalScore / updatedReviews.length).toFixed(1);

            payload = { 
                reviews: updatedReviews, 
                media_rating: parseFloat(newMedia) 
            };
        } 

        else {
            const finalValue = (editValue === 'year' || editValue === 'pages') 
                ? parseInt(newValue, 10) 
                : newValue;

            payload = { [editValue]: finalValue };
        }

        try {
            const response = await fetch(`${API_URL}/books/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                onRefresh();
                setIsEditOpen(false); 
            } else {
                console.error("Server error when updating");
                alert("Error saving the value");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    async function editElement(mod_type, field, value, index = null) {
        setEditType(mod_type);     
        setEditValue(field);   
        setInitialValue(value);  
        setEditIndex(index);     
        setIsEditOpen(true);
    }

    return (
        <div className='single-book-container'>
            <div className='top-bar'>
                <button className="back-button" onClick={() => navigate(-1)}>
                    {isRecommended ? "← Back to next book page" : "← Back to all books page"}
                </button>

                <div className='change-btns'>
                    <button className="remove-book" onClick={removeBook}>
                            REMOVE BOOK
                    </button>
                    <button className="back-to-recommended" onClick={backToRec}>
                            BACK TO RECOMMENDED
                    </button>
                </div>
            </div>

            <div className="book-main-content"> 

                <div className='book-details'>
                    <div className="editable-group">
                        <img src={book.cover_url} alt={`${book.title} cover`} />
                        <button className="edit-btn-inline" onClick={() => editElement("Book", 'cover_url', book.cover_url)}>
                            ✏️
                        </button>
                    </div>

                    {!isRecommended && book.media_rating !== undefined && book.media_rating !== null && (
                        <div className="book-average-rating">
                            <div className="stars-container">
                                <div className="stars-empty">
                                    <span>★★★★★</span>
                                </div>
                                <div 
                                    className="stars-filled" 
                                    style={{ width: `${(book.media_rating / 5) * 100}%` }}
                                >
                                    <span>★★★★★</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className='book-detail-info'>
                    <div className="category-month-row">
                        <div className="editable-group">
                            <span className="book-category">{book.genre || 'Other'}</span>
                            <button className="edit-btn-inline" onClick={() => editElement("Book", 'genre', book.genre)}>
                                ✏️
                            </button>
                        </div>

                        {!isRecommended && (
                            <div className="month-read-section">
                                {book.month_read ? (
                                    <div className="editable-group">
                                        <span className="book-month">
                                            <strong>{book.month_read}</strong>
                                        </span>
                                        <button className="edit-btn-inline" onClick={() => editElement("Book", 'month_read', book.month_read)}>
                                            ✏️
                                        </button>
                                    </div>
                                ) : (
                                    <div className="set-month-inline">
                                        <button className="edit-btn-inline" onClick={() => editElement("Book", 'month_read', book.month_read)}>
                                            Check when read - month
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <h1>{book.title}</h1>
                    <h2 className="book-author">by {book.author}</h2>
                    
                    <div className="book-description">
                        <div className="editable-group">
                            <h3>Summary</h3>
                            <button className="edit-btn-inline" onClick={() => editElement("Book", 'summary', book.summary)}>
                                ✏️
                            </button>
                        </div>
                        {book.summary ? (
                            book.summary.split('\n').map((text, index) => (
                                text.trim() !== '' && <p key={index} style={{ marginBottom: '3px' }}>{text}</p>
                            ))
                        ) : (<p> No available summary for this book</p>
                        )}
                    </div>

                    <div className="book-meta">
                        <div className="editable-item">
                            <p><strong>Published:</strong> {book.year}</p>
                            <button className="edit-btn-inline" onClick={() => editElement("Book", 'year', book.year)}>
                                ✏️
                            </button>
                        </div>

                        <p><strong>Year {isRecommended ? "recommended" : "read"}:</strong> {book.year_read}</p>

                        <div className="editable-item">
                            <p><strong>Pages:</strong> {book.pages || 'N/A'}</p>
                            <button className="edit-btn-inline" onClick={() => editElement("Book", 'pages', book.pages)}>
                                ✏️
                            </button>
                        </div>      
                    </div>
                </div> 
            </div>

            {!isRecommended && (

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
                                    <div className="rating-group">
                                        <span className="rating">⭐ {rev.rating}</span>
                                        <button className="edit-btn-inline" onClick={() => editElement("Review", 'rating', rev.rating, index)}>
                                            ✏️
                                        </button>
                                    </div>
                                </div>
                                <div className="comment-group">
                                    <p className="review-comment">"{rev.comment}"</p>
                                    <button className="edit-btn-inline" onClick={() => editElement("Review", 'comment', rev.comment, index)}>
                                        ✏️
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No reviews yet</p>
                    )}
                </div>
            )}       

            {isEditOpen && (
                <ModifyElement 
                    entityType= {editType}
                    fieldName = {editValue} 
                    initialValue = {initialValue}
                    onSave={onEditSave} 
                    onClose={() => setIsEditOpen(false)}
                />
            )}
        </div>
    );

}

export default SingleBookPage