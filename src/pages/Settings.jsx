import {
	Box,
	Typography,
	Paper,
	Button,
	Stack,
	Divider,
	useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useTechnologies from "../hooks/useTechnologies";

export default function Settings() {
	const theme = useTheme();
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
				"Полностью сбросить приложение и очистить технологии для всех пользователей?"
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
		<Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
			<Box sx={{ width: "100%", maxWidth: 900 }}>
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
					Настройки
				</Typography>
				
				<Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
					Управляйте данными технологий и учётной записи.
					Все изменения сохраняются локально в браузере.
				</Typography>
				
				<Paper
					variant="outlined"
					sx={{
						p: 3,
						borderRadius: 3,
						bgcolor: "background.paper",
					}}
				>
					{/* --- Текущий пользователь --- */}
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
						Текущий пользователь
					</Typography>
					
					<Stack spacing={1.5} sx={{ mb: 4 }}>
						<Button
							variant="outlined"
							color="warning"
							onClick={handleClearTechnologiesCurrent}
							sx={{ textTransform: "none", borderRadius: 2 }}
						>
							Очистить технологии текущего пользователя
						</Button>
						
						<Button
							variant="outlined"
							onClick={handleResetDefaults}
							sx={{ textTransform: "none", borderRadius: 2 }}
						>
							Сбросить список технологий к значениям по умолчанию
						</Button>
					</Stack>
					
					<Divider sx={{ my: 3 }} />
					
					{/* --- Аккаунт --- */}
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
						Аккаунт
					</Typography>
					
					<Stack spacing={1.5} sx={{ mb: 4 }}>
						<Button
							variant="contained"
							color="error"
							onClick={handleClearUser}
							sx={{
								textTransform: "none",
								borderRadius: 2,
								color: "#fff",
							}}
						>
							Выйти и удалить пользователя
						</Button>
					</Stack>
					
					<Divider sx={{ my: 3 }} />
					
					{/* --- Полный сброс --- */}
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
						Полный сброс
					</Typography>
					
					<Stack spacing={1.5}>
						<Button
							variant="contained"
							color="error"
							onClick={handleClearAll}
							sx={{
								textTransform: "none",
								borderRadius: 2,
								color: "#fff",
							}}
						>
							Очистить технологии для всех и сбросить приложение
						</Button>
					</Stack>
				</Paper>
			</Box>
		</Box>
	);
}
