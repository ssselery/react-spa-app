import { useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Stack,
	Alert,
	Paper,
	Chip,
	IconButton,
	Tooltip,
	LinearProgress,
	useTheme,
	alpha,
	InputAdornment,
	Snackbar,
} from "@mui/material";
import {
	Search as SearchIcon,
	CloudDownload as CloudDownloadIcon,
	Refresh as RefreshIcon,
	Link as LinkIcon,
	Category as CategoryIcon,
	CheckCircle as CheckCircleIcon,
	Warning as WarningIcon,
	Info as InfoIcon,
} from "@mui/icons-material";
import MuiAlert from '@mui/material/Alert';
import SearchDebounced from "./SearchDebounced";
import { useNotifications } from "../context/NotificationContext";

const DEFAULT_API_URL =
	"https://raw.githubusercontent.com/ssselery/react-spa-app/refs/heads/main/ApiTest/roadmap-frontend.json";

function normalizeApiData(raw, apiUrl) {
	if (!raw) return [];
	
	let list = [];
	
	if (Array.isArray(raw)) list = raw;
	else if (Array.isArray(raw.technologies)) list = raw.technologies;
	else return [];
	
	return list.map((item, index) => ({
		id: item.id ?? `api-${index}-${Date.now()}`,
		title: item.title || "Без названия",
		description: item.description || item.body || "",
		category: item.category || "frontend",
		source:
			item.source ||
			(Array.isArray(item.resources) ? item.resources[0] || apiUrl : apiUrl),
	}));
}

