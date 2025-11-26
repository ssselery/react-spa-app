import { useParams, useNavigate } from "react-router-dom";
import useTechnologies from "../hooks/useTechnologies";

import "../styles/components/TechnologyDetail.scss";

function TechnologyDetail() {
	const { id } = useParams();
	const { getTechnologyById, updateStatus, updateNotes } = useTechnologies();
	const navigate = useNavigate();
	
	const tech = getTechnologyById(id);
	
	if (!tech) {
		return (
			<div className="tech-detail__wrapper">
				<div className="tech-detail tech-detail--notfound">
					<h1>Технология не найдена</h1>
				</div>
			</div>
		);
	}
	
	return (
		<div className="tech-detail__wrapper">
			<div className="tech-detail">
				<button className="tech-detail__back" onClick={() => navigate(-1)}>
					← Назад
				</button>
				
				<div className="tech-detail__header">
					<h1 className="tech-detail__title">{tech.title}</h1>
					<span className="tech-detail__badge">ID: {tech.id}</span>
				</div>
				
				<p className="tech-detail__desc">{tech.description}</p>
				
				<div className="tech-detail__status-block">
					<button
						className={`status-btn ${
							tech.status === "not-started" ? "active" : ""
						}`}
						onClick={() => updateStatus(id, "not-started")}
					>
						Не начато
					</button>
					
					<button
						className={`status-btn ${
							tech.status === "in-progress" ? "active" : ""
						}`}
						onClick={() => updateStatus(id, "in-progress")}
					>
						В процессе
					</button>
					
					<button
						className={`status-btn ${
							tech.status === "completed" ? "active" : ""
						}`}
						onClick={() => updateStatus(id, "completed")}
					>
						Завершено
					</button>
				</div>
				
				<div className="tech-detail__info">
					<div className="tech-detail__row">
						<span className="label">Категория:</span>
						<span>{tech.category || "—"}</span>
					</div>
					
					<div className="tech-detail__row">
						<span className="label">Источник:</span>
						{tech.source ? (
							<a href={tech.source} target="_blank" rel="noreferrer">
								{tech.source}
							</a>
						) : (
							"—"
						)}
					</div>
					
					<div className="tech-detail__row">
						<span className="label">Дата:</span>
						<span>{tech.createdAt}</span>
					</div>
					
					<div className="tech-detail__notes-block">
						<h3>Заметки</h3>
						<textarea
							placeholder="Добавьте заметку…"
							value={tech.notes || ""}
							onChange={(e) => updateNotes(id, e.target.value)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TechnologyDetail;
