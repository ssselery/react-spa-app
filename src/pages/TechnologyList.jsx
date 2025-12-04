import { useState } from "react";
import SearchDebounced from "../components/SearchDebounced";
import useTechnologies from "../hooks/useTechnologies";
import TechnologyCard from "../components/TechnologyCard";
import ApiTechnologySearch from "../components/ApiTechnologySearch";

import "../styles/components/PageLayout.scss";
import "../styles/components/TechnologyList.scss";

function TechnologyList() {
	const { techList } = useTechnologies();
	const [query, setQuery] = useState("");
	
	const filtered = techList.filter((t) => {
		const title = (t.title || "").toLowerCase();
		const desc = (t.description || "").toLowerCase();
		const cat = (t.category || "").toLowerCase();
		const q = query.toLowerCase();
		return title.includes(q) || desc.includes(q) || cat.includes(q);
	});
	
	return (
		<section className="page tech-list-page">
			<h1 className="page-title">Технологии</h1>
			<p className="page-subtitle">
				Ваши сохранённые технологии и библиотека из внешнего API.
			</p>
			
			<div className="search-wrapper">
				<SearchDebounced onSearch={setQuery} />
			</div>
			
			<div className="tech-list">
				{filtered.length === 0 ? (
					<p>Ничего не найдено</p>
				) : (
					filtered.map((tech) => (
						<TechnologyCard key={tech.id} tech={tech} />
					))
				)}
			</div>
			
			<ApiTechnologySearch />
		</section>
	);
}

export default TechnologyList;
