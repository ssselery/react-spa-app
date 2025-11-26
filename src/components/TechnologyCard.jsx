import { Link } from "react-router-dom";
import "../styles/components/TechnologyCard.scss";

function TechnologyCard({ tech }) {
	const statusText = {
		"not-started": "Не начато",
		"in-progress": "В процессе",
		completed: "Завершено",
	};
	
	return (
		<Link to={`/technologies/${tech.id}`} className="tech-card">
			<h3 className="tech-card__title">{tech.title}</h3>
			
			<p className="tech-card__desc">{tech.description}</p>
			
			<span className={`tech-card__status tech-card__status--${tech.status}`}>
        {statusText[tech.status] || "—"}
      </span>
			
			<span className="tech-card__more">Подробнее →</span>
		</Link>
	);
}

export default TechnologyCard;
