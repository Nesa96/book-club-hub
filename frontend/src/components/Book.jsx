import './Book.css';

function Book({data}){

    return (

        <div className="book-card">
            <h2>{data.month_read ? data.month_read : "READING"}</h2>
            <img src={data.cover_url} alt="Book Image" />
            <h3>{data.title}</h3>
            <p>{data.author}</p>
        </div>
    )

}

export default Book