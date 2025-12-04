import { useState } from "react";
import SearchDebounced from "./SearchDebounced";
import "../styles/components/RemoteApiSearch.scss";

const DEFAULT_API_URL =
	"https://raw.githubusercontent.com/ssselery/react-spa-app/refs/heads/main/ApiTest/roadmap-frontend.json";

function normalizeApiData(raw, apiUrl) {
	if (!raw) return [];
	
	let list = [];
	
	if (Array.isArray(raw)) {
		list = raw;
	} else if (Array.isArray(raw.technologies)) {
		list = raw.technologies;
	} else {
		return [];
	}
	
	return list.map((item, index) => ({
		id: item.id ?? index,
		title: item.title || "Без названия",
		description: item.description || item.body || "",
		category: item.category || "",
		source:
			item.source ||
			(Array.isArray(item.resources) ? item.resources[0] || apiUrl : apiUrl),
	}));
}

function RemoteApiSearch({ onImportTechnology }) {
	const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
	const [loadedItems, setLoadedItems] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");
	
	const handleLoadApi = async () => {
		if (!apiUrl.trim()) return;
		
		try {
			setLoading(true);
			setError("");
			setInfo("");
			
			const res = await fetch(apiUrl.trim());
			if (!res.ok) {
				throw new Error(`Ошибка загрузки API (HTTP ${res.status})`);
			}
			
			const data = await res.json();
			const normalized = normalizeApiData(data, apiUrl.trim());
			
			if (!normalized.length) {
				throw new Error("Данные API не содержат технологий в ожидаемом формате");
			}
			
			setLoadedItems(normalized);
			setInfo(`Подключено технологий: ${normalized.length}`);
		} catch (e) {
			setError(e.message || "Ошибка загрузки API");
			setLoadedItems([]);
		} finally {
			setLoading(false);
		}
	};
	
	const handleImportOne = (item) => {
		if (typeof onImportTechnology === "function") {
			onImportTechnology({
				title: item.title,
				description: item.description,
				category: item.category,
				source: item.source,
				status: "not-started",
				notes: "",
			});
			setInfo(`Технология "${item.title}" импортирована в ваш список`);
		}
	};
	
	const filtered = loadedItems.filter((t) => {
		const q = searchQuery.toLowerCase();
		if (!q) return true;
		const title = (t.title || "").toLowerCase();
		const desc = (t.description || "").toLowerCase();
		const cat = (t.category || "").toLowerCase();
		return title.includes(q) || desc.includes(q) || cat.includes(q);
	});
	
	const hasApi = loadedItems.length > 0;
	
	return (
		<div className="remote-api">
			<h2 className="remote-api__title">Поиск по подключаемому API</h2>
			<p className="remote-api__subtitle">
				По умолчанию используется дорожная карта с GitHub. Можно ввести любой
				другой URL, вернуть JSON и искать по нему.
			</p>
			
			<div className="remote-api__row">
				<input
					type="text"
					className="remote-api__input"
					placeholder="https://... (URL API с JSON)"
					value={apiUrl}
					onChange={(e) => setApiUrl(e.target.value)}
				/>
				<button
					className="remote-api__load-btn"
					onClick={handleLoadApi}
					disabled={loading}
				>
					{loading ? "Загрузка..." : "Загрузить API"}
				</button>
			</div>
			
			{error && (
				<div className="remote-api__message remote-api__message--error">
					{error}
				</div>
			)}
			{info && !error && (
				<div className="remote-api__message remote-api__message--ok">
					{info}
				</div>
			)}
			
			{hasApi && (
				<div className="remote-api__search-block">
					<p className="remote-api__hint">
						API подключено. Теперь введите запрос для поиска по загруженным
						технологиям.
					</p>
					
					<div className="search-wrapper">
						<SearchDebounced onSearch={setSearchQuery} />
					</div>
					
					<div className="remote-api__list">
						{filtered.length === 0 && (
							<p className="remote-api__empty">
								По этому запросу ничего не найдено.
							</p>
						)}
						
						{filtered.map((item, index) => (
							<div
								key={`${item.id ?? "noid"}-${index}`}
								className="remote-api__item"
							>
								<div className="remote-api__item-header">
									<div>
										<div className="remote-api__item-title">{item.title}</div>
										{item.category && (
											<div className="remote-api__item-meta">
												Категория: {item.category}
											</div>
										)}
										{item.source && (
											<div className="remote-api__item-meta">
												Источник: {item.source}
											</div>
										)}
									</div>
									<button
										className="remote-api__import-btn"
										onClick={() => handleImportOne(item)}
									>
										Импортировать
									</button>
								</div>
								{item.description && (
									<div className="remote-api__item-desc">
										{item.description}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}
			
			{!hasApi && !loading && !error && (
				<p className="remote-api__hint">
					Сначала подключите API, затем станет доступен поиск по его данным.
				</p>
			)}
		</div>
	);
}

export default RemoteApiSearch;
