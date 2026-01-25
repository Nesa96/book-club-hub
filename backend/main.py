from fastapi import FastAPI, HTTPException, Depends
from typing import Optional, List, Dict
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select, Column, JSON
from contextlib import asynccontextmanager

# FAST API
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# BASE CLASS
class Review(BaseModel):
    user: str
    rating: float
    comment: str

class Book(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    author: str
    year_read: int
    year: Optional[int]
    cover_url: str
    status: str # "read" o "recommended"
    genre: Optional[str] = "Other"
    pages: Optional[int] = 0
    summary: Optional[str] = None
    reviews: List[Dict] = Field(default=[], sa_column=Column(JSON))
    media_rating: Optional[int]


#SQLite 
sqlite_file_name = "books.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session


@app.get("/books")
def get_books(status: Optional[str] = None, year: Optional[int] = None, session: Session = Depends(get_session)):
    statement = select(Book)
    if status and year:
        statement = statement.where((Book.status == status) and (Book.year_read == year))
    elif status:
        statement = statement.where(Book.status == status)
    elif year:
        statement = statement.where(Book.year_read == year)
    results = session.exec(statement)
    return results.all()

@app.get("/stats")
def get_stats(year: Optional[int] = None, session: Session = Depends(get_session)):
    statement = select(Book).where(Book.status == "read")

    if year:
        statement = statement.where(Book.year_read == year)

    read_books = session.exec(statement).all()
    avg_rating = sum(b.media_rating or 0 for b in read_books) / len(read_books) if read_books else 0
    return {
        "total_read": len(read_books),
        "average_rating": round(avg_rating, 2),
        "books_per_year": {2025: 2, 2026: 0} # Esto lo automatizaremos
    }

@app.post("/books", response_model=Book)
def create_book(book: Book, session: Session = Depends(get_session)):
    session.add(book)
    session.commit()
    session.refresh(book)
    return book

@app.patch("/books/{book_id}", response_model=Book)
def update_book(book_id: int, update_data: dict, session: Session = Depends(get_session)):
    db_book = session.get(Book, book_id)
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")

    for key, value in update_data.items():
        setattr(db_book, key, value)

    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

@app.delete("/books/{book_id}")
def delete_book(book_id: int, session: Session = Depends(get_session)):
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    session.delete(book)
    session.commit()
    return {"ok": True}