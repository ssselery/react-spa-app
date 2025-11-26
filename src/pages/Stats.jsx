import "../styles/components/Stats.scss";
import "../styles/components/PageLayout.scss";
import useTechnologies from "../hooks/useTechnologies";

function Stats() {
	const { techList } = useTechnologies();
	
	const total = techList.length;
	const completed = techList.filter((t) => t.status === "completed").length;
	const inProgress = techList.filter((t) => t.status === "in-progress").length;
	const notStarted = techList.filter((t) => t.status === "not-started").length;
	
	const completionPercent =
		total === 0 ? 0 : Math.round((completed / total) * 100);
	
	const maxCount = Math.max(completed, inProgress, notStarted, 1);
	
	return (
		<section className="page stats-page">
			<h1 className="page-title">Статистика</h1>
			
			<div className="stats-card">
				<div className="stats-card__header">
					<div>
						<div className="stats-card__label">Всего технологий</div>
						<div className="stats-card__value">{total}</div>
					</div>
					
					<div>
						<div className="stats-card__label">Изучено</div>
						<div className="stats-card__value stats-card__value--accent">
							{completed} ({completionPercent}%)
						</div>
					</div>
				</div>
				
				<div className="stats-progress">
					<div className="stats-progress__label">Прогресс изучения</div>
					<div className="stats-progress__bar">
						<div
							className="stats-progress__fill"
							style={{ width: `${completionPercent}%` }}
						/>
					</div>
				</div>
				
				<div className="stats-graph">
					<div className="stats-graph__item">
						<span className="stats-graph__title">Не начато</span>
						<div className="stats-graph__bar">
							<div
								className="stats-graph__bar-fill stats-graph__bar-fill--not"
								style={{ width: `${(notStarted / maxCount) * 100}%` }}
							/>
						</div>
						<span className="stats-graph__count">{notStarted}</span>
					</div>
					
					<div className="stats-graph__item">
						<span className="stats-graph__title">В процессе</span>
						<div className="stats-graph__bar">
							<div
								className="stats-graph__bar-fill stats-graph__bar-fill--progress"
								style={{ width: `${(inProgress / maxCount) * 100}%` }}
							/>
						</div>
						<span className="stats-graph__count">{inProgress}</span>
					</div>
					
					<div className="stats-graph__item">
						<span className="stats-graph__title">Завершено</span>
						<div className="stats-graph__bar">
							<div
								className="stats-graph__bar-fill stats-graph__bar-fill--done"
								style={{ width: `${(completed / maxCount) * 100}%` }}
							/>
						</div>
						<span className="stats-graph__count">{completed}</span>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Stats;
