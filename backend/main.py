from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Esto permite que React se conecte
    allow_methods=["*"],
    allow_headers=["*"],
)

class Review(BaseModel):
    user: str
    rating: float
    comment: str

class Book(BaseModel):
    id: int
    title: str
    author: str
    year_read: int
    cover_url: str
    status: str # "read" o "recommended"
    summary: Optional[str] = None
    reviews: list[Review] = []

# Temporal DB
books_db = [
    Book(id=1, title="Aún no estoy muerta", author="Holly Jackson", year_read=2025, status="read", summary="The history of a death girl solving her murder",
         cover_url = "https://m.media-amazon.com/images/I/71KJfkFKxbL.jpg"),
    Book(id=2, title="Aún no estoy muerta", author="Holly Jackson", year_read=2025, status="read", summary="The history of a death girl solving her murder",
    cover_url = "https://m.media-amazon.com/images/I/71KJfkFKxbL.jpg"),
    Book(id=3, title="Aún no estoy muerta", author="Holly Jackson", year_read=2025, status="read", summary="The history of a death girl solving her murder",
    cover_url = "https://m.media-amazon.com/images/I/71KJfkFKxbL.jpg"),
    Book(id=4, title="Aún no estoy muerta", author="Holly Jackson", year_read=2025, status="read", summary="The history of a death girl solving her murder",
         cover_url = "https://m.media-amazon.com/images/I/71KJfkFKxbL.jpg"),
    Book(id=5, title="Aún no estoy muerta", author="Holly Jackson", year_read=2025, status="read", summary="The history of a death girl solving her murder",
    cover_url = "https://m.media-amazon.com/images/I/71KJfkFKxbL.jpg"),
    Book(id=6, title="Aún no estoy muerta", author="Holly Jackson", year_read=2025, status="read", summary="The history of a death girl solving her murder",
    cover_url = "https://m.media-amazon.com/images/I/71KJfkFKxbL.jpg")
]

@app.get("/books")
def get_books(status: Optional[str] = None, year: Optional[int] = None):
    if status and year:
        return [b for b in books_db if ((b.status == status) and (b.year_read == year))]
    elif status:
        return [b for b in books_db if b.status == status]
    elif year:
        return [b for b in books_db if b.year_read == year]
    return books_db

@app.get("/stats")
def get_stats(year: Optional[int] = None):
    year_books = [b for b in books_db if b.year_read == year]
    read_books = [b for b in year_books if b.status == "read"]
    avg_rating = sum(b.rating for b in read_books) / len(read_books) if read_books else 0
    return {
        "total_read": len(read_books),
        "average_rating": round(avg_rating, 2),
        "books_per_year": {2025: 2, 2026: 0} # Esto lo automatizaremos
    }