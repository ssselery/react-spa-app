import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function useApiTechnologiesSearch(query) {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	
	useEffect(() => {
		const controller = new AbortController();
		
		const fetchData = async () => {
			try {
				setLoading(true);
				setError("");
				
				const url = query
					? `${API_URL}?q=${encodeURIComponent(query)}`
					: API_URL;
				
				const res = await fetch(url, { signal: controller.signal });
				
				if (!res.ok) {
					throw new Error(`Ошибка API: ${res.status}`);
				}
				
				const data = await res.json();
				
				setItems(Array.isArray(data) ? data : []);
			} catch (e) {
				if (e.name !== "AbortError") {
					setError(e.message || "Ошибка загрузки данных");
				}
			} finally {
				setLoading(false);
			}
		};
		
		fetchData();
		
		return () => controller.abort();
	}, [query]);
	
	return { items, loading, error };
}

export default useApiTechnologiesSearch;
