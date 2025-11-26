import { useNavigate } from "react-router-dom";
import "../styles/components/Settings.scss";
import { useAuth } from "../context/AuthContext";
import useTechnologies from "../hooks/useTechnologies";

function Settings() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const {
		clearTechnologiesForCurrentUser,
		resetToDefaultsForCurrentUser,
	} = useTechnologies();
	
	const handleClearTechnologiesCurrent = () => {
		if (!window.confirm("Удалить все технологии текущего пользователя?")) return;
		clearTechnologiesForCurrentUser();
	};
	
	const handleResetDefaults = () => {
		if (!window.confirm("Вернуть список технологий к значениям по умолчанию?")) return;
		resetToDefaultsForCurrentUser();
	};
	
	const handleClearUser = () => {
		if (!window.confirm("Выйти и удалить данные текущего пользователя?")) return;
		
		if (user && user.username) {
			window.localStorage.removeItem("user");
		}
		
		logout();
		navigate("/");
	};
	
	const handleClearAll = () => {
		if (
			!window.confirm(
				"Полностью сбросить приложение и очистить технологии для всех пользователей в этом браузере?"
			)
		) {
			return;
		}
		
		Object.keys(window.localStorage).forEach((key) => {
			if (key.startsWith("technologies_")) {
				window.localStorage.setItem(key, JSON.stringify([]));
			}
			if (key === "user") {
				window.localStorage.removeItem(key);
			}
		});
		
		logout();
		navigate("/");
	};
	
	return (
		<section className="page settings-page">
			<h1 className="page-title">Настройки</h1>
			<p className="page-subtitle">
				Управляйте данными технологий и учетной записи. Все изменения применяются
				только в этом браузере.
			</p>
			
			<div className="settings-card">
				<div className="settings-group">
					<h2>Текущий пользователь</h2>
					<button
						className="settings-btn settings-btn--warning"
						onClick={handleClearTechnologiesCurrent}
					>
						Очистить технологии текущего пользователя
					</button>
					<button
						className="settings-btn"
						onClick={handleResetDefaults}
					>
						Сбросить список технологий к значениям по умолчанию
					</button>
				</div>
				
				<div className="settings-group">
					<h2>Аккаунт</h2>
					<button
						className="settings-btn"
						onClick={handleClearUser}
					>
						Выйти и удалить пользователя
					</button>
				</div>
				
				<div className="settings-group">
					<h2>Полный сброс</h2>
					<button
						className="settings-btn settings-btn--danger"
						onClick={handleClearAll}
					>
						Очистить технологии для всех и сбросить приложение
					</button>
				</div>
			</div>
		</section>
	);
}

export default Settings;
