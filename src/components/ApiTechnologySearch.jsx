import { useState } from "react";
import SearchDebounced from "./SearchDebounced";
import useApiTechnologiesSearch from "../hooks/useApiTechnologiesSearch";
import useTechnologies from "../hooks/useTechnologies";

import "../styles/components/ApiTechnologySearch.scss";

function ApiTechnologySearch() {
	const [query, setQuery] = useState("");
	const { items, loading, error } = useApiTechnologiesSearch(query);
	const { addTechnology } = useTechnologies();
	
	const handleImportOne = (item) => {
		addTechnology({
			title: item.title || "Без названия",
			description: item.body || "",
			category: `API user ${item.userId || "?"}`,
			source: `https://jsonplaceholder.typicode.com/posts/${item.id}`,
			status: "not-started",
			notes: "",
		});
	};
	
	return (
		<div className="api-search">
			<h2 className="api-search__title">Библиотека технологий из API</h2>
			<p className="api-search__subtitle">
				Поиск по реальному API: данные берутся с jsonplaceholder.typicode.com.
			</p>
			
			<div className="search-wrapper">
				<SearchDebounced onSearch={setQuery} />
			</div>
			
			{loading && <p>Загрузка данных из API...</p>}
			{error && <p className="api-search__error">{error}</p>}
			
			<div className="api-search__list">
				{!loading && !error && items.length === 0 && (
					<p>Нет результатов по API</p>
				)}
				
				{items.map((item) => (
					<div key={item.id} className="api-search__item">
						<div className="api-search__item-header">
							<div>
								<div className="api-search__item-title">{item.title}</div>
								<div className="api-search__item-meta">
									Категория: API user {item.userId}
								</div>
							</div>
							<button
								className="api-search__import-btn"
								onClick={() => handleImportOne(item)}
							>
								Импортировать
							</button>
						</div>
						
						<div className="api-search__item-body">
							{item.body}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default ApiTechnologySearch;
