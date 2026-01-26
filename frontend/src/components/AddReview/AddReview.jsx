import { useState } from 'react';
import './AddReview.css';

function AddReview({ bookId, currentReviews, onRefresh, onClose }) {
    const [newReview, setNewReview] = useState({ user: '', rating: '', comment: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const ratingFloat = parseFloat(newReview.rating);

        if (isNaN(ratingFloat) || (ratingFloat>5)) {
            alert("Please enter a valid number, lower than 5");
            return;
        }

        const reviewToSend = {
            ...newReview,
            rating: ratingFloat 
        };

        const updatedReviews = [...(currentReviews || []), reviewToSend];

        const totalScore = updatedReviews.reduce((sum, rev) => sum + rev.rating, 0);
        const new_media_review = (totalScore / updatedReviews.length).toFixed(2);

        try {
            const response = await fetch(`http://localhost:8000/books/${bookId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviews: updatedReviews, media_rating:new_media_review})
            });

            if (response.ok) {
                onRefresh(); 
                onClose(); 
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="review-overlay">
            <div className="review-content">
                <div className="review-header">
                    <h2>Write a Review</h2>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="review-form">
                    <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={newReview.user}
                        onChange={(e) => setNewReview({...newReview, user: e.target.value})}
                        required 
                    />
                    <div className="rating-select">
                        <input
                            placeholder='Your score - max 5'
                            type="number"
                            set="0.1"
                            value={newReview.rating}
                            onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
                        />
                    </div>
                    <textarea 
                        placeholder="What did you think of the book?" 
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        required
                    ></textarea>
                    <button type="submit" className="submit-btn">Post Review</button>
                </form>
            </div>
        </div>
    );
}

export default AddReview;