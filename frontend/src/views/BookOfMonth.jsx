import './BookOfMonth.css';

function BookOfMonth({ book }) {
  if (!book) return null;

  const month_actual = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date()).toUpperCase();

  return (
    <div className="bom-container">
      <div className="bom-card-horizontal">
        <div className='bom-image-wrapper'>
          <img src={book.cover_url} alt={book.title} />
        </div>

        <div className='bom-info-content'>
          <p className="bom-month-star">{month_actual}</p>
          <h2 className="bom-badge">This month we have</h2>
          <p className="bom-description">
            {book.summary || "No more info"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookOfMonth;
