import { useState } from "react";
import SearchDebounced from "../components/SearchDebounced";
import useTechnologies from "../hooks/useTechnologies";
import TechnologyCard from "../components/TechnologyCard";

import "../styles/components/PageLayout.scss";
import "../styles/components/TechnologyList.scss";

function TechnologyList() {
	const { techList } = useTechnologies();
	const [query, setQuery] = useState("");
	
	const filtered = techList.filter((t) =>
		t.title.toLowerCase().includes(query) ||
		t.description.toLowerCase().includes(query) ||
		t.category.toLowerCase().includes(query)
	);
	
	return (
		<section className="page tech-list-page">
			<h1 className="page-title">Технологии</h1>
			<p className="page-subtitle">
				Здесь собраны все технологии, которые вы добавили в свой трекер.
				Используйте поиск, чтобы быстро найти нужную.
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
		</section>
	);
}

export default TechnologyList;
