import {
	Box,
	Typography,
	Paper,
	TextField,
	Button,
	MenuItem,
	Stack,
	IconButton,
	Divider,
	useTheme,
	alpha,
	Grid,
	Card,
	CardContent,
	CardHeader,
	Alert,
	LinearProgress,
	InputAdornment,
	Chip,
	Fade,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RefreshIcon from "@mui/icons-material/Refresh";
import LinkIcon from "@mui/icons-material/Link";
import CategoryIcon from "@mui/icons-material/Category";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import CodeIcon from "@mui/icons-material/Code";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

import useTechnologies from "../hooks/useTechnologies";
import useTechnologiesApi from "../hooks/useTechnologiesApi";

export default function AddTechnology() {
	const theme = useTheme();
	const navigate = useNavigate();
	
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	
	const { addTechnology, techList } = useTechnologies();
	const {
		loading: apiLoading,
		error: apiError,
		refetch: refetchApi,
		addTechnology: addTechnologyViaApi,
	} = useTechnologiesApi();
	
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "frontend",
		difficulty: "beginner",
		deadline: "",
		resources: [""],
	});
	
	const [errors, setErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	
	const { addNotification } = useNotifications();
	
	// ----- Валидация -----
	const validateForm = () => {
		const newErrors = {};
		
		// Название
		if (!formData.title.trim()) newErrors.title = "Название обязательно";
		else if (formData.title.trim().length < 2)
			newErrors.title = "Минимум 2 символа";
		else if (formData.title.trim().length > 50)
			newErrors.title = "Не более 50 символов";
		
		// Описание
		if (!formData.description.trim())
			newErrors.description = "Описание обязательно";
		else if (formData.description.trim().length < 10)
			newErrors.description = "Минимум 10 символов";
		
		// Дедлайн
		if (formData.deadline) {
			const date = new Date(formData.deadline);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			if (date < today) newErrors.deadline = "Дата не может быть в прошлом";
		}
		
		// Ресурсы
		formData.resources.forEach((r, i) => {
			if (r.trim()) {
				try {
					new URL(r);
				} catch {
					newErrors[`resource_${i}`] = "Некорректный URL";
				}
			}
		});
		
		setErrors(newErrors);
		setIsFormValid(Object.keys(newErrors).length === 0);
	};
	
	useEffect(() => {
		validateForm();
	}, [formData]);
	
	// ----- Обработчики -----
	const handleChange = (e) => {
		setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
	};
	
	const handleResourceChange = (i, value) => {
		const arr = [...formData.resources];
		arr[i] = value;
		setFormData((p) => ({ ...p, resources: arr }));
	};
	
	const addResourceField = () => {
		setFormData((p) => ({ ...p, resources: [...p.resources, ""] }));
	};
	
	const removeResourceField = (i) => {
		if (formData.resources.length === 1) return;
		setFormData((p) => ({
			...p,
			resources: p.resources.filter((_, idx) => idx !== i),
		}));
	};
	
	const handleSubmitManual = async (e) => {
		e.preventDefault();
		if (!isFormValid) return;
		
		setSubmitting(true);
		setIsSubmitting(true);
		
		try {
			const nextId =
				techList.length > 0
					? Math.max(...techList.map((t) => Number(t.id) || 0)) + 1
					: 1;
			
			const newTech = {
				...formData,
				id: nextId,
				resources: formData.resources.filter((x) => x.trim() !== ""),
				createdAt: new Date().toISOString().split("T")[0],
				status: "not-started",
				notes: "",
				source: "",
			};
			
			addTechnology(newTech);
			
			setSubmitSuccess(true);
			addNotification(
				"Технология добавлена",
				`Вы добавили технологию: ${formData.title}`,
				"success"
			);
			
			// Сброс формы
			setFormData({
				title: "",
				description: "",
				category: "frontend",
				difficulty: "beginner",
				deadline: "",
				resources: [""],
			});
			
			setTimeout(() => {
				setSubmitSuccess(false);
				setIsSubmitting(false);
			}, 3000);
			
			// Переход через 1 секунду
			setTimeout(() => {
				navigate("/technologies");
			}, 1000);
			
		} catch (error) {
			console.error("Ошибка добавления:", error);
			addNotification(
				"Ошибка добавления",
				"Не удалось добавить технологию",
				"error"
			);
		} finally {
			setSubmitting(false);
		}
	};
	
	// ===== ИМПОРТ API =====
	const [importUrl, setImportUrl] = useState(
		"https://raw.githubusercontent.com/ssselery/react-spa-app/refs/heads/main/ApiTest/roadmap-frontend.json"
	);
	const [importing, setImporting] = useState(false);
	const [importMessage, setImportMessage] = useState("");
	
	const handleImportRoadmap = async (e) => {
		e.preventDefault();
		try {
			setImporting(true);
			setImportMessage("");
			
			const res = await fetch(importUrl.trim());
			if (!res.ok) throw new Error("Ошибка HTTP " + res.status);
			
			const data = await res.json();
			const arr = Array.isArray(data)
				? data
				: Array.isArray(data.technologies)
					? data.technologies
					: null;
			
			if (!arr) throw new Error("Неверный формат JSON");
			
			let maxId =
				techList.length > 0
					? Math.max(...techList.map((t) => Number(t.id) || 0))
					: 0;
			
			let count = 0;
			
			for (const item of arr) {
				maxId += 1;
				
				await addTechnologyViaApi(item);
				
				addTechnology({
					id: maxId,
					title: item.title || "Без названия",
					description: item.description || "",
					category: item.category || "",
					createdAt: new Date().toISOString().split("T")[0],
					notes: "",
					status: "not-started",
					source:
						Array.isArray(item.resources) && item.resources[0]
							? item.resources[0]
							: "",
				});
				
				count++;
			}
			
			const msg = `Импортировано: ${count} технологий`;
			setImportMessage(msg);
			
			addNotification("Импорт дорожной карты", msg, "success");
			
			// Очистка URL
			setImportUrl("");
			
		} catch (err) {
			const msg = "Ошибка импорта: " + err.message;
			setImportMessage(msg);
			
			addNotification("Ошибка импорта дорожной карты", msg, "error");
		} finally {
			setImporting(false);
		}
	};
	
	// Локальный импорт JSON
	const handleFileImport = (event) => {
		const file = event.target.files[0];
		if (!file) return;
		
		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				const data = JSON.parse(ev.target.result);
				
				if (!Array.isArray(data)) {
					addNotification("Ошибка импорта", "JSON должен содержать массив объектов", "error");
					return;
				}
				
				let maxId =
					techList.length > 0
						? Math.max(...techList.map((t) => Number(t.id) || 0))
						: 0;
				
				let count = 0;
				
				data.forEach((item) => {
					maxId++;
					
					addTechnology({
						id: maxId,
						title: item.title || "Без названия",
						description: item.description || "",
						category: item.category || "",
						createdAt: new Date().toISOString().split("T")[0],
						status: "not-started",
						notes: "",
						source: item.source || "",
					});
					
					count++;
				});
				
				addNotification("Импорт выполнен", `Импортировано: ${count} технологий`, "success");
				setImportMessage(`Импортировано из файла: ${count} технологий`);
				
			} catch {
				addNotification("Ошибка импорта", "Ошибка чтения JSON файла", "error");
			}
		};
		
		reader.readAsText(file);
		event.target.value = "";
	};
	
	// Локальный экспорт JSON
	const handleExportToJson = () => {
		try {
			const json = JSON.stringify(techList, null, 2);
			const blob = new Blob([json], {
				type: "application/json",
			});
			const url = URL.createObjectURL(blob);
			
			const a = document.createElement("a");
			a.href = url;
			a.download = `technologies_${new Date().toISOString().split('T')[0]}.json`;
			a.click();
			
			URL.revokeObjectURL(url);
			
			addNotification("Экспорт выполнен", "Данные экспортированы в JSON", "success");
		} catch (error) {
			addNotification("Ошибка экспорта", "Не удалось экспортировать данные", "error");
		}
	};
	
	const categories = [
		{ value: "frontend", label: "Frontend", icon: <CodeIcon /> },
		{ value: "backend", label: "Backend", icon: <CategoryIcon /> },
		{ value: "database", label: "Database", icon: <DescriptionIcon /> },
		{ value: "devops", label: "DevOps", icon: <CloudUploadIcon /> },
		{ value: "other", label: "Другое", icon: <CategoryIcon /> },
	];
	
	const difficulties = [
		{ value: "beginner", label: "Начальный", color: "success" },
		{ value: "intermediate", label: "Средний", color: "warning" },
		{ value: "advanced", label: "Продвинутый", color: "error" },
	];
	
	return (
		<Box sx={{
			py: { xs: 3, md: 4 },
			px: { xs: 2, sm: 3, md: 4 },
			minHeight: "calc(100vh - 64px)",
			background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.03)} 0%, ${alpha(theme.palette.secondary.light, 0.03)} 100%)`,
		}}>
			<Box sx={{ maxWidth: 1400, mx: "auto" }}>
				{/* Заголовок */}
				<Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 5 }}>
					<Box
						sx={{
							width: 64,
							height: 64,
							borderRadius: "20px",
							bgcolor: alpha(theme.palette.primary.main, 0.1),
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
						}}
					>
						<AddIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
					</Box>
					<Box>
						<Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
							Добавить технологию
						</Typography>
						<Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem" }}>
							Создайте новую технологию или импортируйте из внешних источников
						</Typography>
					</Box>
				</Stack>
				
				<Box
					role="status"
					aria-live="polite"
					aria-atomic="true"
					sx={{
						position: "absolute",
						width: "1px",
						height: "1px",
						padding: "0",
						margin: "-1px",
						overflow: "hidden",
						clip: "rect(0, 0, 0, 0)",
						whiteSpace: "nowrap",
						border: "0",
					}}
				>
					{isSubmitting && 'Отправка формы...'}
					{submitSuccess && 'Форма успешно отправлена!'}
				</Box>
				
				{/* Прогресс при отправке */}
				{submitting && (
					<Fade in={submitting}>
						<Box sx={{ mb: 4, borderRadius: 3, overflow: "hidden", boxShadow: 1 }}>
							<LinearProgress
								sx={{
									height: 8,
									bgcolor: alpha(theme.palette.primary.main, 0.1),
									"& .MuiLinearProgress-bar": {
										bgcolor: theme.palette.primary.main,
									}
								}}
							/>
							<Box sx={{ p: 2, textAlign: "center", bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
								<Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
									Добавление технологии...
								</Typography>
							</Box>
						</Box>
					</Fade>
				)}
				
				{/* Основной контент */}
				<Box sx={{
					display: "flex",
					flexDirection: { xs: "column", lg: "row" },
					gap: 4,
				}}>
					{/* Левая колонка: Ручное добавление */}
					<Box sx={{ flex: 1 }}>
						<Card
							elevation={0}
							sx={{
								borderRadius: 3,
								border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
								background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
								height: "100%",
								transition: "all 0.3s ease",
								"&:hover": {
									boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
									borderColor: alpha(theme.palette.primary.main, 0.3),
								}
							}}
						>
							<CardHeader
								title={
									<Stack direction="row" alignItems="center" spacing={1.5}>
										<Box sx={{
											width: 40,
											height: 40,
											borderRadius: "12px",
											bgcolor: alpha(theme.palette.primary.main, 0.1),
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}>
											<SchoolIcon sx={{ color: theme.palette.primary.main, fontSize: 22 }} />
										</Box>
										<Box>
											<Typography variant="h6" sx={{ fontWeight: 700 }}>
												Ручное добавление
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Заполните форму для добавления новой технологии
											</Typography>
										</Box>
									</Stack>
								}
								sx={{
									pb: 1,
									borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
								}}
							/>
							
							<CardContent sx={{ pt: 3 }}>
								<form onSubmit={handleSubmitManual}>
									<Stack spacing={3}>
										{/* Название */}
										<TextField
											label="Название технологии"
											name="title"
											value={formData.title}
											onChange={handleChange}
											error={!!errors.title}
											helperText={errors.title}
											required
											fullWidth
											
											aria-required="true"
											aria-invalid={!!errors.title}
											aria-describedby={errors.title ? "title-error" : undefined}
											
											variant="outlined"
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<CodeIcon sx={{ color: alpha(theme.palette.text.primary, 0.6) }} />
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
												"& .MuiInputLabel-root": {
													fontWeight: 500,
												}
											}}
										/>
										
										{/* Описание */}
										<TextField
											label="Описание технологии"
											name="description"
											multiline
											minRows={4}
											value={formData.description}
											onChange={handleChange}
											error={!!errors.description}
											helperText={errors.description}
											required
											
											aria-required="true"
											aria-invalid={!!errors.title}
											aria-describedby={errors.title ? "title-error" : undefined}
											
											fullWidth
											variant="outlined"
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<DescriptionIcon sx={{ color: alpha(theme.palette.text.primary, 0.6) }} />
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
												"& .MuiInputLabel-root": {
													fontWeight: 500,
												}
											}}
										/>
										
										<Box sx={{
											display: "grid",
											gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
											gap: 2
										}}>
											{/* Категория */}
											<TextField
												label="Категория"
												name="category"
												select
												value={formData.category}
												onChange={handleChange}
												
												aria-required="true"
												aria-invalid={!!errors.title}
												aria-describedby={errors.title ? "title-error" : undefined}
												
												fullWidth
												variant="outlined"
												sx={{
													"& .MuiOutlinedInput-root": {
														borderRadius: 2,
														"&:hover .MuiOutlinedInput-notchedOutline": {
															borderColor: theme.palette.primary.main,
														},
													},
												}}
											>
												{categories.map((option) => (
													<MenuItem key={option.value} value={option.value} sx={{ py: 1.5 }}>
														<Stack direction="row" alignItems="center" spacing={1.5}>
															<Box sx={{ color: alpha(theme.palette.text.primary, 0.7) }}>
																{option.icon}
															</Box>
															<Typography variant="body2">{option.label}</Typography>
														</Stack>
													</MenuItem>
												))}
											</TextField>
											
											{/* Сложность */}
											<TextField
												label="Сложность"
												name="difficulty"
												select
												value={formData.difficulty}
												onChange={handleChange}
												fullWidth
												
												aria-required="true"
												aria-invalid={!!errors.title}
												aria-describedby={errors.title ? "title-error" : undefined}
												
												variant="outlined"
												sx={{
													"& .MuiOutlinedInput-root": {
														borderRadius: 2,
														"&:hover .MuiOutlinedInput-notchedOutline": {
															borderColor: theme.palette.primary.main,
														},
													},
												}}
											>
												{difficulties.map((option) => (
													<MenuItem key={option.value} value={option.value} sx={{ py: 1.5 }}>
														<Chip
															label={option.label}
															size="small"
															color={option.color}
															sx={{
																borderRadius: 1.5,
																fontWeight: 500,
																cursor: "pointer",
															}}
														/>
													</MenuItem>
												))}
											</TextField>
										</Box>
										
										{/* Дедлайн */}
										<TextField
											label="Дедлайн (необязательно)"
											type="date"
											name="deadline"
											value={formData.deadline}
											onChange={handleChange}
											error={!!errors.deadline}
											helperText={errors.deadline}
											InputLabelProps={{ shrink: true }}
											fullWidth
											
											aria-required="true"
											aria-invalid={!!errors.title}
											aria-describedby={errors.title ? "title-error" : undefined}
											
											variant="outlined"
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<CalendarTodayIcon sx={{ color: alpha(theme.palette.text.primary, 0.6) }} />
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
										
										{/* Ресурсы */}
										<Box>
											<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
												<LinkIcon sx={{ color: alpha(theme.palette.text.primary, 0.7), fontSize: 20 }} />
												<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
													Ресурсы для изучения
												</Typography>
											</Stack>
											
											<Stack spacing={1.5}>
												{formData.resources.map((r, i) => (
													<Box
														key={i}
														sx={{
															display: "flex",
															gap: 1.5,
															alignItems: "center",
														}}
													>
														<TextField
															fullWidth
															value={r}
															onChange={(e) =>
																handleResourceChange(i, e.target.value)
															}
															error={!!errors[`resource_${i}`]}
															helperText={errors[`resource_${i}`]}
															placeholder="https://example.com"
															variant="outlined"
															
															aria-required="true"
															aria-invalid={!!errors.title}
															aria-describedby={errors.title ? "title-error" : undefined}
															
															sx={{
																"& .MuiOutlinedInput-root": {
																	borderRadius: 2,
																	"&:hover .MuiOutlinedInput-notchedOutline": {
																		borderColor: theme.palette.primary.main,
																	},
																},
															}}
														/>
														
														{formData.resources.length > 1 && (
															<IconButton
																onClick={() => removeResourceField(i)}
																sx={{
																	width: 40,
																	height: 40,
																	borderRadius: 2,
																	bgcolor: alpha(theme.palette.error.main, 0.1),
																	"&:hover": {
																		bgcolor: alpha(theme.palette.error.main, 0.2),
																		transform: "scale(1.05)",
																	},
																	transition: "all 0.2s ease",
																	cursor: "pointer",
																}}
															>
																<DeleteIcon sx={{
																	color: theme.palette.error.main,
																	fontSize: 20
																}} />
															</IconButton>
														)}
													</Box>
												))}
											</Stack>
											
											<Button
												startIcon={<AddIcon />}
												onClick={addResourceField}
												variant="outlined"
												size="medium"
												sx={{
													mt: 2,
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
												Добавить ресурс
											</Button>
										</Box>
										
										{/* Кнопка отправки */}
										<Button
											type="submit"
											variant="contained"
											disabled={!isFormValid || submitting}
											fullWidth
											size="large"
											sx={{
												borderRadius: 2,
												py: 1.8,
												fontSize: "1rem",
												fontWeight: 600,
												background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.9)})`,
												boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
												"&:hover": {
													transform: "translateY(-2px)",
													boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
													background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${alpha(theme.palette.primary.dark, 0.8)})`,
												},
												"&:disabled": {
													background: theme.palette.action.disabledBackground,
													boxShadow: "none",
												},
												transition: "all 0.3s ease",
												cursor: submitting ? "wait" : "pointer",
											}}
										>
											{submitting ? "Добавление..." : "Добавить технологию"}
										</Button>
									</Stack>
								</form>
							</CardContent>
						</Card>
					</Box>
					
					{/* Правая колонка: Импорт */}
					<Box sx={{ flex: 1 }}>
						<Card
							elevation={0}
							sx={{
								borderRadius: 3,
								border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
								background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.03)} 0%, ${alpha(theme.palette.info.main, 0.01)} 100%)`,
								height: "100%",
								transition: "all 0.3s ease",
								"&:hover": {
									boxShadow: `0 8px 32px ${alpha(theme.palette.info.main, 0.1)}`,
									borderColor: alpha(theme.palette.info.main, 0.3),
								}
							}}
						>
							<CardHeader
								title={
									<Stack direction="row" alignItems="center" spacing={1.5}>
										<Box sx={{
											width: 40,
											height: 40,
											borderRadius: "12px",
											bgcolor: alpha(theme.palette.info.main, 0.1),
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}>
											<CloudUploadIcon sx={{ color: theme.palette.info.main, fontSize: 22 }} />
										</Box>
										<Box>
											<Typography variant="h6" sx={{ fontWeight: 700 }}>
												Импорт технологий
											</Typography>
											<Typography variant="body2" color="text.secondary">
												Импортируйте технологии из внешних источников
											</Typography>
										</Box>
									</Stack>
								}
								sx={{
									pb: 1,
									borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
								}}
							/>
							
							<CardContent sx={{ pt: 3 }}>
								<Stack spacing={3}>
									{/* Импорт из API */}
									<Box>
										<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.info.dark }}>
											Импорт из JSON API
										</Typography>
										
										<Stack spacing={2}>
											<TextField
												label="URL JSON API"
												value={importUrl}
												onChange={(e) => setImportUrl(e.target.value)}
												placeholder="https://example.com/data.json"
												fullWidth
												variant="outlined"
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<LinkIcon sx={{ color: alpha(theme.palette.text.primary, 0.6) }} />
														</InputAdornment>
													),
												}}
												sx={{
													"& .MuiOutlinedInput-root": {
														borderRadius: 2,
														"&:hover .MuiOutlinedInput-notchedOutline": {
															borderColor: theme.palette.info.main,
														},
													},
												}}
											/>
											
											<Stack direction="row" spacing={1.5}>
												<Button
													variant="contained"
													color="info"
													startIcon={<CloudUploadIcon />}
													onClick={handleImportRoadmap}
													disabled={importing || !importUrl.trim()}
													sx={{
														borderRadius: 2,
														flex: 1,
														fontWeight: 600,
														boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.3)}`,
														"&:hover": {
															transform: "translateY(-1px)",
															boxShadow: `0 6px 20px ${alpha(theme.palette.info.main, 0.4)}`,
														},
														transition: "all 0.2s ease",
														cursor: importing ? "wait" : "pointer",
													}}
												>
													{importing ? "Импорт..." : "Импортировать"}
												</Button>
												
												<Button
													variant="outlined"
													startIcon={<RefreshIcon />}
													onClick={refetchApi}
													disabled={apiLoading}
													sx={{
														borderRadius: 2,
														borderColor: alpha(theme.palette.info.main, 0.3),
														color: theme.palette.info.main,
														"&:hover": {
															borderColor: theme.palette.info.main,
															backgroundColor: alpha(theme.palette.info.main, 0.05),
														},
														cursor: apiLoading ? "wait" : "pointer",
													}}
												>
													Обновить
												</Button>
											</Stack>
											
											{importMessage && (
												<Fade in={!!importMessage}>
													<Alert
														severity={importMessage.startsWith("Ошибка") ? "error" : "success"}
														sx={{
															borderRadius: 2,
															border: "1px solid",
															borderColor: importMessage.startsWith("Ошибка") ?
																alpha(theme.palette.error.main, 0.2) :
																alpha(theme.palette.success.main, 0.2),
															boxShadow: 1,
														}}
													>
														{importMessage}
													</Alert>
												</Fade>
											)}
											
											{apiError && (
												<Alert severity="error" sx={{ borderRadius: 2, boxShadow: 1 }}>
													{apiError}
												</Alert>
											)}
										</Stack>
									</Box>
									
									<Divider sx={{ borderColor: alpha(theme.palette.divider, 0.3) }} />
									
									{/* Локальный импорт/экспорт */}
									<Box>
										<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.secondary.dark }}>
											Локальный импорт / экспорт
										</Typography>
										
										<Stack spacing={2}>
											<Button
												variant="outlined"
												component="label"
												fullWidth
												startIcon={<UploadFileIcon />}
												sx={{
													borderRadius: 2,
													py: 1.5,
													borderColor: alpha(theme.palette.secondary.main, 0.3),
													color: theme.palette.secondary.main,
													"&:hover": {
														borderColor: theme.palette.secondary.main,
														backgroundColor: alpha(theme.palette.secondary.main, 0.05),
														transform: "translateY(-1px)",
													},
													transition: "all 0.2s ease",
													cursor: "pointer",
												}}
											>
												Импортировать из JSON файла
												<input
													hidden
													type="file"
													accept=".json"
													onChange={handleFileImport}
												/>
											</Button>
											
											<Button
												variant="outlined"
												onClick={handleExportToJson}
												fullWidth
												startIcon={<DownloadIcon />}
												disabled={techList.length === 0}
												sx={{
													borderRadius: 2,
													py: 1.5,
													borderColor: alpha(theme.palette.success.main, 0.3),
													color: theme.palette.success.main,
													"&:hover": {
														borderColor: theme.palette.success.main,
														backgroundColor: alpha(theme.palette.success.main, 0.05),
														transform: "translateY(-1px)",
													},
													"&:disabled": {
														color: theme.palette.action.disabled,
														borderColor: theme.palette.action.disabledBackground,
													},
													transition: "all 0.2s ease",
													cursor: techList.length === 0 ? "not-allowed" : "pointer",
												}}
											>
												Экспортировать в JSON ({techList.length})
											</Button>
											
											<Box sx={{
												textAlign: "center",
												p: 1.5,
												borderRadius: 2,
												bgcolor: alpha(theme.palette.primary.main, 0.03),
												border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
											}}>
												<Typography variant="body2" color="text.secondary">
													Всего сохранено технологий: <Typography component="span" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>{techList.length}</Typography>
												</Typography>
											</Box>
										</Stack>
									</Box>
									
									{/* Информация */}
									<Alert
										severity="info"
										variant="outlined"
										sx={{
											borderRadius: 2,
											borderColor: alpha(theme.palette.info.main, 0.3),
											bgcolor: alpha(theme.palette.info.main, 0.05),
											"& .MuiAlert-icon": {
												color: theme.palette.info.main,
											}
										}}
									>
										<Typography variant="body2">
											Импортированные технологии автоматически добавляются в ваш список.
											Вы можете редактировать их после импорта.
										</Typography>
									</Alert>
								</Stack>
							</CardContent>
						</Card>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}