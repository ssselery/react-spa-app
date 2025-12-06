import { useState } from "react";
import SearchDebounced from "./SearchDebounced";
import useApiTechnologiesSearch from "../hooks/useApiTechnologiesSearch";
import useTechnologies from "../hooks/useTechnologies";

function ApiTechnologySearch() {
	const [query, setQuery] = useState("");
	const { items, loading, error } = useApiTechnologiesSearch(query);
	const { addTechnology } = useTechnologies();
	
	const importOne = (item) => {
		addTechnology({
			title: item.title || "Без названия",
			description: item.body || "",
			category: "API data",
			source: `https://jsonplaceholder.typicode.com/posts/${item.id}`,
			status: "not-started",
			notes: "",
		});
	};
	
	const hasQuery = query.trim().length > 0;
	
	return (
		<div className="api-search">
			<h2 className="api-search__title">Поиск по реальному API</h2>
			<p className="api-search__subtitle">
				Данные берутся с https://jsonplaceholder.typicode.com/posts.
				Введите текст для поиска по заголовку и описанию.
			</p>
			
			<div className="search-wrapper">
				<SearchDebounced onSearch={setQuery} />
			</div>
			
			{!hasQuery && !loading && !error && (
				<p className="api-search__hint">Введите запрос, чтобы начать поиск по API.</p>
			)}
			
			{loading && <p>Загрузка данных из API...</p>}
			{error && <p className="api-search__error">{error}</p>}
			
			{hasQuery && !loading && !error && items.length === 0 && (
				<p>Нет результатов по этому запросу.</p>
			)}
			
			<div className="api-search__list">
				{items.map((item) => (
					<div key={item.id} className="api-search__item">
						<div className="api-search__item-header">
							<div>
								<div className="api-search__item-title">{item.title}</div>
								<div className="api-search__item-meta">
									ID: {item.id}, user: {item.userId}
								</div>
							</div>
							<button
								className="api-search__import-btn"
								onClick={() => importOne(item)}
							>
								Импортировать
							</button>
						</div>
						<div className="api-search__item-body">{item.body}</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default ApiTechnologySearch;
