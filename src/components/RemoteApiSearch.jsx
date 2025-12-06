import { useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Stack,
	Alert,
	Paper,
	useTheme,
} from "@mui/material";
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
		id: item.id ?? index,
		title: item.title || "Без названия",
		description: item.description || item.body || "",
		category: item.category || "",
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
	
	const { addNotification } = useNotifications();
	
	const handleLoadApi = async () => {
		try {
			setLoading(true);
			setError("");
			setInfo("");
			
			const res = await fetch(apiUrl.trim());
			if (!res.ok) throw new Error(`Ошибка загрузки API (HTTP ${res.status})`);
			
			const data = await res.json();
			const normalized = normalizeApiData(data, apiUrl.trim());
			
			if (!normalized.length) throw new Error("Неверный формат API");
			
			setLoadedItems(normalized);
			setInfo(`Подключено технологий: ${normalized.length}`);
		} catch (e) {
			setLoadedItems([]);
			setError(e.message || "Ошибка загрузки API");
		} finally {
			setLoading(false);
		}
	};
	
	const handleImportOne = (item) => {
		onImportTechnology({
			title: item.title,
			description: item.description,
			category: item.category,
			source: item.source,
			status: "not-started",
			notes: "",
		});
		setInfo(`Технология "${item.title}" импортирована`);
		addNotification("Импортировано из API", item.title);
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
	
	return (
		<Box
			sx={{
				bgcolor: theme.palette.background.paper,
				p: 2,
				borderRadius: 2,
				border: `1px solid ${theme.palette.divider}`,
			}}
		>
			<Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
				Поиск по API
			</Typography>
			
			{/* URL + кнопка */}
			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={2}
				alignItems="stretch"
				sx={{ mb: 2 }}
			>
				<TextField
					fullWidth
					size="small"
					value={apiUrl}
					onChange={(e) => setApiUrl(e.target.value)}
					placeholder="https://... (URL API)"
				/>
				
				<Button
					variant="outlined"
					onClick={handleLoadApi}
					disabled={loading}
					size="small"
					sx={{
						whiteSpace: "nowrap",
						textTransform: "none",
						borderRadius: "10px",
						color: theme.palette.text.primary,
						borderColor: theme.palette.divider,
						"&:hover": {
							borderColor: theme.palette.text.secondary,
							backgroundColor:
								theme.palette.mode === "light"
									? "#f4f4f4"
									: "rgba(255,255,255,0.06)",
						},
					}}
				>
					{loading ? "Загрузка…" : "Загрузить API"}
				</Button>
			</Stack>
			
			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}
			
			{info && !error && (
				<Alert severity="success" sx={{ mb: 2 }}>
					{info}
				</Alert>
			)}
			
			{hasApi && (
				<Box sx={{ mt: 2 }}>
					<Box sx={{ maxWidth: 360, mb: 3 }}>
						<SearchDebounced onSearch={setSearchQuery} />
					</Box>
					
					<Stack spacing={2}>
						{filtered.map((item) => (
							<Paper
								key={item.id}
								variant="outlined"
								sx={{
									p: 2,
									borderRadius: 2,
									borderColor: theme.palette.divider,
									bgcolor: theme.palette.background.paper,  // !!! ДЛЯ ТЁМНОЙ ТЕМЫ
									display: "flex",
									justifyContent: "space-between",
									gap: 2,
								}}
							>
								<Box sx={{ flex: 1 }}>
									<Typography
										variant="subtitle1"
										sx={{ fontWeight: 700, mb: 0.3 }}
									>
										{item.title}
									</Typography>
									
									{item.category && (
										<Typography
											variant="caption"
											sx={{ color: theme.palette.text.secondary }}
										>
											Категория: {item.category}
										</Typography>
									)}
									
									{item.description && (
										<Typography
											variant="body2"
											sx={{ mt: 1, color: theme.palette.text.secondary }}
										>
											{item.description}
										</Typography>
									)}
								</Box>
								
								<Button
									variant="contained"
									color="success"
									size="small"
									onClick={() => handleImportOne(item)}
									sx={{
										textTransform: "none",
										fontSize: "0.7rem",
										borderRadius: "16px",
										padding: "2px 12px",
										minHeight: "38px",
										height: "100%",
										lineHeight: 1,
									}}
								>
									Импортировать
								</Button>
							
							</Paper>
						))}
					</Stack>
				</Box>
			)}
			
			{!hasApi && !loading && !error && (
				<Typography variant="body2" sx={{ mt: 1.5, color: "text.secondary" }}>
					Подключите API, чтобы появился поиск по данным.
				</Typography>
			)}
		</Box>
	);
}
