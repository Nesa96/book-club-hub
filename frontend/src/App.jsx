import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BooksPage from './views/BooksPage';
import StatsPage from './views/StatsPage';
import NextBook from './views/NextBook';
import SingleBookPage from './views/SingleBookPage';
import Layout from './components/Layout';
import { useEffect, useState } from 'react';
import { API_URL } from './config.js';
import BookOfMonth from './views/BookOfMonth.jsx';

function App() {

    const [books, setBooks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const availableYears = books.length > 0 
        ? [...new Set(books.filter(b => b.year_read).map(b => b.year_read))].sort((a, b) => b - a)
        : [new Date().getFullYear()];

    // Get all the info
    async function fetchAllData() {
        try {
            const [booksRes, statsRes] = await Promise.all([
                fetch(`${API_URL}/books`),
                fetch(`${API_URL}/stats`)
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
    }, []);

    if (loading) return <div>Loading web page...</div>;

    return ( 
        <div className='main-wrapper'>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout totalYears={availableYears} 
                                            selectedYear={selectedYear}
                                            setSelectedYear={setSelectedYear} 
                                            onRefresh={fetchAllData}/>}>
                        <Route index />
                        <Route path="all_books" element={<BooksPage 
                                               books={books.filter(b => (b.status === 'read') && (b.year_read == selectedYear))} 
                                               onRefresh={fetchAllData}/>} />
                        <Route path="book_month" element={<BookOfMonth book={books.find(b => (b.status === 'read') && (!b.month_read))}/>} />
                        <Route path="next-book" element={<NextBook 
                                                          recBooks={books.filter(b => b.status === 'recommended')}
                                                          onRefresh={fetchAllData}/>} />
                        <Route path="stats" element={<StatsPage stats = {stats ? stats[selectedYear] : null} choosen_year={selectedYear}/>} />
                    </Route>
                    <Route path="/book/:id" element={<SingleBookPage allBooks={books} onRefresh={fetchAllData}/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App
