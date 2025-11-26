import { NavLink } from "react-router-dom";
import "../styles/components/Navigation.scss";
import { useAuth } from "../context/AuthContext";

function Navigation() {
	const { user, logout } = useAuth();
	
	return (
		<header className="nav">
			<div className="nav__brand">
				<span className="nav__dot"></span>
				<span className="nav__title">react-spa-app</span>
			</div>
			
			<nav className="nav__links">
				
				<NavLink to="/" end className="nav__link">Главная</NavLink>
				<NavLink to="/technologies" className="nav__link">Технологии</NavLink>
				<NavLink to="/add" className="nav__link">Добавить</NavLink>
				<NavLink to="/stats" className="nav__link">Статистика</NavLink>
				<NavLink to="/settings" className="nav__link">Настройки</NavLink>
				
				{!user && (
					<NavLink to="/login" className="nav__link">Вход</NavLink>
				)}
				
				{user && (
					<div className="nav__user-panel">
						<span className="nav__user-name">{user.username}</span>
						
						<button
							className="nav__logout-btn"
							onClick={logout}
							type="button"
						>
							Выйти
						</button>
					</div>
				)}
			</nav>
		</header>
	);
}

export default Navigation;
