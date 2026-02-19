import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './StatsPage.css';

const GENRE_COLORS = ['#8b7355', '#a68a64', '#705d42', '#c2a683', '#5d4f3b'];
const SIZE_COLORS = ['#6e8c6b', '#4a6d46', 'var(--primary-green)'];
const BAR_COLOR = '#94655c';
const STROKE = "var(--bg-card);";

function StatsPage({stats, choosen_year}){

    if (!stats || stats.total_books === 0) return <div> No data yet. Please start reading!</div>;

    return (
        <div className="stats-container">
            <h1>Our Wrapped {choosen_year} 📗</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Pages Read</h3>
                    <p className="stat-number">{stats.total_pages}</p>
                </div>
                <div className="stat-card">
                    <h3>Average Rating</h3>
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
                    <h3>Book genres</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.genre_distribution}
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={1}
                                dataKey="value"
                                stroke={STROKE}
                            >
                                {stats.genre_distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={GENRE_COLORS[index % GENRE_COLORS.length]} />
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
                            <Bar dataKey="count" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-box">
                    <h3>Author winners</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data = {stats.author_top}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis hide/>
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="total_books" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-box">
                    <h3>Book sizes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.long_total}
                                innerRadius={0}
                                outerRadius={100}
                                paddingAngle={0}
                                dataKey="value"
                                stroke={STROKE}
                            >
                                {stats.long_total.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={SIZE_COLORS[index % SIZE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatsPage