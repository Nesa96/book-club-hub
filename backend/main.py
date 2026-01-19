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

class Book(BaseModel):
    id: int
    title: str
    author: str
    year_read: int
    rating: float
    status: str # "read" o "recommended"
    summary: Optional[str] = None

# Temporal DB
books_db = [
    Book(id=1, title="The Seven Husbands of Evelyn Hugo", author="Taylor Jenkins Reid", year_read=2025, rating=4.5, status="read", summary="A great story about Hollywood."),
    Book(id=2, title="Project Hail Mary", author="Andy Weir", year_read=2025, rating=5.0, status="read", summary="Science fiction at its best."),
    Book(id=3, title="The Midnight Library", author="Matt Haig", year_read=2025, rating=0.0, status="recommended")
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