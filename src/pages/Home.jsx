import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import useTechnologies from "../hooks/useTechnologies";

function Home() {
	const { user } = useAuth();
	const { techList } = useTechnologies();
	
	const total = techList.length;
	const completed = techList.filter((t) => t.status === "completed").length;
	const inProgress = techList.filter((t) => t.status === "in-progress").length;
	const notStarted = techList.filter((t) => t.status === "not-started").length;
	
	return (
		<section className="page home-page">
			<div className="home-hero">
				<h1 className="page-title">
					{user ? `Привет, ${user.username}!` : "Трекер технологий"}
				</h1>
				<p className="page-subtitle">
					Управляйте своим прогрессом в изучении технологий: добавляйте,
					отслеживайте, отмечайте как изученные.
				</p>
				
				<div className="home-hero__actions">
					<Link to="/technologies" className="home-btn home-btn--primary">
						Перейти к списку
					</Link>
					
					{user ? (
						<Link to="/add" className="home-btn home-btn--secondary">
							Добавить технологию
						</Link>
					) : (
						<Link to="/login" className="home-btn home-btn--secondary">
							Войти
						</Link>
					)}
				</div>
			</div>
			
			<div className="home-stats">
				<div className="home-stats__card">
					<div className="home-stats__label">Всего технологий</div>
					<div className="home-stats__value">{total}</div>
				</div>
				
				<div className="home-stats__card">
					<div className="home-stats__label">Изучено</div>
					<div className="home-stats__value">{completed}</div>
				</div>
				
				<div className="home-stats__card">
					<div className="home-stats__label">В процессе</div>
					<div className="home-stats__value">{inProgress}</div>
				</div>
				
				<div className="home-stats__card">
					<div className="home-stats__label">Не начато</div>
					<div className="home-stats__value">{notStarted}</div>
				</div>
			</div>
		</section>
	);
}

export default Home;
