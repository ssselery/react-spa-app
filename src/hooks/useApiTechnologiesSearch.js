import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function useApiTechnologiesSearch(query) {
	const [items, setItems] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	
	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				setError("");
				
				const res = await fetch(API_URL);
				if (!res.ok) throw new Error("Ошибка загрузки API");
				
				const json = await res.json();
				
				setItems(json);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		
		load();
	}, []);
	
	useEffect(() => {
		const q = query.toLowerCase();
		const result = items.filter((item) =>
			item.title.toLowerCase().includes(q) ||
			item.body.toLowerCase().includes(q)
		);
		setFiltered(result);
	}, [query, items]);
	
	return { items: filtered, loading, error };
}

export default useApiTechnologiesSearch;
