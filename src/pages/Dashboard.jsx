import React from "react";
import {
	Box,
	Typography,
	Paper,
	Button,
	Stack,
	useTheme,
	alpha,
	Grid,
	Chip,
	Card,
	CardContent,
	IconButton,
	LinearProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import useTechnologies from "../hooks/useTechnologies";
import { useAuth } from "../context/AuthContext";
import {
	TrendingUp,
	School,
	CheckCircle,
	Schedule,
	Add,
	List,
	BarChart,
	Category as CategoryIcon,
	Refresh,
	ArrowForward,
	Insights,
} from "@mui/icons-material";

// Recharts импорты
import {
	BarChart as RechartsBarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";

export default function Dashboard() {
	const theme = useTheme();
	const { user } = useAuth();
	const { techList, refreshTechnologies } = useTechnologies();
	
	const total = techList.length;
	const completed = techList.filter(t => t.status === "completed").length;
	const inProgress = techList.filter(t => t.status === "in-progress").length;
	const notStarted = techList.filter(t => t.status === "not-started").length;
	
	// Категории count
	const categories = techList.reduce((acc, t) => {
		if (!acc[t.category]) acc[t.category] = { total: 0, completed: 0 };
		acc[t.category].total++;
		if (t.status === "completed") acc[t.category].completed++;
		return acc;
	}, {});
	
	// Данные для столбчатой диаграммы по статусам
	const statusData = [
		{ name: "Завершено", value: completed, color: theme.palette.success.main },
		{ name: "В процессе", value: inProgress, color: theme.palette.warning.main },
		{ name: "Не начато", value: notStarted, color: theme.palette.grey[500] },
	];
	
	// Данные для круговой диаграммы по категориям
	const categoryPieData = Object.entries(categories).map(([name, data], index) => ({
		name: name.charAt(0).toUpperCase() + name.slice(1),
		value: data.total,
		completed: data.completed,
		color: [
			theme.palette.primary.main,
			theme.palette.secondary.main,
			theme.palette.success.main,
			theme.palette.warning.main,
			theme.palette.error.main,
			theme.palette.info.main,
		][index % 6],
	}));
	
	const lastAdded = [...techList].slice(-3).reverse();
	const completionPercentage = total ? Math.round((completed / total) * 100) : 0;
	
	const quickActions = [
		{ to: "/add", label: "Добавить технологию", icon: <Add />, color: "primary" },
		{ to: "/technologies", label: "К списку технологий", icon: <List />, color: "secondary" },
		{ to: "/technologies", label: "Аналитика обучения", icon: <Insights />, color: "info" },
	];
	
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<Paper sx={{ p: 1.5, border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
					<Typography variant="body2" fontWeight={600}>{label}</Typography>
					{payload.map((entry, index) => (
						<Typography key={index} variant="body2" sx={{ color: entry.color }}>
							{entry.name}: {entry.value}
						</Typography>
					))}
				</Paper>
			);
		}
		return null;
	};
	
	return (
		<Box sx={{
			py: { xs: 3, md: 4 },
			px: { xs: 2, sm: 3, md: 4 },
			minHeight: "calc(100vh - 64px)",
			background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
			display: "flex",
			justifyContent: "center",
			alignItems: "flex-start",
		}}>
			<Box sx={{
				width: "100%",
				maxWidth: 1400,
			}}>
				
				{/* HEADER */}
				<Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} sx={{ mb: 4 }}>
					<Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							Привет, {user?.username || "пользователь"} 👋
						</Typography>
						<Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.1rem" }}>
							Ваше персональное рабочее пространство
						</Typography>
					</Box>
					<Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-end" }, width: { xs: "100%", sm: "auto" } }}>
						<Button
							variant="outlined"
							startIcon={<Refresh />}
							onClick={refreshTechnologies}
							sx={{
								borderRadius: 2,
								borderColor: alpha(theme.palette.primary.main, 0.3),
								color: theme.palette.primary.main,
								"&:hover": {
									borderColor: theme.palette.primary.main,
									backgroundColor: alpha(theme.palette.primary.main, 0.05),
									transform: "translateY(-1px)",
								},
								transition: "all 0.2s ease",
								cursor: "pointer",
							}}
						>
							Обновить данные
						</Button>
					</Box>
				</Stack>
				
				{/* STATS CARDS - ЦЕНТРИРОВАНЫ */}
				<Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
					<Grid container spacing={3} sx={{ maxWidth: 1200 }}>
						{[{
							title: "Завершено",
							value: completed,
							total: total,
							icon: <CheckCircle />,
							color: "success",
							description: "из технологий"
						}, {
							title: "В процессе",
							value: inProgress,
							icon: <Schedule />,
							color: "warning",
							description: "активно изучаются"
						}, {
							title: "Общий прогресс",
							value: `${completionPercentage}%`,
							icon: <TrendingUp />,
							color: "info",
							description: "успеваемость"
						}, {
							title: "Всего технологий",
							value: total,
							icon: <School />,
							color: "primary",
							description: "в коллекции"
						}].map((stat, index) => (
							<Grid item xs={12} sm={6} lg={3} key={index}>
								<Card
									sx={{
										borderRadius: 3,
										border: `1px solid ${alpha(theme.palette[stat.color].main, 0.15)}`,
										background: `linear-gradient(135deg, ${alpha(theme.palette[stat.color].main, 0.05)} 0%, ${alpha(theme.palette[stat.color].main, 0.02)} 100%)`,
										height: "100%",
										transition: "all 0.3s ease",
										"&:hover": {
											transform: "translateY(-4px)",
											boxShadow: `0 12px 40px ${alpha(theme.palette[stat.color].main, 0.15)}`,
										}
									}}
								>
									<CardContent sx={{ p: 3, textAlign: "center" }}>
										<Box sx={{
											width: 56,
											height: 56,
											borderRadius: "16px",
											bgcolor: alpha(theme.palette[stat.color].main, 0.15),
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											margin: "0 auto 16px",
										}}>
											{React.cloneElement(stat.icon, {
												sx: { fontSize: 28, color: theme.palette[stat.color].main }
											})}
										</Box>
										<Typography variant="h3" sx={{ fontWeight: 800, color: theme.palette[stat.color].dark, mb: 0.5 }}>
											{stat.value}
										</Typography>
										<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 0.5 }}>
											{stat.title}
										</Typography>
										{stat.total && (
											<Typography variant="caption" color="text.secondary">
												из {stat.total} технологий
											</Typography>
										)}
										{!stat.total && stat.description && (
											<Typography variant="caption" color="text.secondary">
												{stat.description}
											</Typography>
										)}
										{stat.color === "info" && (
											<Box sx={{ mt: 2 }}>
												<LinearProgress
													variant="determinate"
													value={completionPercentage}
													sx={{
														height: 6,
														borderRadius: 3,
														bgcolor: alpha(theme.palette.info.main, 0.1),
														"& .MuiLinearProgress-bar": {
															bgcolor: theme.palette.info.main,
															borderRadius: 3,
														}
													}}
												/>
											</Box>
										)}
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Box>
				
				{/* QUICK ACTIONS */}
				<Box sx={{ mb: 4, textAlign: "center" }}>
					<Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
						Быстрые действия
					</Typography>
					<Box sx={{ display: "flex", justifyContent: "center" }}>
						<Grid container spacing={2} sx={{ maxWidth: 800 }}>
							{quickActions.map((action, index) => (
								<Grid item xs={12} sm={4} key={index}>
									<Button
										component={Link}
										to={action.to}
										fullWidth
										variant="outlined"
										startIcon={action.icon}
										sx={{
											p: 2.5,
											borderRadius: 3,
											borderColor: alpha(theme.palette[action.color].main, 0.3),
											color: theme.palette[action.color].main,
											backgroundColor: alpha(theme.palette[action.color].main, 0.05),
											textTransform: "none",
											fontWeight: 500,
											"&:hover": {
												borderColor: theme.palette[action.color].main,
												backgroundColor: alpha(theme.palette[action.color].main, 0.1),
												transform: "translateY(-2px)",
												boxShadow: `0 8px 20px ${alpha(theme.palette[action.color].main, 0.2)}`,
											},
											transition: "all 0.3s ease",
											cursor: "pointer",
										}}
									>
										{action.label}
									</Button>
								</Grid>
							))}
						</Grid>
					</Box>
				</Box>
				
				{/* CHARTS SECTION - ЦЕНТРИРОВАНЫ И ШИРЕ */}
				<Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
					<Grid container spacing={3} sx={{ maxWidth: 1400 }}>
						{/* Status Bar Chart */}
						<Grid item xs={12} lg={8}>
							<Card sx={{ borderRadius: 3, height: "100%" }}>
								<CardContent sx={{ p: 3 }}>
									<Typography variant="h6" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
										Распределение по статусам
									</Typography>
									<Box sx={{ width: "100%", height: 300 }}>
										<ResponsiveContainer>
											<RechartsBarChart
												data={statusData}
												margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
											>
												<CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
												<XAxis
													dataKey="name"
													stroke={theme.palette.text.secondary}
												/>
												<YAxis
													stroke={theme.palette.text.secondary}
												/>
												<RechartsTooltip
													content={<CustomTooltip />}
												/>
												<Legend />
												<Bar
													dataKey="value"
													name="Количество технологий"
													radius={[8, 8, 0, 0]}
												>
													{statusData.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={entry.color} />
													))}
												</Bar>
											</RechartsBarChart>
										</ResponsiveContainer>
									</Box>
								</CardContent>
							</Card>
						</Grid>
						
						{/* Category Pie Chart */}
						<Grid item xs={12} lg={4}>
							<Card sx={{ borderRadius: 3, height: "100%" }}>
								<CardContent sx={{ p: 3 }}>
									<Typography variant="h6" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
										Распределение по категориям
									</Typography>
									<Box sx={{ width: "100%", height: 300 }}>
										<ResponsiveContainer>
											<PieChart>
												<Pie
													data={categoryPieData}
													cx="50%"
													cy="50%"
													labelLine={false}
													label={(entry) => `${entry.name}: ${entry.value}`}
													outerRadius={80}
													fill="#8884d8"
													dataKey="value"
												>
													{categoryPieData.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={entry.color} />
													))}
												</Pie>
												<RechartsTooltip
													formatter={(value, name, props) => [
														value,
														`${props.payload.name} (${props.payload.completed} завершено)`
													]}
												/>
											</PieChart>
										</ResponsiveContainer>
									</Box>
									<Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2, justifyContent: "center" }}>
										{categoryPieData.map((category, index) => (
											<Chip
												key={index}
												label={`${category.name}: ${category.value}`}
												size="small"
												sx={{
													bgcolor: alpha(category.color, 0.1),
													color: category.color,
													fontWeight: 500,
													border: `1px solid ${alpha(category.color, 0.3)}`,
												}}
											/>
										))}
									</Stack>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Box>
				
				{/* RECENTLY ADDED - ОДИНАКОВОГО РАЗМЕРА */}
				<Box sx={{ mb: 4, textAlign: "center" }}>
					<Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
						Последние добавленные технологии
					</Typography>
					<Box sx={{
						display: "flex",
						justifyContent: "center",
						gap: 3,
						flexWrap: "wrap",
					}}>
						{lastAdded.length > 0 ? (
							lastAdded.map((tech) => (
								<Box key={tech.id} sx={{
									width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(33.333% - 16px)" },
									maxWidth: "320px",
									minWidth: "240px",
								}}>
									<Card
										sx={{
											borderRadius: 3,
											border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
											background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
											height: "100%",
											display: "flex",
											flexDirection: "column",
											transition: "all 0.3s ease",
											"&:hover": {
												transform: "translateY(-4px)",
												boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
											}
										}}
									>
										<CardContent sx={{
											p: 3,
											textAlign: "center",
											flexGrow: 1,
											display: "flex",
											flexDirection: "column",
											justifyContent: "space-between",
										}}>
											<Box>
												<Box sx={{
													width: 48,
													height: 48,
													borderRadius: "12px",
													bgcolor: alpha(theme.palette.primary.main, 0.1),
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													margin: "0 auto 16px",
												}}>
													<CategoryIcon sx={{ color: theme.palette.primary.main }} />
												</Box>
												<Typography variant="h6" sx={{
													fontWeight: 700,
													mb: 1,
													minHeight: "56px",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													overflow: "hidden",
													lineHeight: 1.3,
												}}>
													{tech.title}
												</Typography>
												<Typography variant="body2" color="text.secondary" sx={{
													mb: 2,
													minHeight: "60px",
													maxHeight: "60px",
													overflow: "hidden",
													textOverflow: "ellipsis",
													display: "-webkit-box",
													WebkitLineClamp: 3,
													WebkitBoxOrient: "vertical",
													lineHeight: 1.4,
												}}>
													{tech.description || "Описание отсутствует"}
												</Typography>
												<Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
													<Chip
														label={tech.category || "без категории"}
														size="small"
														variant="outlined"
														sx={{
															borderColor: alpha(theme.palette.primary.main, 0.3),
															color: theme.palette.primary.main,
														}}
													/>
													<Chip
														label={tech.status === "completed" ? "Завершено" :
															tech.status === "in-progress" ? "В процессе" : "Не начато"}
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
												endIcon={<ArrowForward />}
												sx={{
													borderRadius: 2,
													borderColor: alpha(theme.palette.primary.main, 0.3),
													color: theme.palette.primary.main,
													"&:hover": {
														borderColor: theme.palette.primary.main,
														backgroundColor: alpha(theme.palette.primary.main, 0.05),
													},
													cursor: "pointer",
												}}
											>
												Подробнее
											</Button>
										</CardContent>
									</Card>
								</Box>
							))
						) : (
							<Paper
								variant="outlined"
								sx={{
									p: 4,
									textAlign: "center",
									borderRadius: 3,
									borderColor: alpha(theme.palette.divider, 0.5),
									backgroundColor: alpha(theme.palette.background.paper, 0.5),
									width: "100%",
									maxWidth: "600px",
								}}
							>
								<Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
									Технологии еще не добавлены
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Добавьте первую технологию, чтобы начать обучение
								</Typography>
							</Paper>
						)}
					</Box>
				</Box>
			</Box>
		</Box>
	);
}