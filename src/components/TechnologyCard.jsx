import { Link } from "react-router-dom";

function TechnologyCard({ tech }) {
	const statusText = {
		"not-started": "Не начато",
		"in-progress": "В процессе",
		completed: "Завершено",
	};
	
	const MAX_DESC_LENGTH = 140;
	const fullDesc = tech.description || "";
	const shortDesc =
		fullDesc.length > MAX_DESC_LENGTH
			? fullDesc.slice(0, MAX_DESC_LENGTH).trim() + "…"
			: fullDesc;
	
	return (
		<Link to={`/technologies/${tech.id}`} className="tech-card">
			<h3 className="tech-card__title">{tech.title}</h3>
			
			{shortDesc && (
				<p className="tech-card__desc">{shortDesc}</p>
			)}
			
			<span
				className={`tech-card__status tech-card__status--${tech.status}`}
			>
        {statusText[tech.status] || "—"}
      </span>
			
			<span className="tech-card__more">Подробнее →</span>
		</Link>
	);
}

export default TechnologyCard;
