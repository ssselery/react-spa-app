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
	Paper
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
import ToastContainer from "../components/ToastContainer";


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
	const { notifications, markAllAsRead, toasts } = useNotifications();
	
	const unreadCount = notifications.filter((n) => !n.read).length;
	
	const bg = mode === "light" ? "#fafafa" : "#111";
	const border = mode === "light" ? "#e5e5e5" : "#222";
	const textPrimary = mode === "light" ? "#111" : "#f5f5f5";
	
	/* Drawer content */
	const drawer = (
		<Box sx={{ width: 260, bgcolor: bg, height: "100%" }}>
			<Typography
				variant="h6"
				sx={{
					p: 2,
					color: textPrimary,
					fontWeight: 600,
					borderBottom: `1px solid ${border}`,
				}}
			>
				Меню
			</Typography>
			
			<List>
				{navItems.map(({ label, to, icon }) => (
					<ListItem key={to} disablePadding>
						<ListItemButton component={Link} to={to} selected={pathname === to}>
							{icon}
							<ListItemText primary={label} sx={{ ml: 2 }} />
						</ListItemButton>
					</ListItem>
				))}
				
				<Divider />
				
				{/* Notifications button mobile */}
				<ListItemButton onClick={() => setNotifOpen(true)}>
					<Badge badgeContent={unreadCount} color="error">
						<NotificationsIcon />
					</Badge>
					<ListItemText primary="Уведомления" sx={{ ml: 2 }} />
				</ListItemButton>
				
				<Divider />
				
				{/* login / user */}
				{!user && (
					<ListItemButton component={Link} to="/login">
						<AccountCircleIcon fontSize="small" />
						<ListItemText primary="Войти" sx={{ ml: 2 }} />
					</ListItemButton>
				)}
				
				{user && (
					<>
						<ListItem sx={{ px: 2, py: 1 }}>
							<Stack direction="row" spacing={2} alignItems="center">
								<Avatar>{user.username[0].toUpperCase()}</Avatar>
								<Typography>{user.username}</Typography>
							</Stack>
						</ListItem>
						
						<ListItemButton component={Link} to="/bio">
							<ListItemText primary="Аккаунт" />
						</ListItemButton>
						
						<ListItemButton onClick={logout}>
							<ListItemText primary="Выйти" />
						</ListItemButton>
					</>
				)}
			</List>
		</Box>
	);
	
	return (
		<Box sx={{ display: "flex", minHeight: "100vh", bgcolor: bg }}>
			<AppBar position="fixed" elevation={0} sx={{ bgcolor: bg, borderBottom: `1px solid ${border}` }}>
				<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
					<IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: "none" } }}>
						<MenuIcon />
					</IconButton>
					
					<Typography
						component={Link}
						to="/"
						variant="h6"
						sx={{
							color: textPrimary,
							textDecoration: "none",
							fontWeight: 700,
						}}
					>
						TechTracker
					</Typography>
					
					<Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
						{navItems.map(({ label, to }) => (
							<Button
								key={to}
								component={Link}
								to={to}
								sx={{ textTransform: "none", color: pathname === to ? textPrimary : "#777" }}
							>
								{label}
							</Button>
						))}
					</Box>
					
					{/* RIGHT icons */}
					<Stack direction="row" spacing={1} alignItems="center">
						{/* notifications */}
						<IconButton onClick={() => setNotifOpen(true)}>
							<Badge badgeContent={unreadCount} color="error">
								<NotificationsIcon />
							</Badge>
						</IconButton>
						
						{/* theme switch */}
						<IconButton onClick={toggleColorMode}>
							{mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
						</IconButton>
						
						{/* login / user */}
						{!user ? (
							<Button component={Link} to="/login">Войти</Button>
						) : (
							<>
								<Avatar onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ cursor: "pointer" }}>
									{user.username[0].toUpperCase()}
								</Avatar>
								
								<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
									<MenuItem component={Link} to="/bio">Аккаунт</MenuItem>
									<MenuItem onClick={logout}>Выйти</MenuItem>
								</Menu>
							</>
						)}
					</Stack>
				</Toolbar>
			</AppBar>
			
			<Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
				{drawer}
			</Drawer>
			
			<Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, maxWidth: "1200px", mx: "auto" }}>
				<Outlet />
			</Box>
			
			<NotificationModal
				open={notifOpen}
				onClose={() => {
					markAllAsRead();
					setNotifOpen(false);
				}}
				notifications={notifications}
			/>
			
			<ToastContainer toasts={toasts} />
		
		</Box>
	);
}

function NotificationModal({ open, onClose, notifications }) {
	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: "absolute",
					top: "70px",
					right: "20px",
					width: 380,
					maxHeight: "70vh",
					overflowY: "auto",
					borderRadius: 3,
				}}
			>
				<Paper sx={{ p: 2 }}>
					<Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
						Уведомления
					</Typography>
					
					{notifications.length === 0 && (
						<Typography sx={{ color: "text.secondary" }}>
							Уведомлений нет
						</Typography>
					)}
					
					{notifications.map((n) => (
						<Box
							key={n.id}
							sx={{
								p: 2,
								mb: 2,
								borderRadius: 2,
								borderLeft: `4px solid ${
									n.type === "success"
										? "#4caf50"
										: n.type === "error"
											? "#d32f2f"
											: n.type === "warning"
												? "#ed6c02"
												: "#1976d2"
								}`,
								bgcolor: n.read ? "transparent" : "action.hover",
							}}
						>
							<Typography variant="subtitle1">{n.title}</Typography>
							<Typography variant="body2" sx={{ color: "text.secondary" }}>
								{n.description}
							</Typography>
						</Box>
					))}
				</Paper>
			</Box>
		</Modal>
	);
}

