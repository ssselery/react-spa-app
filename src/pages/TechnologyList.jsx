import {
	Box,
	Typography,
	Paper,
	Container,
	TextField,
	InputAdornment,
	Stack,
	Chip,
	IconButton,
	Button,
	useTheme,
	ToggleButton,
	ToggleButtonGroup,
	Skeleton,
	Alert,
	alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useTechnologies from "../hooks/useTechnologies";
import SimpleTechCard from "../components/SimpleTechCard";
import RemoteApiSearch from "../components/RemoteApiSearch";

export default function TechnologyList() {
	const theme = useTheme();
	const { techList, updateStatus, addTechnology } = useTechnologies();
	
	const [query, setQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [viewMode, setViewMode] = useState("grid");
	const [loading, setLoading] = useState(true);
	
	// Имитация загрузки
	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 800);
		return () => clearTimeout(timer);
	}, []);
	
	// Получение уникальных категорий
	const categories = [...new Set(techList.map(t => t.category || "Без категории"))];
	
	// Фильтрация
	const filtered = techList.filter((t) => {
		const q = query.toLowerCase();
		const title = (t.title || "").toLowerCase();
		const desc = (t.description || "").toLowerCase();
		const cat = (t.category || "").toLowerCase();
		
		// Поиск по тексту
		const matchesSearch = !query || title.includes(q) || desc.includes(q) || cat.includes(q);
		
		// Фильтр по статусу
		const matchesStatus = statusFilter === "all" || t.status === statusFilter;
		
		// Фильтр по категории
		const matchesCategory = categoryFilter === "all" ||
			(t.category === categoryFilter) ||
			(!t.category && categoryFilter === "Без категории");
		
		return matchesSearch && matchesStatus && matchesCategory;
	});
	
	const stats = {
		total: techList.length,
		completed: techList.filter(t => t.status === "completed").length,
		inProgress: techList.filter(t => t.status === "in-progress").length,
		notStarted: techList.filter(t => t.status === "not-started").length,
	};
	
	if (loading) {
		return (
			<Container maxWidth="xl" sx={{ py: 4 }}>
				<Skeleton variant="text" width={200} height={60} sx={{ mb: 3 }} />
				<Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 4, borderRadius: 2 }} />
				
				<Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 3 }}>
					{[1, 2, 3, 4, 5, 6].map(i => (
						<Skeleton key={i} variant="rectangular" height={320} sx={{ borderRadius: 3 }} />
					))}
				</Box>
			</Container>
		);
	}
	
	return (
		<Container maxWidth="xl" sx={{ py: 4 }}>
			{/* Заголовок и статистика */}
			<Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={3} sx={{ mb: 4 }}>
				<Box>
					<Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
						Технологии
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Управляйте своим стеком технологий
					</Typography>
				</Box>
				
				<Button
					component={Link}
					to="/add"
					variant="contained"
					startIcon={<AddIcon />}
					sx={{
						borderRadius: 2,
						fontWeight: 600,
						px: 3,
					}}
				>
					Добавить технологию
				</Button>
			</Stack>
			
			{/* Статистика */}
			<Paper
				variant="outlined"
				sx={{
					p: 3,
					mb: 4,
					borderRadius: 3,
					bgcolor: alpha(theme.palette.primary.main, 0.03),
					borderColor: alpha(theme.palette.primary.main, 0.1),
				}}
			>
				<Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap">
					<Box sx={{ textAlign: "center" }}>
						<Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
							{stats.total}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Всего
						</Typography>
					</Box>
					
					<Box sx={{ textAlign: "center" }}>
						<Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.success.main }}>
							{stats.completed}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Завершено
						</Typography>
					</Box>
					
					<Box sx={{ textAlign: "center" }}>
						<Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.warning.main }}>
							{stats.inProgress}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							В процессе
						</Typography>
					</Box>
					
					<Box sx={{ textAlign: "center" }}>
						<Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.text.secondary }}>
							{stats.notStarted}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Не начато
						</Typography>
					</Box>
				</Stack>
			</Paper>
			
			{/* Панель фильтров и поиска */}
			<Paper
				variant="outlined"
				sx={{
					p: 3,
					mb: 4,
					borderRadius: 3,
				}}
			>
				<Stack spacing={3}>
					{/* Поиск */}
					<TextField
						fullWidth
						placeholder="Поиск технологий по названию, описанию или категории..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon />
								</InputAdornment>
							),
						}}
						sx={{
							"& .MuiOutlinedInput-root": {
								borderRadius: 2,
							},
						}}
					/>
					
					<Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
						{/* Фильтр по статусу */}
						<Box sx={{ flex: 1 }}>
							<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
								<FilterListIcon fontSize="small" />
								Статус
							</Typography>
							<ToggleButtonGroup
								value={statusFilter}
								exclusive
								onChange={(e, value) => value !== null && setStatusFilter(value)}
								size="small"
								sx={{
									flexWrap: "wrap",
									gap: 1,
									"& .MuiToggleButton-root": {
										borderRadius: 2,
										border: "1px solid",
										borderColor: "divider",
										px: 2,
										py: 0.5,
										"&.Mui-selected": {
											bgcolor: "primary.main",
											color: "white",
											"&:hover": {
												bgcolor: "primary.dark",
											},
										},
									},
								}}
							>
								<ToggleButton value="all">Все</ToggleButton>
								<ToggleButton value="not-started">Не начато</ToggleButton>
								<ToggleButton value="in-progress">В процессе</ToggleButton>
								<ToggleButton value="completed">Завершено</ToggleButton>
							</ToggleButtonGroup>
						</Box>
						
						{/* Фильтр по категории */}
						<Box sx={{ flex: 1 }}>
							<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
								Категория
							</Typography>
							<Stack direction="row" spacing={1} flexWrap="wrap">
								<Chip
									label="Все"
									variant={categoryFilter === "all" ? "filled" : "outlined"}
									color={categoryFilter === "all" ? "primary" : "default"}
									onClick={() => setCategoryFilter("all")}
									sx={{ mb: 1 }}
								/>
								{categories.map((cat, index) => (
									<Chip
										key={`${cat}-${index}`}
										label={cat}
										variant={categoryFilter === cat ? "filled" : "outlined"}
										color={categoryFilter === cat ? "primary" : "default"}
										onClick={() => setCategoryFilter(cat)}
										sx={{ mb: 1 }}
									/>
								))}
							</Stack>
						</Box>
						
						{/* Режим просмотра */}
						<Box>
							<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
								Вид
							</Typography>
							<ToggleButtonGroup
								value={viewMode}
								exclusive
								onChange={(e, value) => value !== null && setViewMode(value)}
								size="small"
							>
								<ToggleButton value="grid">
									<GridViewIcon />
								</ToggleButton>
								<ToggleButton value="list">
									<ViewListIcon />
								</ToggleButton>
							</ToggleButtonGroup>
						</Box>
					</Stack>
					
					{/* Информация о фильтрах */}
					{filtered.length !== techList.length && (
						<Alert severity="info" sx={{ borderRadius: 2 }}>
							Показано {filtered.length} из {techList.length} технологий
							{(query || statusFilter !== "all" || categoryFilter !== "all") && (
								<Button
									size="small"
									onClick={() => {
										setQuery("");
										setStatusFilter("all");
										setCategoryFilter("all");
									}}
									sx={{ ml: 2 }}
								>
									Сбросить фильтры
								</Button>
							)}
						</Alert>
					)}
				</Stack>
			</Paper>
			
			{/* Список технологий */}
			{filtered.length === 0 ? (
				<Paper
					variant="outlined"
					sx={{
						p: 8,
						textAlign: "center",
						borderRadius: 3,
						bgcolor: alpha(theme.palette.background.paper, 0.5),
					}}
				>
					<Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
						Технологии не найдены
					</Typography>
					<Typography color="text.secondary" sx={{ mb: 3 }}>
						{query ? `По запросу "${query}" ничего не найдено` : "Попробуйте изменить фильтры или добавить новую технологию"}
					</Typography>
					<Button
						component={Link}
						to="/add"
						variant="contained"
						startIcon={<AddIcon />}
					>
						Добавить технологию
					</Button>
				</Paper>
			) : viewMode === "grid" ? (
				<Box
					sx={{
						display: "grid",
						gap: 3,
						gridTemplateColumns: {
							xs: "1fr",
							sm: "1fr 1fr",
							md: "1fr 1fr 1fr",
							lg: "repeat(auto-fill, minmax(320px, 1fr))",
						},
					}}
				>
					{filtered.map((tech, index) => (
						<SimpleTechCard
							key={`${tech.id}-${index}-${tech.title}`}
							technology={tech}
							onStatusChange={updateStatus}
						/>
					))}
				</Box>
			) : (
				<Stack spacing={2}>
					{filtered.map((tech, index) => (
						<Paper
							key={`paper-${tech.id}-${index}`}
							variant="outlined"
							sx={{
								p: 3,
								borderRadius: 3,
								transition: "all 0.2s ease",
								"&:hover": {
									transform: "translateX(4px)",
									borderColor: theme.palette.primary.main,
								},
							}}
						>
							<Stack direction="row" spacing={3} alignItems="center">
								<Box sx={{ flex: 1 }}>
									<Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
										{tech.title}
									</Typography>
									<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
										{tech.description}
									</Typography>
									<Stack direction="row" spacing={1}>
										<Chip
											label={tech.category || "Без категории"}
											size="small"
											variant="outlined"
										/>
										<Chip
											label={
												tech.status === "completed" ? "Завершено" :
													tech.status === "in-progress" ? "В процессе" : "Не начато"
											}
											size="small"
											color={
												tech.status === "completed" ? "success" :
													tech.status === "in-progress" ? "warning" : "default"
											}
										/>
									</Stack>
								</Box>
								<Button
									component={Link}
									to={`/technologies/${tech.id}`}
									variant="outlined"
									size="small"
									sx={{ borderRadius: 2 }}
								>
									Подробнее
								</Button>
							</Stack>
						</Paper>
					))}
				</Stack>
			)}
			
			{/* API блок */}
			<Paper
				variant="outlined"
				sx={{
					p: 4,
					mt: 6,
					borderRadius: 3,
					borderColor: alpha(theme.palette.info.main, 0.2),
					bgcolor: alpha(theme.palette.info.main, 0.03),
				}}
			>
				<Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
					Импорт технологий из внешних источников
				</Typography>
				<RemoteApiSearch onImportTechnology={addTechnology} />
			</Paper>
		</Container>
	);
}