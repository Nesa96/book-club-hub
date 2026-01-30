import "./SelectYear.css";

const SelectYear = ({ totalYears, selectedYear, setSelectedYear }) => {

  return (
    <div className="year-selector">
        <select 
            value={selectedYear || new Date().getFullYear()} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="minimal-select"
        >
            {totalYears.map(year => (<option key={year} value={year}>{year}</option>))}
        </select>
    </div>
  );
};

export default SelectYear;