import { useState } from "react";
import useTechnologies from "../hooks/useTechnologies";
import TechnologyCard from "../components/TechnologyCard";
import SearchDebounced from "../components/SearchDebounced";
import RemoteApiSearch from "../components/RemoteApiSearch";
import "../styles/components/TechnologyList.scss";

function TechnologyList() {
	const { techList, addTechnology } = useTechnologies();
	const [query, setQuery] = useState("");
	
	const lowerQuery = query.toLowerCase();
	
	const filtered = techList.filter((t) => {
		const title = (t.title || "").toLowerCase();
		const desc = (t.description || "").toLowerCase();
		const category = (t.category || "").toLowerCase();
		
		return (
			title.includes(lowerQuery) ||
			desc.includes(lowerQuery) ||
			category.includes(lowerQuery)
		);
	});
	
	return (
		<section className="tech-list-page">
			<h1 className="page-title">Технологии</h1>
			
			<SearchDebounced onSearch={setQuery} />
			
			<div className="tech-list">
				{filtered.length === 0 ? (
					<p>Ничего не найдено</p>
				) : (
					filtered.map((tech, index) => (
						<TechnologyCard
							key={`${tech.id ?? "noid"}-${index}`}
							tech={tech}
						/>
					))
				)}
			</div>
			
			<RemoteApiSearch onImportTechnology={addTechnology} />
		</section>
	);
}

export default TechnologyList;