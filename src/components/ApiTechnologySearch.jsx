import { useState } from "react";
import SearchDebounced from "./SearchDebounced";
import useApiTechnologiesSearch from "../hooks/useApiTechnologiesSearch";
import useTechnologies from "../hooks/useTechnologies";

import "../styles/components/ApiTechnologySearch.scss";

function ApiTechnologySearch() {
	const [query, setQuery] = useState("");
	const { items, loading, error } = useApiTechnologiesSearch(query);
	const { addTechnology } = useTechnologies();
	
	const importOne = (item) => {
		addTechnology({
			title: item.title,
			description: item.body,
			category: "API data",
			source: `https://jsonplaceholder.typicode.com/posts/${item.id}`,
			status: "not-started",
			notes: "",
		});
	};
	
	return (
		<div className="api-search">
			<h2>Поиск по реальному API</h2>
			<p>Данные загружаются с https://jsonplaceholder.typicode.com/posts</p>
			
			<div className="search-wrapper">
				<SearchDebounced onSearch={setQuery} />
			</div>
			
			{loading && <p>Загрузка данных...</p>}
			{error && <p className="api-error">{error}</p>}
			
			{!loading && items.length === 0 && <p>Нет результатов</p>}
			
			<div className="api-list">
				{items.map((item) => (
					<div key={item.id} className="api-item">
						<h3>{item.title}</h3>
						<p>{item.body}</p>
						<button onClick={() => importOne(item)}>Импортировать</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default ApiTechnologySearch;
