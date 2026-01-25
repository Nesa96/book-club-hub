import { useState } from 'react';
import './NewBookInfo.css';

function NewBookInfo({ type, onClose, onRefresh}) {

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        year: '',
        year_read: '2026',
        pages: 0,
        summary: '',
        cover_url: '',
        status: type
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [isLoading, setIsLoading] = useState(false);

    const searchInGoogleBooks = async () => {
        if (!formData.title && !formData.author) {
            alert("Please add the title and author of the book to search more info")
            return;
        }
        
        setIsLoading(true);
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${formData.title}+inauthor:${formData.author}`);
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                const info = data.items[0].volumeInfo;
                setFormData({
                    ...formData,
                    author: info.authors ? info.authors[0] : formData.author,
                    year: info.publishedDate ? info.publishedDate.split('-')[0] : '',
                    pages: info.pageCount || 0,
                    summary: info.description || '',
                    cover_url: info.imageLinks ? info.imageLinks.thumbnail.replace('http:', 'https:') : '',
                    genre: info.categories ? info.categories[0] : 'Other'
                });
            } 
        } finally {
            setIsLoading(false);
        }
    };

    const addBookDB = async (e) => {
        e.preventDefault();
        const bookData = {
            ...formData,
            pages: parseInt(formData.pages, 10) || 0,
            year: formData.year ? parseInt(formData.year, 10) : null,
        };

        try {
            const response = await fetch('http://localhost:8000/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData),
            });

            if (response.ok) {
                alert("Book Saved!");
                onRefresh();
                onClose();
            } else {
                const errorDetail = await response.json();
                console.error("Server Error:", errorDetail);
                alert("There was a problem saving the book.");
            }
        } catch (error) {
            console.error("Conexion error:", error);
            alert("There was a problem connecting with the backend.");
        }
    };

  return (
    <div className="book-overlay" onClick={onClose}>
      <div className="book-content" onClick={(e) => e.stopPropagation()}>

        <button className="close-x" onClick={onClose}>
          &times;
        </button>

        <h2>Add {type === 'read' ? 'New Book' : 'Next book becommendation'}</h2>

        <form className="book-form" onSubmit={addBookDB}>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />

          <label htmlFor="author">Author</label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} />

          <button type="button" onClick={searchInGoogleBooks} className="magic-btn">
            Search More Info
          </button>

          <div className="extra-info">
            <div className="form-row">
              <div className="form-group">
                <label>Year</label>
                <input type="text" name="year" value={formData.year} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Pages</label>
                <input type="number" name="pages" value={formData.pages} onChange={handleChange} />
              </div>
            </div>

            <label>Genre</label>
            <input type="text" name="genre" value={formData.genre} onChange={handleChange} />

            <label>Summary</label>
            <textarea name="summary" value={formData.summary} onChange={handleChange} rows="3" />
          </div>

          <button type="submit" className="save-btn">Save Book</button>
        </form>
      </div>
    </div>
  );
};

export default NewBookInfo;