export default function RemoteApiSearch({ onImportTechnology }) {
	const theme = useTheme();
	
	const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
	const [loadedItems, setLoadedItems] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");
	const [importedIds, setImportedIds] = useState(new Set());
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
	
	const { addNotification } = useNotifications();
	
	const showSnackbar = (message, severity = "info") => {
		setSnackbar({ open: true, message, severity });
	};
	
	const handleLoadApi = async () => {
		try {
			setLoading(true);
			setError("");
			setInfo("");
			setLoadedItems([]);
			
			const res = await fetch(apiUrl.trim());
			if (!res.ok) throw new Error(`Ошибка загрузки API (HTTP ${res.status})`);
			
			const data = await res.json();
			const normalized = normalizeApiData(data, apiUrl.trim());
			
			if (!normalized.length) throw new Error("Неверный формат API данных");
			
			setLoadedItems(normalized);
			setInfo(`Загружено технологий: ${normalized.length}`);
			showSnackbar(`API загружен: ${normalized.length} технологий`, "success");
		} catch (e) {
			setLoadedItems([]);
			setError(e.message || "Ошибка загрузки API");
			showSnackbar(`Ошибка: ${e.message}`, "error");
		} finally {
			setLoading(false);
		}
	};
	
	const handleImportOne = async (item) => {
		console.log("Importing item:", item);
		console.log("onImportTechnology prop:", onImportTechnology);
		
		if (typeof onImportTechnology !== "function") {
			const errorMsg = "Функция импорта не доступна. Проверьте подключение компонента.";
			console.error(errorMsg);
			setError(errorMsg);
			showSnackbar(errorMsg, "error");
			return;
		}
		
		try {
			const newTech = {
				title: item.title,
				description: item.description,
				category: item.category,
				source: item.source,
				status: "not-started",
				notes: `Импортировано из API: ${item.source}`,
				createdAt: new Date().toISOString().split("T")[0],
			};
			
			console.log("Calling onImportTechnology with:", newTech);
			
			// Вызываем функцию импорта
			const result = onImportTechnology(newTech);
			console.log("Import result:", result);
			
			// Обновляем состояние
			setImportedIds(prev => new Set([...prev, item.id]));
			setInfo(`Технология "${item.title}" импортирована`);
			
			// Показываем уведомление
			showSnackbar(`"${item.title}" добавлена в список`, "success");
			
			// Если есть глобальная система уведомлений
			if (addNotification) {
				addNotification(
					"Импортировано из API",
					`"${item.title}" добавлена в ваш список`,
					"success"
				);
			}
		} catch (err) {
			console.error("Ошибка импорта:", err);
			const errorMsg = `Ошибка импорта: ${err.message}`;
			setError(errorMsg);
			showSnackbar(errorMsg, "error");
		}
	};
	
	const handleImportAll = async () => {
		if (typeof onImportTechnology !== "function") {
			const errorMsg = "Функция импорта не доступна. Проверьте подключение компонента.";
			console.error(errorMsg);
			setError(errorMsg);
			showSnackbar(errorMsg, "error");
			return;
		}
		
		if (!loadedItems.length) {
			showSnackbar("Нет данных для импорта", "warning");
			return;
		}
		
		let count = 0;
		const errors = [];
		
		try {
			for (const item of loadedItems) {
				if (!importedIds.has(item.id)) {
					const newTech = {
						title: item.title,
						description: item.description,
						category: item.category,
						source: item.source,
						status: "not-started",
						notes: `Импортировано из API: ${item.source}`,
						createdAt: new Date().toISOString().split("T")[0],
					};
					
					console.log("Importing:", item.title);
					
					try {
						await Promise.resolve(onImportTechnology(newTech));
						count++;
						setImportedIds(prev => new Set([...prev, item.id]));
					} catch (err) {
						errors.push(`"${item.title}": ${err.message}`);
					}
				}
			}
			
			if (count > 0) {
				const successMsg = `Импортировано ${count} технологий`;
				setInfo(successMsg);
				showSnackbar(successMsg, "success");
				
				if (addNotification) {
					addNotification("Импорт завершен", `Добавлено ${count} технологий`, "success");
				}
			}
			
			if (errors.length > 0) {
				const errorMsg = `Ошибки при импорте: ${errors.join("; ")}`;
				setError(errorMsg);
				showSnackbar(`Импорт завершен с ошибками`, "warning");
			}
			
		} catch (err) {
			console.error("Ошибка массового импорта:", err);
			const errorMsg = `Ошибка импорта: ${err.message}`;
			setError(errorMsg);
			showSnackbar(errorMsg, "error");
		}
	};
	
	const filtered = loadedItems.filter((t) => {
		const q = searchQuery.toLowerCase();
		return (
			t.title.toLowerCase().includes(q) ||
			t.description.toLowerCase().includes(q) ||
			t.category.toLowerCase().includes(q)
		);
	});
	
	const hasApi = loadedItems.length > 0;
	const notImportedCount = loadedItems.length - importedIds.size;
	
	return (
		<Box>
			{/* Заголовок */}
			<Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
				<Box
					sx={{
						width: 48,
						height: 48,
						borderRadius: 2,
						bgcolor: alpha(theme.palette.primary.main, 0.1),
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<LinkIcon sx={{ color: theme.palette.primary.main }} />
				</Box>
				<Box>
					<Typography variant="h5" sx={{ fontWeight: 800 }}>
						Удаленный API поиск
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Импортируйте технологии из внешних JSON API
					</Typography>
				</Box>
			</Stack>
			
			{/* URL и кнопка загрузки */}
			<Stack spacing={2} sx={{ mb: 3 }}>
				<TextField
					fullWidth
					size="small"
					value={apiUrl}
					onChange={(e) => setApiUrl(e.target.value)}
					placeholder="Введите URL JSON API..."
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<LinkIcon fontSize="small" />
							</InputAdornment>
						),
						endAdornment: loading && (
							<InputAdornment position="end">
								<LinearProgress sx={{ width: 40 }} />
							</InputAdornment>
						),
					}}
					sx={{
						"& .MuiOutlinedInput-root": {
							borderRadius: 2,
						},
					}}
				/>
				
				<Stack direction="row" spacing={2}>
					<Button
						variant="contained"
						onClick={handleLoadApi}
						disabled={loading || !apiUrl.trim()}
						startIcon={<CloudDownloadIcon />}
						sx={{ borderRadius: 2, flex: 1 }}
					>
						{loading ? "Загрузка..." : "Загрузить API"}
					</Button>
					
					{hasApi && (
						<Button
							variant="outlined"
							onClick={handleImportAll}
							disabled={notImportedCount === 0 || loading}
							startIcon={<CheckCircleIcon />}
							sx={{ borderRadius: 2 }}
						>
							Импортировать все ({notImportedCount})
						</Button>
					)}
				</Stack>
			</Stack>
			
			{/* Статус */}
			{loading && (
				<Box sx={{ mb: 2 }}>
					<LinearProgress sx={{ borderRadius: 2, height: 6 }} />
					<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
						Загрузка данных...
					</Typography>
				</Box>
			)}
			
			{error && (
				<Alert
					severity="error"
					sx={{ mb: 2, borderRadius: 2 }}
					onClose={() => setError("")}
				>
					{error}
				</Alert>
			)}
			
			{info && !error && (
				<Alert
					severity="success"
					sx={{ mb: 2, borderRadius: 2 }}
					onClose={() => setInfo("")}
				>
					{info}
				</Alert>
			)}
			
			{/* Поиск по загруженным данным */}
			{hasApi && (
				<>
					<Box sx={{ mb: 3 }}>
						<TextField
							fullWidth
							size="small"
							placeholder="Поиск по загруженным технологиям..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon fontSize="small" />
									</InputAdornment>
								),
							}}
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: 2,
								},
							}}
						/>
					</Box>
					
					<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: "text.secondary" }}>
						Найдено: {filtered.length} из {loadedItems.length}
						{searchQuery && ` по запросу "${searchQuery}"`}
					</Typography>
					
					{/* Список технологий */}
					<Stack spacing={2}>
						{filtered.map((item) => {
							const isImported = importedIds.has(item.id);
							
							return (
								<Paper
									key={item.id}
									variant="outlined"
									sx={{
										p: 2.5,
										borderRadius: 3,
										borderColor: isImported ? theme.palette.success.main : "divider",
										borderLeft: `4px solid ${isImported ? theme.palette.success.main : theme.palette.primary.main}`,
										bgcolor: isImported ? alpha(theme.palette.success.main, 0.03) : "background.paper",
										transition: "all 0.2s ease",
										"&:hover": {
											transform: "translateX(4px)",
											boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
										},
									}}
								>
									<Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
										<Box sx={{ flex: 1 }}>
											<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
												{isImported && (
													<Chip
														label="Импортировано"
														size="small"
														color="success"
														icon={<CheckCircleIcon fontSize="small" />}
														sx={{ height: 24 }}
													/>
												)}
												<Chip
													icon={<CategoryIcon fontSize="small" />}
													label={item.category}
													size="small"
													variant="outlined"
													sx={{ height: 24 }}
												/>
											</Stack>
											
											<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
												{item.title}
											</Typography>
											
											<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
												{item.description}
											</Typography>
											
											{item.source && (
												<Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
													<LinkIcon fontSize="inherit" />
													{item.source}
												</Typography>
											)}
										</Box>
										
										<Button
											variant={isImported ? "outlined" : "contained"}
											color={isImported ? "success" : "primary"}
											onClick={() => handleImportOne(item)}
											disabled={isImported}
											startIcon={isImported ? <CheckCircleIcon /> : <CloudDownloadIcon />}
											sx={{ borderRadius: 2, minWidth: 140 }}
										>
											{isImported ? "Добавлено" : "Импортировать"}
										</Button>
									</Stack>
								</Paper>
							);
						})}
					</Stack>
				</>
			)}
			
			{!hasApi && !loading && !error && (
				<Paper
					variant="outlined"
					sx={{
						p: 4,
						textAlign: "center",
						borderRadius: 3,
						bgcolor: alpha(theme.palette.background.paper, 0.5),
					}}
				>
					<Box
						sx={{
							width: 64,
							height: 64,
							borderRadius: "50%",
							bgcolor: alpha(theme.palette.primary.main, 0.1),
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							mx: "auto",
							mb: 2,
						}}
					>
						<LinkIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
					</Box>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
						API не загружен
					</Typography>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						Введите URL JSON API и нажмите "Загрузить API", чтобы начать поиск
					</Typography>
					<Typography variant="caption" color="text.secondary">
						Пример: {DEFAULT_API_URL}
					</Typography>
				</Paper>
			)}
			
			{/* Snackbar для уведомлений */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
}