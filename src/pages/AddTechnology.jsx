import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useTechnologies from "../hooks/useTechnologies";
import useTechnologiesApi from "../hooks/useTechnologiesApi";

import "../styles/components/PageLayout.scss";
import "../styles/components/AddTechnology.scss";

function AddTechnology() {
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

	const validateForm = () => {
		const newErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = "Название обязательно";
		} else if (formData.title.trim().length < 2) {
			newErrors.title = "Минимум 2 символа";
		} else if (formData.title.trim().length > 50) {
			newErrors.title = "Не более 50 символов";
		}

		if (!formData.description.trim()) {
			newErrors.description = "Описание обязательно";
		} else if (formData.description.trim().length < 10) {
			newErrors.description = "Минимум 10 символов";
		}

		if (formData.deadline) {
			const deadlineDate = new Date(formData.deadline);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			
			if (deadlineDate < today) {
				newErrors.deadline = "Дедлайн не может быть в прошлом";
			}
		}

		formData.resources.forEach((r, i) => {
			if (r.trim() !== "") {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};
	
	const handleResourceChange = (index, value) => {
		const next = [...formData.resources];
		next[index] = value;
		setFormData((prev) => ({ ...prev, resources: next }));
	};
	
	const addResourceField = () => {
		setFormData((prev) => ({
			...prev,
			resources: [...prev.resources, ""],
		}));
	};
	
	const removeResourceField = (index) => {
		if (formData.resources.length > 1) {
			setFormData((prev) => ({
				...prev,
				resources: prev.resources.filter((_, i) => i !== index),
			}));
		}
	};
	
	const handleSubmitManual = (e) => {
		e.preventDefault();
		if (!isFormValid) return;
		
		const nextId =
			techList.length > 0
				? Math.max(...techList.map((t) => Number(t.id) || 0)) + 1
				: 1;
		
		const cleanedData = {
			...formData,
			id: nextId,
			resources: formData.resources.filter((r) => r.trim() !== ""),
			createdAt: new Date().toISOString().split("T")[0],
			notes: "",
			status: "not-started",
		};
		
		addTechnology(cleanedData);
		navigate("/technologies");
	};

	const [importUrl, setImportUrl] = useState(
		"https://raw.githubusercontent.com/ssselery/react-spa-app/refs/heads/main/ApiTest/roadmap-frontend.json"
	);
	const [importing, setImporting] = useState(false);
	const [importMessage, setImportMessage] = useState("");
	
	const handleImportRoadmap = async (e) => {
		e.preventDefault();
		if (!importUrl.trim()) return;
		
		try {
			setImporting(true);
			setImportMessage("");
			
			const response = await fetch(importUrl.trim());
			if (!response.ok) {
				throw new Error(`Ошибка HTTP ${response.status}`);
			}
			
			const data = await response.json();
			
			const arr = Array.isArray(data)
				? data
				: Array.isArray(data.technologies)
					? data.technologies
					: null;
			
			if (!arr) throw new Error("Неверный формат данных");
			
			let currentMaxId =
				techList.length > 0
					? Math.max(...techList.map((t) => Number(t.id) || 0))
					: 0;
			
			let count = 0;
			
			for (const item of arr) {
				currentMaxId += 1;
				
				await addTechnologyViaApi(item); // чтобы соблюсти тз по API
				
				addTechnology({
					id: currentMaxId,
					title: item.title || "Без названия",
					description: item.description || "",
					category: item.category || "",
					createdAt: new Date().toISOString().split("T")[0],
					notes: "",
					source:
						Array.isArray(item.resources) && item.resources[0]
							? item.resources[0]
							: "",
					status: "not-started",
				});
				
				count += 1;
			}
			
			setImportMessage(`Импортировано: ${count}`);
		} catch (err) {
			setImportMessage("Ошибка импорта: " + err.message);
		} finally {
			setImporting(false);
		}
	};
	
	return (
		<section className="page add-page">
			<h1 className="page-title">Добавить технологию</h1>
			
			<div className="add-layout">
				<form className="add-card add-card--manual" onSubmit={handleSubmitManual}>
					<h2 className="add-card__title">Ручное добавление</h2>
					<p className="add-card__subtitle notice-required">
						<span className="asterisk">*</span> обязательные поля формы
					</p>

					<div
						role="status"
						aria-live="polite"
						aria-atomic="true"
						className="sr-only"
					>
						{!isFormValid && "Форма содержит ошибки"}
					</div>

					<div className="form-group">
						<label htmlFor="title" className="required">
							Название *
						</label>
						<input
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							aria-required="true"
							aria-invalid={!!errors.title}
							aria-describedby={errors.title ? "title-error" : undefined}
							className={errors.title ? "error" : ""}
							placeholder="React, Node.js, TypeScript..."
						/>
						{errors.title && (
							<span id="title-error" role="alert" className="error-message">
								{errors.title}
							</span>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="description" className="required">
							Описание *
						</label>
						<textarea
							id="description"
							name="description"
							rows="3"
							value={formData.description}
							onChange={handleChange}
							aria-required="true"
							aria-invalid={!!errors.description}
							aria-describedby={errors.description ? "desc-error" : undefined}
							className={errors.description ? "error" : ""}
							placeholder="Опишите, что это за технология и зачем её изучать..."
						/>
						{errors.description && (
							<span id="desc-error" role="alert" className="error-message">
								{errors.description}
							</span>
						)}
					</div>

					<div className="form-group">
						<label htmlFor="category">Категория</label>
						<select
							id="category"
							name="category"
							value={formData.category}
							onChange={handleChange}
						>
							<option value="frontend">Frontend</option>
							<option value="backend">Backend</option>
							<option value="database">Database</option>
							<option value="devops">DevOps</option>
							<option value="other">Другое</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="difficulty">Сложность</label>
						<select
							id="difficulty"
							name="difficulty"
							value={formData.difficulty}
							onChange={handleChange}
						>
							<option value="beginner">Начальный</option>
							<option value="intermediate">Средний</option>
							<option value="advanced">Продвинутый</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="deadline">Дедлайн</label>
						<input
							id="deadline"
							type="date"
							name="deadline"
							value={formData.deadline}
							onChange={handleChange}
							aria-invalid={!!errors.deadline}
							aria-describedby={errors.deadline ? "deadline-error" : undefined}
							className={errors.deadline ? "error" : ""}
						/>
						{errors.deadline && (
							<span id="deadline-error" role="alert" className="error-message">
								{errors.deadline}
							</span>
						)}
					</div>

					<div className="form-group">
						<label>Ресурсы</label>
						{formData.resources.map((r, i) => (
							<div key={i} className="resource-field">
								<input
									type="url"
									value={r}
									onChange={(e) => handleResourceChange(i, e.target.value)}
									aria-invalid={!!errors[`resource_${i}`]}
									aria-describedby={
										errors[`resource_${i}`] ? `reserr-${i}` : undefined
									}
									className={errors[`resource_${i}`] ? "error" : ""}
									placeholder="https://example.com"
								/>
								{formData.resources.length > 1 && (
									<button
										type="button"
										onClick={() => removeResourceField(i)}
										className="btn-remove"
									>
										Удалить
									</button>
								)}
								{errors[`resource_${i}`] && (
									<span
										id={`reserr-${i}`}
										role="alert"
										className="error-message"
									>
										{errors[`resource_${i}`]}
									</span>
								)}
							</div>
						))}
						
						<button
							type="button"
							onClick={addResourceField}
							className="btn-add-resource"
						>
							+ Добавить ресурс
						</button>
					</div>
					
					<button type="submit" className="add-btn" disabled={!isFormValid}>
						Добавить
					</button>
				</form>

				<div className="add-card add-card--import">
					<h2 className="add-card__title">Импорт дорожной карты</h2>
					<p className="add-card__subtitle">
						Подключите JSON с GitHub или другого API и импортируйте технологии.
					</p>
					
					<form className="add-import__form" onSubmit={handleImportRoadmap}>
						<div className="form-group">
							<label htmlFor="import-url">URL API</label>
							<input
								id="import-url"
								type="text"
								value={importUrl}
								onChange={(e) => setImportUrl(e.target.value)}
								placeholder="https://..."
							/>
						</div>
						
						<div className="add-import__actions">
							<button
								type="submit"
								disabled={importing}
								className="add-btn add-btn--secondary"
							>
								{importing ? "Импорт..." : "Импортировать"}
							</button>
							
							<button
								type="button"
								className="add-btn add-btn--ghost"
								disabled={apiLoading}
								onClick={refetchApi}
							>
								Обновить API
							</button>
						</div>
					</form>
					
					{/* --- ЛОКАЛЬНЫЙ ИМПОРТ / ЭКСПОРТ JSON --- */}
					<div className="local-io">
						<h3 className="local-io__title">Локальный импорт / экспорт</h3>
						
						<div className="local-io__buttons">
							<label className="file-input-label">
								Импортировать JSON
								<input
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
													alert("Ошибка: JSON должен содержать массив технологий");
													return;
												}
												
												let currentMaxId =
													techList.length > 0
														? Math.max(...techList.map((t) => Number(t.id) || 0))
														: 0;
												
												let importedCount = 0;
												
												data.forEach((item) => {
													currentMaxId++;
													
													addTechnology({
														id: currentMaxId,
														title: item.title || "Без названия",
														description: item.description || "",
														category: item.category || "",
														createdAt: new Date().toISOString().split("T")[0],
														notes: "",
														source: item.source || "",
														status: "not-started",
													});
													
													importedCount++;
												});
												
												alert(`Импортировано технологий: ${importedCount}`);
											} catch {
												alert("Ошибка чтения JSON-файла");
											}
										};
										
										reader.readAsText(file);
										e.target.value = "";
									}}
									style={{ display: "none" }}
								/>
							</label>
							
							<button
								className="add-btn add-btn--ghost"
								onClick={() => {
									const json = JSON.stringify(techList, null, 2);
									const blob = new Blob([json], { type: "application/json" });
									const url = URL.createObjectURL(blob);
									
									const a = document.createElement("a");
									a.href = url;
									a.download = "technologies_export.json";
									a.click();
									URL.revokeObjectURL(url);
								}}
							>
								Экспортировать JSON
							</button>
						</div>
					</div>
					
					
					{importMessage && (
						<div
							className={
								importMessage.startsWith("Ошибка")
									? "add-import__message add-import__message--error"
									: "add-import__message add-import__message--success"
							}
						>
							{importMessage}
						</div>
					)}
					
					
					
					{apiError && !importMessage && (
						<div className="add-import__message add-import__message--error">
							{apiError}
						</div>
					)}
				</div>
				
				
				
			</div>
		</section>
	);
}

export default AddTechnology;
