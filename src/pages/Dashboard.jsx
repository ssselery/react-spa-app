import {
	Box,
	Typography,
	Paper,
	Button,
	Stack,
	useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import useTechnologies from "../hooks/useTechnologies";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
	const theme = useTheme();
	const { user } = useAuth();
	const { techList } = useTechnologies();
	
	const total = techList.length;
	const completed = techList.filter(t => t.status === "completed").length;
	const inProgress = techList.filter(t => t.status === "in-progress").length;
	const notStarted = techList.filter(t => t.status === "not-started").length;
	
	// categories count
	const categories = techList.reduce((acc, t) => {
		if (!acc[t.category]) acc[t.category] = 0;
		acc[t.category]++;
		return acc;
	}, {});
	
	const lastAdded = [...techList].slice(-3).reverse();
	
	const colorPalette = [
		theme.palette.primary.main,
		theme.palette.secondary.main,
		theme.palette.success.main,
		theme.palette.warning.main,
		theme.palette.error.main,
	];
	
	return (
		<Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
			<Box sx={{ width: "100%", maxWidth: 1100 }}>
				
				{/* HEADER */}
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
					Привет, {user?.username || "пользователь"} 👋
				</Typography>
				
				<Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
					Ваше персональное рабочее пространство.
				</Typography>
				
				{/* TOP GRID */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
						gap: 3,
						mb: 5,
					}}
				>
					
					{/* PROGRESS */}
					<Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
							Прогресс обучения
						</Typography>
						
						<Typography variant="body2" sx={{ mb: 1 }}>
							Изучено: {completed} / {total}
						</Typography>
						
						<Box
							sx={{
								height: 6,
								borderRadius: 10,
								overflow: "hidden",
								bgcolor: "divider",
								mb: 1,
							}}
						>
							<Box
								sx={{
									width: total ? `${(completed / total) * 100}%` : "0%",
									height: "100%",
									bgcolor: theme.palette.success.main,
								}}
							/>
						</Box>
						
						<Typography variant="body2" sx={{ color: "text.secondary" }}>
							Текущий прогресс: {total ? Math.round((completed / total) * 100) : 0}%
						</Typography>
					</Paper>
					
					{/* QUICK ACTIONS */}
					<Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
							Быстрые действия
						</Typography>
						
						<Stack spacing={1.2}>
							{[
								{ to: "/add", label: "Добавить технологию" },
								{ to: "/technologies", label: "К списку технологий" },
								{ to: "/stats", label: "Перейти к статистике" },
							].map((b) => (
								<Button
									key={b.to}
									component={Link}
									to={b.to}
									variant="outlined"
									size="small"
									sx={{
										textTransform: "none",
										borderRadius: "10px",
										color: theme.palette.text.primary,
										borderColor: theme.palette.divider,
										"&:hover": {
											borderColor: theme.palette.text.secondary,
											backgroundColor:
												theme.palette.mode === "light"
													? "#fafafa"
													: "rgba(255,255,255,0.06)",
										},
									}}
								>
									{b.label}
								</Button>
							))}
						</Stack>
					</Paper>
					
					{/* ACTIVE LEARNING */}
					<Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
							Активное обучение
						</Typography>
						
						<Typography variant="body2" sx={{ color: "text.secondary" }}>
							{inProgress === 0
								? "Вы пока ничего не изучаете."
								: `Технологий в процессе: ${inProgress}`}
						</Typography>
					</Paper>
				</Box>
				
				{/* GRAPHICS SECTION */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
						gap: 3,
						mb: 6,
					}}
				>
					
					{/* CATEGORY GRAPH */}
					<Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
							Завершено по категориям
						</Typography>
						
						{Object.keys(categories).length === 0 && (
							<Typography variant="body2" color="text.secondary">
								Нет данных
							</Typography>
						)}
						
						{Object.entries(categories).map(([cat, count], i) => (
							<Box key={cat} sx={{ mb: 1 }}>
								<Typography variant="body2">{cat}</Typography>
								
								<Box
									sx={{
										height: 8,
										borderRadius: 10,
										bgcolor: "divider",
										overflow: "hidden",
									}}
								>
									<Box
										sx={{
											width: `${(count / total) * 100}%`,
											height: "100%",
											bgcolor: colorPalette[i % colorPalette.length],
										}}
									/>
								</Box>
							</Box>
						))}
					</Paper>
					
					{/* STATUS GRAPH */}
					<Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
							Распределение статусов
						</Typography>
						
						{[
							{ label: "Завершено", value: completed, color: theme.palette.success.main },
							{ label: "В процессе", value: inProgress, color: theme.palette.info.main },
							{ label: "Не начато", value: notStarted, color: theme.palette.grey[500] },
						].map((stat, idx) => (
							<Box key={idx} sx={{ mb: 1 }}>
								<Typography variant="body2">
									{stat.label} — {stat.value}
								</Typography>
								
								<Box
									sx={{
										height: 8,
										borderRadius: 10,
										bgcolor: "divider",
										overflow: "hidden",
									}}
								>
									<Box
										sx={{
											width: total ? `${(stat.value / total) * 100}%` : "0%",
											height: "100%",
											bgcolor: stat.color,
										}}
									/>
								</Box>
							</Box>
						))}
					</Paper>
				</Box>
				
				{/* LAST ADDED */}
				<Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
					Последние добавленные технологии
				</Typography>
				
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
						gap: 3,
					}}
				>
					{lastAdded.map(tech => (
						<Paper key={tech.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
							<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
								{tech.title}
							</Typography>
							
							<Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
								{tech.description}
							</Typography>
							
							<Typography
								variant="caption"
								sx={{
									px: 1,
									py: 0.5,
									bgcolor: "divider",
									borderRadius: 2,
								}}
							>
								{tech.category || "без категории"}
							</Typography>
						</Paper>
					))}
				</Box>
			</Box>
		</Box>
	);
}
