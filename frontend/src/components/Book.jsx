import './Book.css';

function Book({data, onRefresh}){

    return (

        <div className="book-card">
            <img src={data.cover_url} alt="Book Image" />
            <h3>{data.title}</h3>
            <p>{data.author}</p>
        </div>
    )

}

export default Book