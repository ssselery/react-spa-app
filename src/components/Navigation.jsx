import { NavLink } from "react-router-dom";

function Navigation() {
	return (
		<nav className="nav">
			<NavLink to="/" className="nav__logo">
				react-spa-app
			</NavLink>
			
			<div className="nav__links">
				<NavLink to="/" end>Главная</NavLink>
				<NavLink to="/technologies">Технологии</NavLink>
				<NavLink to="/add">Добавить</NavLink>
				<NavLink to="/login">Вход</NavLink>
			</div>
		</nav>
	);
}

export default Navigation;
