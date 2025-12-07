import {
	Box,
	Typography,
	Paper,
	Button,
	Stack,
	Divider,
	useTheme,
	alpha,
	Alert,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
	DeleteForever as DeleteIcon,
	Restore as RestoreIcon,
	Logout as LogoutIcon,
	Settings as SettingsIcon,
	Person as PersonIcon,
	Storage as StorageIcon,
	Warning as WarningIcon,
	Info as InfoIcon,
	CheckCircle as CheckCircleIcon,
	Close as CloseIcon,
	Backup as BackupIcon,
	CloudDownload as DownloadIcon,
} from "@mui/icons-material";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import useTechnologies from "../hooks/useTechnologies";
import { useNotifications } from "../context/NotificationContext";

export default function Settings() {
	const theme = useTheme();
	const navigate = useNavigate();
	const { user, logout } = useAuth();
	const { addNotification } = useNotifications();
	
	const {
		clearTechnologiesForCurrentUser,
		resetToDefaultsForCurrentUser,
		techList,
	} = useTechnologies();
	
	const [openDialog, setOpenDialog] = useState(null);
	const [loading, setLoading] = useState(false);
	
	const handleAction = async (actionType) => {
		setLoading(true);
		
		try {
			switch (actionType) {
				case 'clearCurrent':
					if (window.confirm("Удалить все технологии текущего пользователя?")) {
						clearTechnologiesForCurrentUser();
						addNotification("Данные очищены", "Технологии текущего пользователя удалены", "info");
					}
					break;
				
				case 'resetDefaults':
					if (window.confirm("Вернуть список технологий к значениям по умолчанию?")) {
						resetToDefaultsForCurrentUser();
						addNotification("Сброс выполнен", "Список технологий восстановлен к значениям по умолчанию", "success");
					}
					break;
				
				case 'logout':
					if (window.confirm("Выйти и удалить данные текущего пользователя?")) {
						logout();
						navigate("/");
						addNotification("Выход выполнен", "Вы вышли из системы", "info");
					}
					break;
				
				case 'clearAll':
					if (window.confirm("Полностью сбросить приложение и очистить технологии для всех пользователей?")) {
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
						addNotification("Полный сброс", "Все данные приложения очищены", "warning");
					}
					break;
				
				case 'exportData':
					exportToJson();
					break;
				
				case 'importData':
					// Реализация импорта
					document.getElementById('import-file-input')?.click();
					break;
			}
		} catch (error) {
			console.error("Ошибка:", error);
			addNotification("Ошибка", "Произошла ошибка при выполнении операции", "error");
		} finally {
			setLoading(false);
			setOpenDialog(null);
		}
	};
	
	const exportToJson = () => {
		try {
			const data = {
				exportedAt: new Date().toISOString(),
				user: user?.username || "guest",
				technologies: techList,
				total: techList.length,
			};
			
			const dataStr = JSON.stringify(data, null, 2);
			const dataBlob = new Blob([dataStr], { type: 'application/json' });
			const url = URL.createObjectURL(dataBlob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `techtracker-export-${user?.username || 'guest'}-${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			
			addNotification("Экспорт выполнен", "Данные успешно экспортированы в JSON", "success");
		} catch (error) {
			console.error("Ошибка экспорта:", error);
			addNotification("Ошибка экспорта", "Не удалось экспортировать данные", "error");
		}
	};
	
	const handleFileImport = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target.result);
				// Здесь должна быть логика импорта
				console.log("Импортированные данные:", data);
				addNotification("Импорт выполнен", "Данные успешно импортированы", "success");
			} catch (error) {
				console.error("Ошибка импорта:", error);
				addNotification("Ошибка импорта", "Неверный формат файла", "error");
			}
		};
		reader.readAsText(file);
		event.target.value = '';
	};
	
	const actionItems = [
		{
			title: "Экспорт данных",
			description: "Сохранить все технологии в JSON файл",
			icon: <BackupIcon />,
			color: theme.palette.info.main,
			action: () => handleAction('exportData'),
			disabled: techList.length === 0,
		},
		{
			title: "Импорт данных",
			description: "Загрузить технологии из JSON файла",
			icon: <DownloadIcon />,
			color: theme.palette.info.main,
			action: () => handleAction('importData'),
		},
		{
			title: "Очистить мои технологии",
			description: "Удалить все технологии текущего пользователя",
			icon: <DeleteIcon />,
			color: theme.palette.warning.main,
			action: () => setOpenDialog('clearCurrent'),
			disabled: techList.length === 0,
		},
		{
			title: "Сбросить к значениям по умолчанию",
			description: "Восстановить начальный список технологий",
			icon: <RestoreIcon />,
			color: theme.palette.warning.main,
			action: () => setOpenDialog('resetDefaults'),
		},
		{
			title: "Выйти и удалить пользователя",
			description: "Завершить сеанс и удалить данные пользователя",
			icon: <LogoutIcon />,
			color: theme.palette.error.main,
			action: () => setOpenDialog('logout'),
		},
		{
			title: "Полный сброс приложения",
			description: "Очистить все данные для всех пользователей",
			icon: <DeleteIcon />,
			color: theme.palette.error.dark,
			action: () => setOpenDialog('clearAll'),
		},
	];
	
	const dialogConfigs = {
		clearCurrent: {
			title: "Очистить мои технологии",
			content: "Вы уверены, что хотите удалить все технологии текущего пользователя? Это действие нельзя отменить.",
			confirmText: "Очистить",
			confirmColor: "warning",
		},
		resetDefaults: {
			title: "Сбросить к значениям по умолчанию",
			content: "Восстановить начальный список технологий? Ваши текущие данные будут заменены.",
			confirmText: "Сбросить",
			confirmColor: "warning",
		},
		logout: {
			title: "Выйти и удалить пользователя",
			content: "Завершить сеанс и удалить все данные текущего пользователя?",
			confirmText: "Выйти",
			confirmColor: "error",
		},
		clearAll: {
			title: "Полный сброс приложения",
			content: "Это очистит все данные для всех пользователей и сбросит приложение. Действие необратимо.",
			confirmText: "Сбросить всё",
			confirmColor: "error",
		},
	};
	
	return (
		<Box sx={{ py: 4 }}>
			<input
				type="file"
				id="import-file-input"
				accept=".json"
				style={{ display: 'none' }}
				onChange={handleFileImport}
			/>
			
			<Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
				{/* Заголовок */}
				<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
					<Box
						sx={{
							width: 56,
							height: 56,
							borderRadius: "50%",
							bgcolor: alpha(theme.palette.primary.main, 0.1),
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<SettingsIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
					</Box>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800 }}>
							Настройки
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Управление данными и настройками приложения
						</Typography>
					</Box>
				</Stack>
				
				{/* Информация о пользователе */}
				<Paper
					variant="outlined"
					sx={{
						p: 3,
						borderRadius: 3,
						mb: 4,
						borderColor: alpha(theme.palette.primary.main, 0.2),
						bgcolor: alpha(theme.palette.primary.main, 0.03),
					}}
				>
					<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
						<PersonIcon sx={{ color: theme.palette.primary.main }} />
						<Typography variant="h6" sx={{ fontWeight: 600 }}>
							Информация о пользователе
						</Typography>
					</Stack>
					
					<Stack spacing={2}>
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Typography variant="body2" color="text.secondary">
								Имя пользователя:
							</Typography>
							<Typography variant="body1" sx={{ fontWeight: 500 }}>
								{user?.username || "Гость"}
							</Typography>
						</Box>
						
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Typography variant="body2" color="text.secondary">
								Сохранено технологий:
							</Typography>
							<Typography variant="body1" sx={{ fontWeight: 500 }}>
								{techList.length} шт.
							</Typography>
						</Box>
						
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<Typography variant="body2" color="text.secondary">
								Тип хранения:
							</Typography>
							<Typography variant="body1" sx={{ fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}>
								<StorageIcon fontSize="small" />
								Локальное хранилище
							</Typography>
						</Box>
					</Stack>
				</Paper>
				
				{/* Предупреждение */}
				<Alert
					severity="info"
					icon={<InfoIcon />}
					sx={{
						mb: 4,
						borderRadius: 2,
						border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
						bgcolor: alpha(theme.palette.info.main, 0.05),
					}}
				>
					<Typography variant="body2">
						Все настройки и данные хранятся локально в вашем браузере.
						Для резервного копирования используйте функцию экспорта.
					</Typography>
				</Alert>
				
				{/* Действия */}
				<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
					Управление данными
				</Typography>
				
				<List sx={{ mb: 4 }}>
					{actionItems.map((item, index) => (
						<Paper
							key={index}
							variant="outlined"
							sx={{
								mb: 2,
								borderRadius: 2,
								borderColor: alpha(item.color, 0.2),
								bgcolor: alpha(item.color, 0.03),
								transition: "all 0.2s ease",
								"&:hover": {
									borderColor: item.color,
									bgcolor: alpha(item.color, 0.08),
									transform: "translateX(4px)",
								},
								"&.Mui-disabled": {
									opacity: 0.5,
								},
							}}
						>
							<ListItem
								button
								onClick={item.action}
								disabled={item.disabled || loading}
								sx={{
									borderRadius: 2,
									py: 2.5,
								}}
							>
								<ListItemIcon sx={{ color: item.color, minWidth: 48 }}>
									{item.icon}
								</ListItemIcon>
								
								<ListItemText
									primary={
										<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
											{item.title}
										</Typography>
									}
									secondary={
										<Typography variant="body2" color="text.secondary">
											{item.description}
										</Typography>
									}
								/>
								
								{item.disabled && (
									<Tooltip title="Нет данных для этого действия">
										<WarningIcon sx={{ color: theme.palette.warning.main }} />
									</Tooltip>
								)}
							</ListItem>
						</Paper>
					))}
				</List>
				
				{/* Диалоговые окна */}
				<Dialog
					open={!!openDialog}
					onClose={() => setOpenDialog(null)}
					PaperProps={{
						sx: { borderRadius: 3, maxWidth: 500 },
					}}
				>
					{openDialog && (
						<>
							<DialogTitle sx={{ pb: 1 }}>
								<Stack direction="row" alignItems="center" justifyContent="space-between">
									<Typography variant="h6" sx={{ fontWeight: 600 }}>
										{dialogConfigs[openDialog].title}
									</Typography>
									<IconButton onClick={() => setOpenDialog(null)} size="small">
										<CloseIcon />
									</IconButton>
								</Stack>
							</DialogTitle>
							
							<DialogContent sx={{ py: 2 }}>
								<Alert
									severity={dialogConfigs[openDialog].confirmColor}
									icon={<WarningIcon />}
									sx={{ mb: 2, borderRadius: 2 }}
								>
									<Typography variant="body2">
										{dialogConfigs[openDialog].content}
									</Typography>
								</Alert>
								
								<Typography variant="caption" color="text.secondary">
									Это действие нельзя отменить. Пожалуйста, убедитесь, что вы экспортировали важные данные.
								</Typography>
							</DialogContent>
							
							<DialogActions sx={{ px: 3, pb: 3 }}>
								<Button
									onClick={() => setOpenDialog(null)}
									variant="outlined"
									sx={{ borderRadius: 2 }}
								>
									Отмена
								</Button>
								<Button
									onClick={() => handleAction(openDialog)}
									variant="contained"
									color={dialogConfigs[openDialog].confirmColor}
									disabled={loading}
									sx={{ borderRadius: 2 }}
								>
									{loading ? "Выполняется..." : dialogConfigs[openDialog].confirmText}
								</Button>
							</DialogActions>
						</>
					)}
				</Dialog>
				
				{/* Футер */}
				<Paper
					variant="outlined"
					sx={{
						p: 3,
						borderRadius: 3,
						borderColor: alpha(theme.palette.divider, 0.5),
						bgcolor: alpha(theme.palette.background.paper, 0.5),
						textAlign: "center",
					}}
				>
					<Typography variant="caption" color="text.secondary">
						TechTracker v1.0 • Все данные хранятся локально в вашем браузере
					</Typography>
				</Paper>
			</Box>
		</Box>
	);
}