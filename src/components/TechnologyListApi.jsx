function TechnologyListApi({ technologies }) {
	if (!technologies || technologies.length === 0) {
		return <p>Технологии пока не загружены.</p>;
	}
	
	return (
		<div className="api-tech-list">
			{technologies.map((tech) => (
				<article key={tech.id} className="api-tech-card">
					<h3>{tech.title}</h3>
					{tech.category && (
						<p>
							<strong>Категория:</strong> {tech.category}
						</p>
					)}
					{tech.description && <p>{tech.description}</p>}
					{tech.difficulty && (
						<p>
							<strong>Уровень:</strong> {tech.difficulty}
						</p>
					)}
					{tech.resources && tech.resources.length > 0 && (
						<p>
							<strong>Ресурсы:</strong>{" "}
							{tech.resources.map((url, i) => (
								<a
									key={url}
									href={url}
									target="_blank"
									rel="noreferrer"
									style={{ marginRight: "8px" }}
								>
									{`#${i + 1}`}
								</a>
							))}
						</p>
					)}
				</article>
			))}
		</div>
	);
}

export default TechnologyListApi;
