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
    year: Optional[int]
    cover_url: str
    status: str # "read" o "recommended"
    genre: Optional[str] = "Other"
    pages: Optional[int] = 0
    summary: Optional[str] = None
    reviews: list[Review] = []

# Temporal DB
books_db = [
    Book(id=1, title="Aún no estoy muerta", author="Holly Jackson", year=2024, year_read=2025, status="read", 
         summary="Dentro de siete días, Jet Mason estará muerta. \n " \
                 "Jet tiene veintisiete años y sigue atrapada en Woodstock, el pueblo de Vermont en el que nació, a la espera de que su vida comience. " \
                 "\n «Ya lo haré luego», dice siempre. Tiene tiempo. Hasta que, durante la noche de Halloween, Jet sufre un violento ataque por parte de un intruso al que no llega a ver. " \
                 "\n Sufre una lesión cerebral catastrófica. El médico está seguro de que, al cabo de una semana, sufrirá un aneurisma mortal. " \
                 "\n Jet nunca había considerado una persona que tuviera enemigos. Pero ahora mira a todo el mundo desde una perspectiva nueva: a su familia, a su ex mejor amiga convertida en cuñada, al que una vez fue su novio. " \
                 "\n Solo tiene siete días y, mientras su estado no deja de empeorar, Billy, su amigo de la infancia, es la única ayuda con la que puede contar. Aun así, está totalmente dispuesta a terminar algo por una vez en su vida: " \
                 "\n Jet va a resolver su propio asesinato.",
         cover_url = "https://m.media-amazon.com/images/I/71KJfkFKxbL.jpg", genre='Thriller', pages=256, reviews= [
             {
                 "user": "Vane",
                 "rating": 4.5,
                 "comment": "Like it"
             },
             {
                 "user": "Ani",
                 "rating": 4.5,
                 "comment": "Like it"
             },
             {
                 "user": "Sarah",
                 "rating": 4,
                 "comment": "Like it"
             }
         ]),
    Book(id=2, title="Aún no estoy muerta", author="Holly Jackson", year=2024, year_read=2025, status="read", summary="The history of a death girl solving her murder",
         cover_url = "https://m.media-amazon.com/images/I/71KJfkFKxbL.jpg", genre='Thriller', pages=256, reviews= [
             {
                 "user": "Vane",
                 "rating": 4.5,
                 "comment": "Like it"
             },
             {
                 "user": "Ani",
                 "rating": 4.5,
                 "comment": "Like it"
             },
             {
                 "user": "Sarah",
                 "rating": 4,
                 "comment": "Like it"
             }
         ])
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