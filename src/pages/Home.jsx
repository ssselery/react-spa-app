import {
	Box,
	Typography,
	Button,
	Paper,
	Stack,
	Container,
	Grid,
	Card,
	CardContent,
	useTheme,
	alpha,
	Fade,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
	RocketLaunch as RocketIcon,
	TrendingUp as TrendingIcon,
	Group as GroupIcon,
	School as SchoolIcon,
	AddCircle as AddCircleIcon,
	ListAlt as ListIcon,
	Insights as InsightsIcon,
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";
import useTechnologies from "../hooks/useTechnologies";

export default function Home() {
	const theme = useTheme();
	const { user } = useAuth();
	const { techList } = useTechnologies();
	
	const total = techList.length;
	const completed = techList.filter(t => t.status === "completed").length;
	const inProgress = techList.filter(t => t.status === "in-progress").length;
	const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
	
	const features = [
		{
			icon: <AddCircleIcon sx={{ fontSize: 40 }} />,
			title: "Добавляйте технологии",
			description: "Создайте свой стек технологий для изучения",
			color: theme.palette.primary.main,
		},
		{
			icon: <ListIcon sx={{ fontSize: 40 }} />,
			title: "Отслеживайте прогресс",
			description: "Отмечайте статус изучения каждой технологии",
			color: theme.palette.success.main,
		},
		{
			icon: <InsightsIcon sx={{ fontSize: 40 }} />,
			title: "Анализируйте статистику",
			description: "Смотрите графики и отчеты о вашем прогрессе",
			color: theme.palette.warning.main,
		},
		{
			icon: <GroupIcon sx={{ fontSize: 40 }} />,
			title: "Импортируйте из API",
			description: "Загружайте технологии из внешних источников",
			color: theme.palette.info.main,
		},
	];
	
	const quickActions = [
		{
			title: "Все технологии",
			description: "Просмотр и управление всем стеком",
			icon: <ListIcon />,
			to: "/technologies",
			color: theme.palette.primary.main,
		},
		{
			title: "Добавить новую",
			description: "Добавить технологию вручную или импортировать",
			icon: <AddCircleIcon />,
			to: "/add",
			color: theme.palette.success.main,
		},
		{
			title: "Статистика",
			description: "Анализ прогресса и достижений",
			icon: <InsightsIcon />,
			to: "/stats",
			color: theme.palette.warning.main,
		},
	];
	
	return (
		<Box sx={{ overflow: "hidden" }}>
			{/* Hero Section */}
			<Box
				sx={{
					pt: { xs: 8, md: 12 },
					pb: { xs: 6, md: 10 },
					background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
					position: "relative",
					overflow: "hidden",
					borderRadius: { xs: 8, md: 8 },
					mx: { xs: 2, sm: 3 },
					mt: 2,
					mb: 4,
				}}
			>
				<Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
					<Fade in timeout={800}>
						<Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto", px: { xs: 2, sm: 0 } }}>
							<Box
								sx={{
									width: 80,
									height: 80,
									borderRadius: "50%",
									bgcolor: alpha(theme.palette.primary.main, 0.1),
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									mx: "auto",
									mb: 3,
								}}
							>
								<RocketIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
							</Box>
							
							<Typography
								variant="h2"
								sx={{
									fontWeight: 800,
									mb: 2,
									background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
									fontSize: { xs: "2.5rem", md: "3.5rem" },
								}}
							>
								{user ? `Добро пожаловать, ${user.username}!` : "TechTracker Pro"}
							</Typography>
							
							<Typography
								variant="h5"
								sx={{
									fontWeight: 400,
									mb: 4,
									color: theme.palette.text.secondary,
									lineHeight: 1.6,
									fontSize: { xs: "1.25rem", md: "1.5rem" },
								}}
							>
								Управляйте своим профессиональным развитием. Отслеживайте прогресс,
								изучайте новые технологии и достигайте целей.
							</Typography>
							
							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={2}
								justifyContent="center"
								sx={{ mb: 6 }}
							>
								<Button
									component={Link}
									to={user ? "/technologies" : "/login"}
									variant="contained"
									size="large"
									startIcon={<RocketIcon />}
									sx={{
										borderRadius: 3,
										px: 4,
										py: 1.5,
										fontSize: "1rem",
										fontWeight: 600,
									}}
								>
									{user ? "Начать работу" : "Войти в систему"}
								</Button>
								
								<Button
									component={Link}
									to={user ? "/add" : "/login"}
									variant="outlined"
									size="large"
									startIcon={<AddCircleIcon />}
									sx={{
										borderRadius: 3,
										px: 4,
										py: 1.5,
										fontSize: "1rem",
										fontWeight: 600,
										borderWidth: 2,
									}}
								>
									{user ? "Добавить технологию" : "Зарегистрироваться"}
								</Button>
							</Stack>
						</Box>
					</Fade>
				</Container>
			</Box>
			
			{/* Stats Section */}
			<Container maxWidth="lg" sx={{ py: 6 }}>
				<Box sx={{ px: { xs: 2, sm: 3 }, mx: "auto", maxWidth: 1200 }}>
					<Typography
						variant="h4"
						sx={{
							fontWeight: 700,
							mb: 4,
							textAlign: "center",
							color: theme.palette.text.primary,
						}}
					>
						Ваша статистика
					</Typography>
					
					<Grid container spacing={3} sx={{ mb: 8, justifyContent: "center" }}>
						{[
							{ label: "Всего технологий", value: total, color: theme.palette.primary.main, icon: <SchoolIcon /> },
							{ label: "Изучено", value: completed, color: theme.palette.success.main, icon: <TrendingIcon /> },
							{ label: "В процессе", value: inProgress, color: theme.palette.warning.main, icon: <RocketIcon /> },
							{ label: "Не начато", value: total - completed - inProgress, color: theme.palette.grey[600], icon: <GroupIcon /> },
						].map((stat, index) => (
							<Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex", justifyContent: "center" }}>
								<Fade in timeout={800 + index * 100}>
									<Paper
										elevation={0}
										sx={{
											p: 3,
											borderRadius: 3,
											border: `1px solid ${alpha(stat.color, 0.2)}`,
											bgcolor: alpha(stat.color, 0.05),
											textAlign: "center",
											transition: "all 0.3s ease",
											width: "100%",
											maxWidth: 280,
											"&:hover": {
												transform: "translateY(-8px)",
												boxShadow: `0 12px 40px ${alpha(stat.color, 0.15)}`,
											},
										}}
									>
										<Box
											sx={{
												width: 60,
												height: 60,
												borderRadius: "50%",
												bgcolor: alpha(stat.color, 0.1),
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												mx: "auto",
												mb: 2,
											}}
										>
											<Box sx={{ color: stat.color }}>
												{stat.icon}
											</Box>
										</Box>
										
										<Typography
											variant="h3"
											sx={{
												fontWeight: 800,
												mb: 1,
												color: stat.color,
											}}
										>
											{stat.value}
										</Typography>
										
										<Typography
											variant="body1"
											sx={{
												fontWeight: 500,
												color: theme.palette.text.secondary,
											}}
										>
											{stat.label}
										</Typography>
										
										{stat.label === "Всего технологий" && total > 0 && (
											<Typography
												variant="caption"
												sx={{
													display: "block",
													mt: 1,
													color: theme.palette.text.disabled,
												}}
											>
												Прогресс: {progressPercentage}%
											</Typography>
										)}
									</Paper>
								</Fade>
							</Grid>
						))}
					</Grid>
					
					{/* Features Section */}
					<Typography
						variant="h4"
						sx={{
							fontWeight: 700,
							mb: 4,
							textAlign: "center",
							color: theme.palette.text.primary,
						}}
					>
						Возможности платформы
					</Typography>
					
					<Grid container spacing={4} sx={{ mb: 8, justifyContent: "center" }}>
						{features.map((feature, index) => (
							<Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex", justifyContent: "center" }}>
								<Fade in timeout={1000 + index * 100}>
									<Card
										elevation={0}
										sx={{
											height: "100%",
											borderRadius: 3,
											border: `1px solid ${alpha(feature.color, 0.2)}`,
											bgcolor: alpha(feature.color, 0.03),
											transition: "all 0.3s ease",
											width: "100%",
											maxWidth: 280,
											"&:hover": {
												transform: "translateY(-8px)",
												boxShadow: `0 16px 48px ${alpha(feature.color, 0.1)}`,
											},
										}}
									>
										<CardContent sx={{ p: 3, textAlign: "center" }}>
											<Box
												sx={{
													color: feature.color,
													mb: 2,
												}}
											>
												{feature.icon}
											</Box>
											
											<Typography
												variant="h6"
												sx={{
													fontWeight: 700,
													mb: 1,
													color: theme.palette.text.primary,
												}}
											>
												{feature.title}
											</Typography>
											
											<Typography
												variant="body2"
												sx={{
													color: theme.palette.text.secondary,
													lineHeight: 1.6,
												}}
											>
												{feature.description}
											</Typography>
										</CardContent>
									</Card>
								</Fade>
							</Grid>
						))}
					</Grid>
					
					{/* Quick Actions */}
					{user && (
						<>
							<Typography
								variant="h4"
								sx={{
									fontWeight: 700,
									mb: 4,
									textAlign: "center",
									color: theme.palette.text.primary,
								}}
							>
								Быстрые действия
							</Typography>
							
							<Grid container spacing={3} sx={{ mb: 6, justifyContent: "center" }}>
								{quickActions.map((action, index) => (
									<Grid item xs={12} md={4} key={index} sx={{ display: "flex", justifyContent: "center" }}>
										<Fade in timeout={1200 + index * 100}>
											<Paper
												component={Link}
												to={action.to}
												elevation={0}
												sx={{
													p: 3,
													borderRadius: 3,
													border: `1px solid ${alpha(action.color, 0.2)}`,
													bgcolor: alpha(action.color, 0.05),
													textDecoration: "none",
													color: "inherit",
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													textAlign: "center",
													transition: "all 0.3s ease",
													width: "100%",
													maxWidth: 320,
													"&:hover": {
														transform: "translateY(-4px)",
														borderColor: action.color,
														boxShadow: `0 12px 32px ${alpha(action.color, 0.15)}`,
													},
												}}
											>
												<Box
													sx={{
														width: 56,
														height: 56,
														borderRadius: "50%",
														bgcolor: alpha(action.color, 0.1),
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														mb: 2,
													}}
												>
													<Box sx={{ color: action.color }}>
														{action.icon}
													</Box>
												</Box>
												
												<Typography
													variant="h6"
													sx={{
														fontWeight: 700,
														mb: 1,
														color: theme.palette.text.primary,
													}}
												>
													{action.title}
												</Typography>
												
												<Typography
													variant="body2"
													sx={{
														color: theme.palette.text.secondary,
														mb: 2,
														lineHeight: 1.5,
													}}
												>
													{action.description}
												</Typography>
												
												<Button
													variant="outlined"
													size="small"
													sx={{
														borderRadius: 2,
														borderWidth: 1.5,
														borderColor: alpha(action.color, 0.5),
														color: action.color,
														"&:hover": {
															borderColor: action.color,
															bgcolor: alpha(action.color, 0.1),
														},
													}}
												>
													Перейти →
												</Button>
											</Paper>
										</Fade>
									</Grid>
								))}
							</Grid>
						</>
					)}
					
					{/* CTA Section */}
					<Fade in timeout={1500}>
						<Paper
							elevation={0}
							sx={{
								p: { xs: 4, md: 6 },
								borderRadius: 3,
								background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
								border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
								textAlign: "center",
								mx: "auto",
								maxWidth: 800,
							}}
						>
							<Typography
								variant="h4"
								sx={{
									fontWeight: 700,
									mb: 2,
									color: theme.palette.text.primary,
								}}
							>
								Готовы начать?
							</Typography>
							
							<Typography
								variant="body1"
								sx={{
									mb: 4,
									color: theme.palette.text.secondary,
									lineHeight: 1.7,
								}}
							>
								Присоединяйтесь к тысячам разработчиков, которые уже используют TechTracker
								для управления своим профессиональным развитием и достижения целей.
							</Typography>
							
							<Button
								component={Link}
								to={user ? "/add" : "/login"}
								variant="contained"
								size="large"
								startIcon={<AddCircleIcon />}
								sx={{
									borderRadius: 3,
									px: 5,
									py: 1.5,
									fontSize: "1rem",
									fontWeight: 600,
									background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
									"&:hover": {
										transform: "translateY(-2px)",
										boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
									},
								}}
							>
								{user ? "Добавить первую технологию" : "Начать бесплатно"}
							</Button>
						</Paper>
					</Fade>
				</Box>
			</Container>
		</Box>
	);
}