import { useState, useEffect } from "react";

import "../styles/components/SearchDebounced.scss";

function SearchDebounced({ onSearch, delay = 400 }) {
	const [value, setValue] = useState("");
	
	useEffect(() => {
		const handler = setTimeout(() => {
			onSearch(value.trim().toLowerCase());
		}, delay);
		
		return () => clearTimeout(handler);
	}, [value, delay, onSearch]);
	
	return (
		<input
			className="search-input"
			type="text"
			placeholder="Поиск технологий..."
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	);
}

export default SearchDebounced;
