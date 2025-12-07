import { Outlet, Link, useLocation } from "react-router-dom";
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	IconButton,
	Button,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Divider,
	Avatar,
	Stack,
	Menu,
	MenuItem,
	Badge,
	Modal,
	Paper,
	alpha,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import AddIcon from "@mui/icons-material/Add";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import CloseIcon from "@mui/icons-material/Close";
import ToastContainer from "./ToastContainer";

import { useState } from "react";
import { useColorMode } from "../context/ThemeModeContext";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const navItems = [
	{ label: "Главная", to: "/", icon: <HomeIcon fontSize="small" /> },
	{ label: "Технологии", to: "/technologies", icon: <ListIcon fontSize="small" /> },
	{ label: "Добавить", to: "/add", icon: <AddIcon fontSize="small" /> },
	{ label: "Статистика", to: "/account", icon: <InsightsIcon fontSize="small" /> },
	{ label: "Настройки", to: "/settings", icon: <SettingsIcon fontSize="small" /> },
];

export default function Layout() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [notifOpen, setNotifOpen] = useState(false);
	
	const { mode, toggleColorMode } = useColorMode();
	const { pathname } = useLocation();
	const { user, logout } = useAuth();
	const { notifications, markAllAsRead, toasts, clearAllNotifications } = useNotifications();
	
	const unreadCount = notifications.filter((n) => !n.read).length;
	
	const handleLogout = () => {
		setAnchorEl(null);
		logout();
	};
	
	const drawer = (
		<Box sx={{ width: 280, height: "100%", display: "flex", flexDirection: "column" }}>
			<Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
				<Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
					TechTracker
				</Typography>
				<Typography variant="caption" color="text.secondary">
					Управление технологиями
				</Typography>
			</Box>
			
			<List sx={{ flex: 1, p: 2 }}>
				{navItems.map(({ label, to, icon }) => (
					<ListItem key={to} disablePadding sx={{ mb: 0.5 }}>
						<ListItemButton
							component={Link}
							to={to}
							selected={pathname === to}
							sx={{
								borderRadius: 2,
								"&.Mui-selected": {
									bgcolor: "primary.main",
									color: "white",
									"&:hover": {
										bgcolor: "primary.dark",
									},
								},
							}}
						>
							{icon}
							<ListItemText primary={label} sx={{ ml: 2 }} />
						</ListItemButton>
					</ListItem>
				))}
				
				<Divider sx={{ my: 2 }} />
				
				<ListItem disablePadding sx={{ mb: 0.5 }}>
					<ListItemButton onClick={() => setNotifOpen(true)} sx={{ borderRadius: 2 }}>
						<Badge badgeContent={unreadCount} color="error">
							<NotificationsIcon />
						</Badge>
						<ListItemText primary="Уведомления" sx={{ ml: 2 }} />
					</ListItemButton>
				</ListItem>
				
				<ListItem disablePadding sx={{ mb: 0.5 }}>
					<ListItemButton onClick={toggleColorMode} sx={{ borderRadius: 2 }}>
						{mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
						<ListItemText primary={mode === "light" ? "Тёмная тема" : "Светлая тема"} sx={{ ml: 2 }} />
					</ListItemButton>
				</ListItem>
			</List>
			
			<Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
				{!user ? (
					<Button
						component={Link}
						to="/login"
						variant="contained"
						fullWidth
						startIcon={<AccountCircleIcon />}
						sx={{ borderRadius: 2 }}
					>
						Войти
					</Button>
				) : (
					<Box>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, p: 1 }}>
							<Avatar sx={{ bgcolor: "primary.main" }}>
								{user.username[0].toUpperCase()}
							</Avatar>
							<Box>
								<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
									{user.username}
								</Typography>
								<Typography variant="caption" color="text.secondary">
									Пользователь
								</Typography>
							</Box>
						</Box>
						
						<Stack spacing={1}>
							<Button
								component={Link}
								to="/bio"
								variant="outlined"
								fullWidth
								sx={{ borderRadius: 2 }}
								onClick={() => setMobileOpen(false)}
							>
								Аккаунт
							</Button>
							<Button
								variant="outlined"
								color="error"
								fullWidth
								onClick={handleLogout}
								sx={{ borderRadius: 2 }}
							>
								Выйти
							</Button>
						</Stack>
					</Box>
				)}
			</Box>
		</Box>
	);
	
	return (
		<Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
			<AppBar
				position="fixed"
				elevation={0}
				sx={{
					bgcolor: alpha(mode === "light" ? "#ffffff" : "#1e293b", 0.95),
					backdropFilter: "blur(10px)",
					borderBottom: 1,
					borderColor: "divider",
					zIndex: (theme) => theme.zIndex.drawer + 1,
				}}
			>
				<Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 3 }, gap: 2 }}>
					{/* Левая часть: меню и логотип */}
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<IconButton
							onClick={() => setMobileOpen(true)}
							sx={{ display: { md: "none" } }}
						>
							<MenuIcon />
						</IconButton>
						
						<Typography
							component={Link}
							to="/"
							variant="h6"
							sx={{
								fontWeight: 700,
								color: "text.primary",
								textDecoration: "none",
								display: { xs: "none", sm: "block" },
								mr: { md: 4 },
							}}
						>
							TechTracker
						</Typography>
						
						{/* Навигационные ссылки - сдвинуты ближе к логотипу */}
						<Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
							{navItems.map(({ label, to }) => (
								<Button
									key={to}
									component={Link}
									to={to}
									variant={pathname === to ? "contained" : "text"}
									size="small"
									sx={{
										borderRadius: 2,
										px: 2,
										minWidth: "auto",
									}}
									
									aria-current={pathname === to ? "page" : undefined}
									aria-label={`Перейти на страницу ${label}`}
								>
									{label}
								</Button>
							))}
						</Box>
					</Box>
					
					{/* Правая часть: иконки и пользователь */}
					<Stack direction="row" spacing={1} alignItems="center">
						<IconButton onClick={() => setNotifOpen(true)}
							aria-label={`Уведомления. Непрочитанных: ${unreadCount}`}
						>
							<Badge badgeContent={unreadCount} color="error">
								<NotificationsIcon />
							</Badge>
						</IconButton>
						
						<IconButton onClick={toggleColorMode}>
							{mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
						</IconButton>
						
						{!user ? (
							<Button
								component={Link}
								to="/login"
								variant="contained"
								size="small"
								sx={{ borderRadius: 2, ml: 1 }}
							>
								Войти
							</Button>
						) : (
							<>
								<Avatar
									onClick={(e) => setAnchorEl(e.currentTarget)}
									sx={{
										bgcolor: "primary.main",
										cursor: "pointer",
										width: 36,
										height: 36,
										ml: 1,
									}}
								>
									{user.username[0].toUpperCase()}
								</Avatar>
								
								<Menu
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={() => setAnchorEl(null)}
									PaperProps={{
										sx: {
											mt: 1.5,
											minWidth: 200,
											borderRadius: 2,
										},
									}}
								>
									<MenuItem
										component={Link}
										to="/bio"
										onClick={() => setAnchorEl(null)}
									>
										Аккаунт
									</MenuItem>
									<MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
										Выйти
									</MenuItem>
								</Menu>
							</>
						)}
					</Stack>
				</Toolbar>
			</AppBar>
			
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={() => setMobileOpen(false)}
				ModalProps={{ keepMounted: true }}
				sx={{
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: 280,
					},
				}}
			>
				{drawer}
			</Drawer>
			
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: { xs: 2, md: 3 },
					mt: { xs: 7, md: 8 },
					width: "100%",
					maxWidth: 1400,
					mx: "auto",
				}}
			>
				<Outlet />
			</Box>
			
			{/* Notifications Modal */}
			<Modal
				open={notifOpen}
				onClose={() => {
					markAllAsRead();
					setNotifOpen(false);
				}}
				sx={{
					display: "flex",
					alignItems: "flex-start",
					justifyContent: "flex-end",
					p: 2,
				}}
			>
				<Paper
					sx={{
						width: { xs: "90%", sm: 400 },
						maxHeight: "80vh",
						overflow: "auto",
						borderRadius: 3,
						mt: 8,
						// ✅ Убираем полосу прокрутки
						"&::-webkit-scrollbar": {
							width: 0,
							height: 0,
							background: "transparent",
						},
						"&::-webkit-scrollbar-thumb": {
							background: "transparent",
						},
						"&::-webkit-scrollbar-track": {
							background: "transparent",
						},
						scrollbarWidth: "none",
						msOverflowStyle: "none",
					}}
				>
					<Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Typography variant="h6" sx={{ fontWeight: 700 }}>
								Уведомления
							</Typography>
							<Box sx={{ display: "flex", gap: 1 }}>
								{/* ✅ Кнопка очистки всех уведомлений */}
								{notifications.length > 0 && (
									<Button
										size="small"
										variant="outlined"
										color="error"
										onClick={() => {
											if (window.confirm("Очистить всю историю уведомлений?")) {
												clearAllNotifications();
											}
										}}
										sx={{ borderRadius: 2 }}
									>
										Очистить все
									</Button>
								)}
								<IconButton
									size="small"
									onClick={() => {
										markAllAsRead();
										setNotifOpen(false);
									}}
								>
									<CloseIcon />
								</IconButton>
							</Box>
						</Box>
					</Box>
					
					<Box sx={{ p: 2 }}>
						{notifications.length === 0 ? (
							<Box sx={{ textAlign: "center", py: 4 }}>
								<Typography color="text.secondary">
									Уведомлений нет
								</Typography>
							</Box>
						) : (
							<Stack spacing={2}>
								{notifications.map((n) => (
									<Paper
										key={n.id}
										variant="outlined"
										sx={{
											p: 2,
											borderRadius: 2,
											borderLeft: 3,
											borderLeftColor:
												n.type === "success"
													? "success.main"
													: n.type === "error"
														? "error.main"
														: n.type === "warning"
															? "warning.main"
															: "info.main",
											bgcolor: n.read ? "transparent" : "action.hover",
										}}
									>
										<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
											{n.title}
										</Typography>
										<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
											{n.description}
										</Typography>
									</Paper>
								))}
							</Stack>
						)}
					</Box>
				</Paper>
			</Modal>
			
			<ToastContainer toasts={toasts} />
		</Box>
	);
}