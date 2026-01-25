import Book from "../components/Book";

function NextBook({recBooks, onRefresh}){

    return ( 
        <>
            <div className='books-container'>
                {recBooks.map((book) => (<Book key={book.id} data={book} onRefresh={onRefresh}/>))}
            </div>
        </>
    );


}

export default NextBook