import os
from fastapi import FastAPI, HTTPException, Depends
from typing import Optional, List, Dict
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
from sqlalchemy import Column, JSON
from contextlib import asynccontextmanager
from dotenv import load_dotenv

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
def get_stats(year: Optional[int] = None, session: Session = Depends(get_session)):
    statement = select(Book).where(Book.status == "read")

    if year:
        statement = statement.where(Book.year_read == year)

    read_books = session.exec(statement).all()

    if not read_books:
        return {
            "total_books": 0,
            "total_pages": 0,
            "avg_rating": 0,
            "genre_distribution": [],
            "rating_distribution": [],
            "longest_book": None
        }

    total_books = len(read_books)
    avg_rating = sum(b.media_rating or 0 for b in read_books) / total_books
    total_pages = sum(b.pages for b in read_books)

    genre_map = {}
    rating_map = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for b in read_books:
        cat = b.category if b.category else "Uncategorized"
        if not cat in genre_map.keys():
            genre_map[cat] = 0
        genre_map[cat] += 1

        if b.media_rating is not None:
            floor_r = int(b.media_rating) 
            if floor_r in rating_map:
                rating_map[floor_r] += 1
    
    genre_dist = [{'name': key, 'value': value} for key, value in genre_map.items()]
    rating_dist = [{"stars": f"{k} ⭐", "count": v} for k, v in rating_map.items()]
    longest = max(read_books, key=lambda b: b.pages if b.pages else 0)

    return {
        "total_books": total_books,
        "total_pages": total_pages,
        "avg_rating": round(avg_rating, 2),
        "genre_distribution": genre_dist,
        "rating_distribution": rating_dist,
        "longest_book": longest
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