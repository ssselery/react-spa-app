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
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

import useTechnologies from "../hooks/useTechnologies";
import useTechnologiesApi from "../hooks/useTechnologiesApi";

export default function AddTechnology() {
	const theme = useTheme();
	const navigate = useNavigate();
	
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
	
	const { addNotification } = useNotifications();
	
	const validateForm = () => {
		const newErrors = {};
		
		// ----- Title -----
		if (!formData.title.trim()) newErrors.title = "Название обязательно";
		else if (formData.title.trim().length < 2)
			newErrors.title = "Минимум 2 символа";
		else if (formData.title.trim().length > 50)
			newErrors.title = "Не более 50 символов";
		
		// ----- Description -----
		if (!formData.description.trim())
			newErrors.description = "Описание обязательно";
		else if (formData.description.trim().length < 10)
			newErrors.description = "Минимум 10 символов";
		
		// ----- Deadline -----
		if (formData.deadline) {
			const date = new Date(formData.deadline);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			if (date < today) newErrors.deadline = "Дата не может быть в прошлом";
		}
		
		// ----- Resources -----
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
	
	// ----- Handlers -----
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
	
	const handleSubmitManual = (e) => {
		e.preventDefault();
		if (!isFormValid) return;
		
		const nextId =
			techList.length > 0
				? Math.max(...techList.map((t) => Number(t.id) || 0)) + 1
				: 1;
		
		addTechnology({
			...formData,
			id: nextId,
			resources: formData.resources.filter((x) => x.trim() !== ""),
			createdAt: new Date().toISOString().split("T")[0],
			status: "not-started",
			notes: "",
		});
		
		addNotification(
			"Технология добавлена",
			`Вы добавили технологию: ${formData.title}`
		);
		
		
		navigate("/technologies");
	};
	
	// ===== API IMPORT =====
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
			
			const msg = `Импортировано: ${count}`;
			setImportMessage(msg);
			
			addNotification("Импорт дорожной карты", msg);
		} catch (err) {
			const msg = "Ошибка импорта: " + err.message;
			setImportMessage(msg);
			
			addNotification("Ошибка импорта дорожной карты", msg);
		} finally {
			setImporting(false);
		}
	};
	
	return (
		<Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
			<Box sx={{ width: "100%", maxWidth: 1100 }}>
				<Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
					Добавить технологию
				</Typography>
				
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
						gap: 3,
					}}
				>
					{/* ------------------ ЛЕВАЯ КАРТА: РУЧНОЕ ДОБАВЛЕНИЕ ------------------ */}
					<Paper sx={{ p: 3, borderRadius: 3 }} variant="outlined">
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
							Ручное добавление
						</Typography>
						<Typography sx={{ mb: 3, color: "text.secondary" }}>
							Поля отмеченные * обязательны.
						</Typography>
						
						<form onSubmit={handleSubmitManual}>
							<Stack spacing={2}>
								<TextField
									label="Название *"
									name="title"
									value={formData.title}
									onChange={handleChange}
									error={!!errors.title}
									helperText={errors.title}
								/>
								
								<TextField
									label="Описание *"
									name="description"
									multiline
									minRows={3}
									value={formData.description}
									onChange={handleChange}
									error={!!errors.description}
									helperText={errors.description}
								/>
								
								<TextField
									label="Категория"
									name="category"
									select
									value={formData.category}
									onChange={handleChange}
								>
									<MenuItem value="frontend">Frontend</MenuItem>
									<MenuItem value="backend">Backend</MenuItem>
									<MenuItem value="database">Database</MenuItem>
									<MenuItem value="devops">DevOps</MenuItem>
									<MenuItem value="other">Другое</MenuItem>
								</TextField>
								
								<TextField
									label="Сложность"
									name="difficulty"
									select
									value={formData.difficulty}
									onChange={handleChange}
								>
									<MenuItem value="beginner">Начальный</MenuItem>
									<MenuItem value="intermediate">Средний</MenuItem>
									<MenuItem value="advanced">Продвинутый</MenuItem>
								</TextField>
								
								<TextField
									label="Дедлайн"
									type="date"
									name="deadline"
									value={formData.deadline}
									onChange={handleChange}
									error={!!errors.deadline}
									helperText={errors.deadline}
									InputLabelProps={{ shrink: true }}
								/>
								
								{/* РЕСУРСЫ */}
								<Box>
									<Typography sx={{ mb: 1 }}>Ресурсы</Typography>
									<Stack spacing={1.5}>
										{formData.resources.map((r, i) => (
											<Box
												key={i}
												sx={{
													display: "flex",
													gap: 1,
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
												/>
												
												{formData.resources.length > 1 && (
													<IconButton onClick={() => removeResourceField(i)}>
														<DeleteIcon />
													</IconButton>
												)}
											</Box>
										))}
									</Stack>
									
									<Button
										startIcon={<AddIcon />}
										sx={{ mt: 1, textTransform: "none" }}
										onClick={addResourceField}
									>
										Добавить ресурс
									</Button>
								</Box>
								
								<Button
									type="submit"
									variant="contained"
									disabled={!isFormValid}
									sx={{
										textTransform: "none",
										borderRadius: 2,
										py: 1,
									}}
								>
									Добавить
								</Button>
							</Stack>
						</form>
					</Paper>
					
					{/* ------------------ ПРАВАЯ КАРТА: ИМПОРТ API ------------------ */}
					<Paper sx={{ p: 3, borderRadius: 3 }} variant="outlined">
						<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
							Импорт дорожной карты
						</Typography>
						
						<Typography sx={{ mb: 2, color: "text.secondary" }}>
							Введите URL JSON-файла.
						</Typography>
						
						<Stack spacing={2}>
							<TextField
								label="URL API"
								value={importUrl}
								onChange={(e) => setImportUrl(e.target.value)}
							/>
							
							<Stack direction="row" spacing={1}>
								<Button
									variant="contained"
									startIcon={<CloudUploadIcon />}
									onClick={handleImportRoadmap}
									disabled={importing}
									sx={{ textTransform: "none", borderRadius: 2 }}
								>
									{importing ? "Импорт…" : "Импортировать"}
								</Button>
								
								<Button
									variant="outlined"
									startIcon={<RefreshIcon />}
									onClick={refetchApi}
									disabled={apiLoading}
									sx={{ textTransform: "none", borderRadius: 2 }}
								>
									Обновить API
								</Button>
							</Stack>
							
							{importMessage && (
								<Typography
									sx={{
										color: importMessage.startsWith("Ошибка")
											? theme.palette.error.main
											: theme.palette.success.main,
									}}
								>
									{importMessage}
								</Typography>
							)}
							
							{apiError && (
								<Typography sx={{ color: theme.palette.error.main }}>
									{apiError}
								</Typography>
							)}
						</Stack>
						
						<Divider sx={{ my: 3 }} />
						
						{/* ------------------ ЛОКАЛЬНЫЙ ИМПОРТ/ЭКСПОРТ JSON ------------------ */}
						<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
							Локальный импорт / экспорт
						</Typography>
						
						<Stack spacing={2}>
							<Button
								variant="outlined"
								component="label"
								sx={{ textTransform: "none", borderRadius: 2 }}
							>
								Импортировать JSON
								<input
									hidden
									type="file"
									accept=".json"
									onChange={(e) => {
										const file = e.target.files[0];
										if (!file) return;
										
										const reader = new FileReader();
										reader.onload = (ev) => {
											try {
												const data = JSON.parse(ev.target.result);
												
												if (!Array.isArray(data)) {
													alert("JSON должен содержать массив объектов");
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
														createdAt: new Date()
															.toISOString()
															.split("T")[0],
														status: "not-started",
														notes: "",
														source: item.source || "",
													});
													
													count++;
												});
												
												alert(`Импортировано: ${count}`);
											} catch {
												alert("Ошибка чтения JSON");
											}
										};
										
										reader.readAsText(file);
										e.target.value = "";
									}}
								/>
							</Button>
							
							<Button
								variant="outlined"
								sx={{ textTransform: "none", borderRadius: 2 }}
								onClick={() => {
									const json = JSON.stringify(techList, null, 2);
									const blob = new Blob([json], {
										type: "application/json",
									});
									const url = URL.createObjectURL(blob);
									
									const a = document.createElement("a");
									a.href = url;
									a.download = "technologies_export.json";
									a.click();
									
									URL.revokeObjectURL(url);
								}}
							>
								Экспортировать JSON
							</Button>
						</Stack>
					</Paper>
				</Box>
			</Box>
		</Box>
	);
}
