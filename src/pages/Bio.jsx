import {
	Box,
	Typography,
	Paper,
	Avatar,
	useTheme,
	alpha,
	Button,
	Stack,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { Edit, Construction, Settings, Dashboard } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function Bio() {
	const { user } = useAuth();
	const theme = useTheme();
	
	return (
		<Box sx={{
			py: { xs: 3, md: 4 },
			px: { xs: 2, sm: 3, md: 4 },
			minHeight: "calc(100vh - 64px)",
			background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		}}>
			<Box sx={{
				width: "100%",
				maxWidth: 800,
				textAlign: "center",
			}}>
				
				{/* CONSTRUCTION ICON */}
				<Box sx={{
					width: 120,
					height: 120,
					borderRadius: "50%",
					bgcolor: alpha(theme.palette.warning.main, 0.1),
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: "0 auto 24px",
					border: `3px dashed ${alpha(theme.palette.warning.main, 0.3)}`,
				}}>
					<Construction sx={{
						fontSize: 60,
						color: theme.palette.warning.main
					}} />
				</Box>
				
				{/* HEADER */}
				<Typography variant="h3" sx={{
					fontWeight: 800,
					mb: 2,
					background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
				}}>
					{user?.username || "Пользователь"}
				</Typography>
				
				<Typography variant="h6" sx={{
					color: "text.secondary",
					mb: 3,
					maxWidth: 600,
					margin: "0 auto",
				}}>
					Страница профиля в разработке
				</Typography>
				
				{/* INFO CARD */}
				<Paper
					variant="outlined"
					sx={{
						p: 4,
						borderRadius: 3,
						mb: 4,
						background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
						borderColor: alpha(theme.palette.primary.main, 0.15),
					}}
				>
					<Avatar
						sx={{
							width: 100,
							height: 100,
							fontSize: 40,
							bgcolor: theme.palette.primary.main,
							border: `4px solid ${alpha(theme.palette.background.paper, 0.8)}`,
							boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
							margin: "0 auto 16px",
						}}
					>
						{user?.username?.[0]?.toUpperCase() || "U"}
					</Avatar>
					
					<Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
						Мы работаем над созданием полноценного профиля с статистикой,
						достижениями и персонализацией. Ожидайте обновления в ближайшее время!
					</Typography>
					
					<Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
						<Button
							component={Link}
							to="/account"
							variant="contained"
							startIcon={<Dashboard />}
							sx={{
								borderRadius: 2,
								px: 3,
								fontWeight: 600,
								background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.secondary.main, 0.9)})`,
								boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
								"&:hover": {
									transform: "translateY(-2px)",
									boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
								},
								transition: "all 0.3s ease",
								cursor: "pointer",
							}}
						>
							Перейти в дашборд
						</Button>
						
						<Button
							component={Link}
							to="/settings"
							variant="outlined"
							startIcon={<Settings />}
							sx={{
								borderRadius: 2,
								px: 3,
								fontWeight: 600,
								borderColor: alpha(theme.palette.primary.main, 0.3),
								color: theme.palette.primary.main,
								"&:hover": {
									borderColor: theme.palette.primary.main,
									backgroundColor: alpha(theme.palette.primary.main, 0.05),
									transform: "translateY(-2px)",
								},
								transition: "all 0.3s ease",
								cursor: "pointer",
							}}
						>
							Настройки
						</Button>
					</Stack>
				</Paper>
				
				{/* FEATURES COMING SOON */}
				<Box sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
					gap: 2,
					mb: 4
				}}>
					{[
						{
							title: "Статистика обучения",
							description: "Графики прогресса и достижения",
							color: "primary"
						},
						{
							title: "Персонализация",
							description: "Настройка темы и аватара",
							color: "secondary"
						},
						{
							title: "Достижения",
							description: "Бейджи и награды за прогресс",
							color: "success"
						}
					].map((feature, index) => (
						<Paper
							key={index}
							variant="outlined"
							sx={{
								p: 2,
								borderRadius: 2,
								borderColor: alpha(theme.palette[feature.color].main, 0.2),
								backgroundColor: alpha(theme.palette[feature.color].main, 0.05),
								textAlign: "center",
								transition: "all 0.2s ease",
								"&:hover": {
									transform: "translateY(-2px)",
									boxShadow: `0 4px 12px ${alpha(theme.palette[feature.color].main, 0.1)}`,
								}
							}}
						>
							<Typography variant="subtitle1" sx={{
								fontWeight: 600,
								color: theme.palette[feature.color].main,
								mb: 1
							}}>
								{feature.title}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{feature.description}
							</Typography>
						</Paper>
					))}
				</Box>
				
				{/* FOOTER NOTE */}
				<Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
					Страница будет обновлена в следующем релизе. Спасибо за понимание! 🚀
				</Typography>
			</Box>
		</Box>
	);
}