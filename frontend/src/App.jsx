import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BooksPage from './views/BooksPage';
import StatsPage from './views/StatsPage';
import NextBook from './views/NextBook';
import SingleBookPage from './views/SingleBookPage';
import Layout from './components/Layout';
import { useEffect, useState } from 'react';

function App() {

    const [books, setBooks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const actual_year = new Date().getFullYear();

    // Get all the info
    async function fetchAllData() {
        try {
            const [booksRes, statsRes] = await Promise.all([
                fetch('http://localhost:8000/books'),
                fetch('http://localhost:8000/stats')
            ]);

            const booksData = await booksRes.json();
            const statsData = await statsRes.json();

            setBooks(booksData);
            setStats(statsData);
        } catch (error) {
            console.error("Error getting the data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Get the data when opening the web
    useEffect(() => {
        fetchAllData();
        // TEMPORAL DATA TO TESTS
        setBooks([
                { id: 1, title: "Aún no estoy muerta", author: "Holly Jackson", cover_url: "https://m.media-amazon.com/images/I/71KJfkFKxbL.jpg", year_read: 2026, year: 2025, status: "read", genre: "Thriller", pages: 560, summary: "", reviews: [{"user": "Sarah", "rating": 4, "comment": "Like it"}, {"user": "Ani", "rating": 4.5, "comment": "I like it"}, {"user": "Vane", "rating": 4.5, "comment": "I like it"}], media_rating: 4.33},
                { id: 2, title: "Todo lo que sé sobre el amor", author: "Dolly Alderton", cover_url: "https://books.google.com/books/content?id=yXuhDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api", year_read: 2026, year: 2019, status: "read", genre: "Biografia", pages: 354, summary: "", reviews: [], media_rating: null},
                { id: 3, title: "La paciente silenciosa", author: "Alex Michaelides", cover_url: "https://books.google.com/books/content?id=LUgz0QEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api", year_read: 2026, year: 2019, status: "recommended", genre: "Thriller", pages: 384, summary: "", reviews: [], media_rating: null}
                ])
    }, []);

    if (loading) return <div>Loading web page...</div>;

    return ( 
        <div className='main-wrapper'>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout onRefresh={fetchAllData}/>}>
                        <Route index element={<BooksPage 
                                               books={books.filter(b => (b.status === 'read') && (b.year_read == actual_year))} 
                                               onRefresh={fetchAllData}/>} />
                        <Route path="next-book" element={<NextBook 
                                                          recBooks={books.filter(b => b.status === 'recommended')}
                                                          onRefresh={fetchAllData}/>} />
                        <Route path="stats" element={<StatsPage stats={stats} onRefresh={fetchAllData}/>} />
                    </Route>
                    <Route path="/book/:id" element={<SingleBookPage allBooks={books} onRefresh={fetchAllData}/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App
