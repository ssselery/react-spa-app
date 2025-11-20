import { Outlet } from "react-router-dom";
import Navigation from "./Navigation.jsx";

function Layout() {
	return (
		<div className="container">
			<Navigation />
			<div className="main">
				<Outlet />
			</div>
		</div>
	);
}

export default Layout;
