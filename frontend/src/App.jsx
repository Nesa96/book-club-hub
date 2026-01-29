import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BooksPage from './views/BooksPage';
import StatsPage from './views/StatsPage';
import NextBook from './views/NextBook';
import SingleBookPage from './views/SingleBookPage';
import Layout from './components/Layout';
import { useEffect, useState } from 'react';
import { API_URL } from '../config';

function App() {

    const [books, setBooks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const actual_year = new Date().getFullYear();

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
