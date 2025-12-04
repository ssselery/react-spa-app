import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Button,
	Box,
	Container,
	Stack,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import { useAuth } from "../context/AuthContext";
import { useColorMode } from "../context/ThemeModeContext";

function Layout() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const { mode, toggleColorMode } = useColorMode();
	
	const handleLogout = () => {
		logout();
		navigate("/");
	};
	
	const linkStyle = ({ isActive }) => ({
		color: "inherit",
		textDecoration: "none",
		fontWeight: isActive ? 700 : 500,
		opacity: isActive ? 1 : 0.7,
	});
	
	return (
		<Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
			<AppBar position="static" color="primary" enableColorOnDark>
				<Toolbar>
					<MenuBookIcon sx={{ mr: 1 }} />
					
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, fontWeight: 700 }}
					>
						<NavLink to="/" style={linkStyle}>
							Tech Roadmap
						</NavLink>
					</Typography>
					
					<Stack
						direction="row"
						spacing={1}
						sx={{ mr: 2, display: { xs: "none", sm: "flex" } }}
					>
						<NavLink to="/technologies" style={linkStyle}>
							Технологии
						</NavLink>
						<NavLink to="/add" style={linkStyle}>
							Добавить
						</NavLink>
						<NavLink to="/stats" style={linkStyle}>
							Статистика
						</NavLink>
						<NavLink to="/settings" style={linkStyle}>
							Настройки
						</NavLink>
					</Stack>
					
					<IconButton
						color="inherit"
						onClick={toggleColorMode}
						aria-label="Переключить тему"
						sx={{ mr: 1 }}
					>
						{mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
					</IconButton>
					
					{user ? (
						<Stack direction="row" spacing={1} alignItems="center">
							<Typography variant="body2" sx={{ fontWeight: 500 }}>
								{user.username}
							</Typography>
							<Button color="inherit" size="small" onClick={handleLogout}>
								Выйти
							</Button>
						</Stack>
					) : (
						<Button color="inherit" size="small" onClick={() => navigate("/login")}>
							Войти
						</Button>
					)}
				</Toolbar>
			</AppBar>
			
			<Container
				maxWidth="lg"
				sx={{ flex: 1, py: 3, display: "flex", flexDirection: "column", gap: 2 }}
			>
				<Outlet />
			</Container>
		</Box>
	);
}

export default Layout;
