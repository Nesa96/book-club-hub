import { useState } from 'react';
import './NewBookInfo.css';
import { API_URL } from '../../config.js'

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
    const [isbn, setIsbn] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [isLoading, setIsLoading] = useState(false);

    const searchInGoogleBooks = async () => {
        if (!isbn && (!formData.title || !formData.author)) {
            alert("Please add the title and author of the book or the ISBN to search more info")
            return;
        }
        
        setIsLoading(true);
        try {
          const response = await fetch(`${API_URL}/scrape-book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    author: formData.author,
                    isbn: isbn.replace(/-/g, '').trim()
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setFormData({
                    ...formData,
                    title: data.title || '',
                    author: data.author || '',
                    year: data.year || '',
                    summary: data.summary || '',
                    cover_url: data.cover_url || '',
                    pages: data.pages || 0,
                    genre: data.genre ||''
                });
            } else {
                alert(data.detail || "Book not found in Goodreads");
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
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
            const response = await fetch(`${API_URL}/books`, {
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
    <div className="book-overlay">
      <div className="book-content" onClick={(e) => e.stopPropagation()}>

        <button className="close-x" onClick={onClose}>
          &times;
        </button>

        <h2>Add {type === 'read' ? 'new book' : 'next book recommendation'}</h2>

        <form className="book-form" onSubmit={addBookDB}>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />

          <label htmlFor="author">Author</label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} />

          <label htmlFor="isbn">ISBN - only if Author and Title are not working</label>
          <input type="text" name="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} />

          <button type="button" onClick={searchInGoogleBooks} className="magic-btn" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search More Info"}
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