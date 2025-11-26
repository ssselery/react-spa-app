import "../styles/components/Settings.scss";
import "../styles/components/PageLayout.scss";
import { useAuth } from "../context/AuthContext";

function Settings() {
	const { logout } = useAuth();
	
	const clearTechnologies = () => {
		if (!confirm("Удалить все технологии и заметки для всех пользователей?")) return;
		
		Object.keys(localStorage).forEach((key) => {
			if (key.startsWith("technologies_") || key === "technologies_guest") {
				localStorage.removeItem(key);
			}
		});
		
		location.reload();
	};
	
	const clearUser = () => {
		if (!confirm("Выйти и удалить текущего пользователя?")) return;
		localStorage.removeItem("user");
		logout?.();
		location.reload();
	};
	
	const clearAll = () => {
		if (!confirm("Полностью сбросить приложение (все пользователи и технологии)?")) return;
		
		Object.keys(localStorage).forEach((key) => {
			if (key.startsWith("technologies_") || key === "technologies_guest") {
				localStorage.removeItem(key);
			}
		});
		
		localStorage.removeItem("user");
		location.reload();
	};
	
	return (
		<section className="page settings-page">
			<h1 className="page-title">Настройки</h1>
			
			<div className="settings-card">
				<p className="settings-desc">
					Здесь вы можете управлять данными приложения: очищать список технологий
					и данные пользователя.
				</p>
				
				<div className="settings-group">
					<h2 className="settings-group__title">Данные технологий</h2>
					<button
						className="settings-btn settings-btn--warning"
						onClick={clearTechnologies}
					>
						Очистить все технологии (для всех)
					</button>
				</div>
				
				<div className="settings-group">
					<h2 className="settings-group__title">Пользователь</h2>
					<button
						className="settings-btn settings-btn--primary"
						onClick={clearUser}
					>
						Выйти и удалить пользователя
					</button>
				</div>
				
				<div className="settings-group">
					<h2 className="settings-group__title">Полный сброс</h2>
					<button
						className="settings-btn settings-btn--danger"
						onClick={clearAll}
					>
						Сбросить приложение полностью
					</button>
				</div>
			</div>
		</section>
	);
}

export default Settings;
