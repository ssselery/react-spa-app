import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function useApiTechnologiesSearch(query) {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	
	useEffect(() => {
		const q = query.trim().toLowerCase();
		
		if (!q) {
			setItems([]);
			setLoading(false);
			setError("");
			return;
		}
		
		const controller = new AbortController();
		
		const load = async () => {
			try {
				setLoading(true);
				setError("");
				
				const res = await fetch(API_URL, { signal: controller.signal });
				if (!res.ok) {
					throw new Error("Ошибка загрузки API");
				}
				
				const data = await res.json();
				const filtered = (Array.isArray(data) ? data : []).filter((item) => {
					const title = (item.title || "").toLowerCase();
					const body = (item.body || "").toLowerCase();
					return title.includes(q) || body.includes(q);
				});
				
				setItems(filtered);
			} catch (e) {
				if (e.name !== "AbortError") {
					setError(e.message || "Ошибка загрузки данных");
				}
			} finally {
				setLoading(false);
			}
		};
		
		load();
		
		return () => controller.abort();
	}, [query]);
	
	return { items, loading, error };
}

export default useApiTechnologiesSearch;
