import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './StatsPage.css';
import { useState } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function StatsPage({all_stats}){

    const actual_year = new Date().getFullYear();
    const [stats, setStats] = useState(all_stats ? all_stats[actual_year] : null)

    if (!stats || stats.total_books === 0) return <div> No data yet. Please start reading!</div>;

    return (
        <div className="stats-container">
            <h1>Our Wrapped {actual_year} 📚</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Pages Read</h3>
                    <p className="stat-number">{stats.total_pages}</p>
                </div>
                <div className="stat-card">
                    <h3>Media Rating</h3>
                    <p className="stat-number">{stats.avg_rating} ⭐</p>
                </div>
                <div className="stat-card">
                    <h3>Longest Read</h3>
                    <p className="stat-title">{stats.longest_book?.title}</p>
                    <p className="stat-subtitle">{stats.longest_book?.pages} pages</p>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-box">
                    <h3>Our genres</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.genre_distribution}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {stats.genre_distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-box">
                    <h3>Rating count</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.rating_distribution}>
                            <XAxis dataKey="stars" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatsPage