import './BookOfMonth.css';

function BookOfMonth({ books, selectedYear }) {

  const book = books.find(b => (b.status === 'read') && (!b.month_read))
  if (!book) return null;

  const months = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO",
    "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  const read_year_books =  books.filter(book => (book.status === 'read') && (book.year_read === selectedYear) && (book.month_read));
  const order_books = read_year_books.slice().sort((a, b) => {
    return months.indexOf(a.month_read.toUpperCase()) - months.indexOf(b.month_read.toUpperCase());
  });

  let month_actual = ""
  if (read_year_books.length > 0) {
    const lastBook = order_books.at(-1);
    const currentIndex = months.indexOf(lastBook.month_read.toUpperCase());
    const nextIndex = (currentIndex + 1) % 12;
    month_actual = months[nextIndex];
  }

  return (
    <div className="bom-container">
      <div className="bom-card-horizontal">
        <div className='bom-image-wrapper'>
          <img src={book.cover_url} alt={book.title} />
        </div>

        <div className='bom-info-content'>
          <p className="bom-month-star">{month_actual}</p>
          <h2 className="bom-badge">READING BOOK</h2>
          <p className="bom-description">
            {book.summary || "No more info"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookOfMonth;
