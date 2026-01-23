import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BooksPage from './views/BooksPage';
import StatsPage from './views/StatsPage';
import NextBook from './views/NextBook';
import SingleBookPage from './views/SingleBookPage';
import Layout from './components/Layout';

function App() {

    return ( 
        <div className='main-wrapper'>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<BooksPage />} />
                        <Route path="next-book" element={<NextBook />} />
                        <Route path="stats" element={<StatsPage />} />
                    </Route>
                    <Route path="/book/:id" element={<SingleBookPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App
