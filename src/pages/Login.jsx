import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
	Box,
	Paper,
	TextField,
	Typography,
	Button,
	Stack,
	useTheme,
	alpha,
	Fade,
	InputAdornment,
	Divider,
} from "@mui/material";
import {
	Person as PersonIcon,
	Lock as LockIcon,
	Email as EmailIcon,
	RocketLaunch as RocketIcon,
} from "@mui/icons-material";

export default function Login() {
	const navigate = useNavigate();
	const theme = useTheme();
	const { login } = useAuth();
	
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!username.trim()) return;
		
		setLoading(true);
		
		// Имитация задержки для лучшего UX
		await new Promise(resolve => setTimeout(resolve, 800));
		
		login(username.trim());
		navigate("/");
	};
	
	const handleDemoLogin = () => {
		setUsername("Демо пользователь");
		login("Демо пользователь");
		navigate("/");
	};
	
	return (
		<Box
			sx={{
				minHeight: "calc(100vh - 200px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: { xs: 8, md: 8 },
				py: 8,
				px: 2,
				background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
			}}
		>
			<Fade in timeout={600}>
				<Box sx={{ width: "100%", maxWidth: 480 }}>
					{/* Логотип и заголовок */}
					<Box sx={{ textAlign: "center", mb: 4 }}>
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
							variant="h3"
							sx={{
								fontWeight: 800,
								mb: 1,
								background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent",
							}}
						>
							TechTracker
						</Typography>
						
						<Typography
							variant="body1"
							sx={{
								color: theme.palette.text.secondary,
								mb: 3,
							}}
						>
							Войдите в систему для управления вашими технологиями
						</Typography>
					</Box>
					
					{/* Форма */}
					<Paper
						elevation={0}
						sx={{
							p: { xs: 3, md: 4 },
							borderRadius: 3,
							border: `1px solid ${theme.palette.divider}`,
							bgcolor: theme.palette.background.paper,
							boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
						}}
					>
						<form onSubmit={handleSubmit}>
							<Stack spacing={3}>
								<Box>
									<Typography
										variant="subtitle1"
										sx={{
											fontWeight: 600,
											mb: 1,
											color: theme.palette.text.primary,
										}}
									>
										Имя пользователя
									</Typography>
									
									<TextField
										fullWidth
										placeholder="Введите ваше имя"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<PersonIcon sx={{ color: theme.palette.text.secondary }} />
												</InputAdornment>
											),
										}}
										sx={{
											"& .MuiOutlinedInput-root": {
												borderRadius: 2,
												"&:hover .MuiOutlinedInput-notchedOutline": {
													borderColor: theme.palette.primary.main,
												},
											},
										}}
									/>
									
									<Typography
										variant="caption"
										sx={{
											mt: 1,
											display: "block",
											color: theme.palette.text.secondary,
										}}
									>
										Это имя будет отображаться в вашем профиле
									</Typography>
								</Box>
								
								<Button
									type="submit"
									variant="contained"
									fullWidth
									disabled={!username.trim() || loading}
									size="large"
									sx={{
										borderRadius: 2,
										py: 1.5,
										fontSize: "1rem",
										fontWeight: 600,
										background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
										"&:hover": {
											transform: "translateY(-2px)",
											boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
										},
										"&.Mui-disabled": {
											background: theme.palette.grey[300],
										},
									}}
								>
									{loading ? (
										<>
											<Box
												component="span"
												sx={{
													width: 16,
													height: 16,
													border: `2px solid ${theme.palette.common.white}`,
													borderTop: `2px solid transparent`,
													borderRadius: "50%",
													animation: "spin 1s linear infinite",
													mr: 1.5,
													"@keyframes spin": {
														"0%": { transform: "rotate(0deg)" },
														"100%": { transform: "rotate(360deg)" },
													},
												}}
											/>
											Вход...
										</>
									) : (
										"Войти в систему"
									)}
								</Button>
								
								<Divider sx={{ my: 1 }}>
									<Typography
										variant="caption"
										sx={{
											color: theme.palette.text.secondary,
											px: 2,
										}}
									>
										или
									</Typography>
								</Divider>
								
								<Button
									variant="outlined"
									fullWidth
									onClick={handleDemoLogin}
									size="large"
									startIcon={<RocketIcon />}
									sx={{
										borderRadius: 2,
										py: 1.5,
										fontSize: "1rem",
										fontWeight: 600,
										borderWidth: 1.5,
										borderColor: alpha(theme.palette.primary.main, 0.5),
										color: theme.palette.primary.main,
										"&:hover": {
											borderColor: theme.palette.primary.main,
											bgcolor: alpha(theme.palette.primary.main, 0.08),
											transform: "translateY(-2px)",
											boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
										},
									}}
								>
									Попробовать демо-версию
								</Button>
							</Stack>
						</form>
						
						{/* Информация */}
						<Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
							<Stack spacing={2}>
								<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
									<Box
										sx={{
											width: 40,
											height: 40,
											borderRadius: "50%",
											bgcolor: alpha(theme.palette.success.main, 0.1),
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<LockIcon sx={{ fontSize: 20, color: theme.palette.success.main }} />
									</Box>
									<Box>
										<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
											Безопасный вход
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Данные хранятся локально в вашем браузере
										</Typography>
									</Box>
								</Box>
								
								<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
									<Box
										sx={{
											width: 40,
											height: 40,
											borderRadius: "50%",
											bgcolor: alpha(theme.palette.info.main, 0.1),
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<EmailIcon sx={{ fontSize: 20, color: theme.palette.info.main }} />
									</Box>
									<Box>
										<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
											Персональный профиль
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Ваш прогресс сохраняется под вашим именем
										</Typography>
									</Box>
								</Box>
							</Stack>
						</Box>
					</Paper>
					
					{/* Футер */}
					<Typography
						variant="caption"
						sx={{
							display: "block",
							textAlign: "center",
							mt: 4,
							color: theme.palette.text.disabled,
						}}
					>
						Войдя в систему, вы соглашаетесь с нашими условиями использования и политикой конфиденциальности
					</Typography>
				</Box>
			</Fade>
		</Box>
	);
}