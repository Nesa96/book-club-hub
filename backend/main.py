import os
from fastapi import FastAPI, HTTPException, Depends
from typing import Optional, List, Dict
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from sqlalchemy import Column, JSON
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from datetime import datetime

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
    month_read: Optional[str] = None
    year: Optional[int]
    cover_url: str
    status: str # "read" o "recommended"
    genre: Optional[str] = "Other"
    pages: Optional[int] = 0
    summary: Optional[str] = None
    reviews: List[Dict] = Field(default=[], sa_column=Column(JSON))
    media_rating: Optional[float]


#SQLite in case you want a local database - no need for the env file then
# sqlite_file_name = "books.db"
# sqlite_url = f"sqlite:///{sqlite_file_name}"
# engine = create_engine(sqlite_url, echo=True)

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session


@app.get("/books")
def get_books(year: Optional[int] = None, session: Session = Depends(get_session)):
    statement = select(Book)
    if year is not None:
        statement = statement.where(Book.year_read == year)
    results = session.exec(statement)
    return results.all()

@app.get("/stats")
def get_stats(session: Session = Depends(get_session)):
    statement = select(Book).where(Book.status == "read")
    all_read_books = session.exec(statement).all()

    all_stats = {}
    actual_year = datetime.now().year

    books_by_year = {}
    for b in all_read_books:
        year = b.year_read or actual_year
        if year not in books_by_year:
            books_by_year[year] = []
        books_by_year[year].append(b)

    if not all_read_books:
        return all_stats

    for year, read_books in books_by_year.items():
        rated_books = [read_book for read_book in read_books if read_book.media_rating]
        total_books = len(read_books)
        total_rated_books = len(rated_books)
        avg_rating = (sum(b.media_rating or 0 for b in read_books) / total_rated_books) if total_rated_books > 0 else 0
        total_pages = sum(b.pages for b in read_books)

        genre_map = {}
        rating_map = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        author_rating = {}
        size_map = {'short': 0, 'medium': 0, 'long': 0}
        for b in read_books:
            cat = b.genre if b.genre else "Uncategorized"
            if not cat in genre_map.keys():
                genre_map[cat] = 0
            genre_map[cat] += 1

            if b.media_rating is not None:
                floor_r = int(b.media_rating) 
                if floor_r in rating_map:
                    rating_map[floor_r] += 1

                if b.author not in author_rating.keys():
                    author_rating[b.author] = []
                author_rating[b.author].append(b.media_rating)

            if b.pages < 200:
                size_map['short'] += 1
            elif b.pages < 500:
                size_map['medium'] += 1
            else:
                size_map['long'] += 1

        
        genre_total = [{'name': k_genre, 'value': v_genre} for k_genre, v_genre in genre_map.items()]
        rating_total = [{"stars": f"{k_rating} ⭐", "count": v_rating} for k_rating, v_rating in rating_map.items()]
        longest = max(read_books, key=lambda b: b.pages if b.pages else 0)
        author_total = [{'name': k_author, 'total_books': sum(v_author)/len(v_author)} for k_author, v_author in author_rating.items()]
        author_top = sorted(author_total, key=lambda x: x['total_books'], reverse= True)[:3]
        long_total = [{'name': k_size, 'value': v_size} for k_size, v_size in size_map.items()]

        all_stats[year] = {
            "total_books": total_books,
            "total_pages": total_pages,
            "avg_rating": round(avg_rating, 2),
            "genre_distribution": genre_total,
            "rating_distribution": rating_total,
            "longest_book": longest,
            "author_top": author_top,
            "long_total": long_total
        }

    return all_stats

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