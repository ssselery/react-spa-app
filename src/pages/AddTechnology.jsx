import { useState } from "react";
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
	
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [source, setSource] = useState("");
	const [status, setStatus] = useState("not-started");
	
	const [importUrl, setImportUrl] = useState(
		"https://raw.githubusercontent.com/ssselery/react-spa-app/refs/heads/main/ApiTest/roadmap-frontend.json"
	);
	const [importing, setImporting] = useState(false);
	const [importMessage, setImportMessage] = useState("");
	
	const handleSubmitManual = (e) => {
		e.preventDefault();
		
		if (!title.trim()) {
			alert("Введите название технологии");
			return;
		}
		
		const nextId =
			techList.length > 0
				? Math.max(...techList.map((t) => Number(t.id) || 0)) + 1
				: 1;
		
		const newTech = {
			id: nextId,
			title: title.trim(),
			description: description.trim(),
			category: category.trim(),
			source: source.trim(),
			status,
			notes: "",
			createdAt: new Date().toISOString().split("T")[0],
		};
		
		addTechnology(newTech);
		navigate("/technologies");
	};
	
	const handleImportRoadmap = async (e) => {
		e.preventDefault();
		if (!importUrl.trim()) return;
		
		try {
			setImporting(true);
			setImportMessage("");
			
			const response = await fetch(importUrl.trim());
			if (!response.ok) {
				throw new Error(
					`Не удалось загрузить дорожную карту (HTTP ${response.status})`
				);
			}
			
			const data = await response.json();
			
			const technologiesArray = Array.isArray(data)
				? data
				: Array.isArray(data.technologies)
					? data.technologies
					: null;
			
			if (!technologiesArray) {
				throw new Error("Некорректный формат данных дорожной карты");
			}
			
			let currentMaxId =
				techList.length > 0
					? Math.max(...techList.map((t) => Number(t.id) || 0))
					: 0;
			
			let addedCount = 0;
			
			for (const tech of technologiesArray) {
				await addTechnologyViaApi(tech);
				
				currentMaxId += 1;
				
				const mappedTech = {
					id: currentMaxId,
					title: tech.title || "Без названия",
					description: tech.description || "",
					category: tech.category || "",
					source: Array.isArray(tech.resources) ? tech.resources[0] || "" : "",
					status: "not-started",
					notes: "",
					createdAt: new Date().toISOString().split("T")[0],
				};
				
				addTechnology(mappedTech);
				addedCount += 1;
			}
			
			setImportMessage(`Успешно импортировано ${addedCount} технологий`);
		} catch (err) {
			setImportMessage(`Ошибка импорта: ${err.message}`);
		} finally {
			setImporting(false);
		}
	};
	
	return (
		<section className="page add-page">
			<h1 className="page-title">Добавить технологию</h1>
			<p className="page-subtitle">
				Создайте свою технологию вручную или импортируйте готовую дорожную карту
				из внешнего API.
			</p>
			
			<div className="add-layout">
				<form className="add-card add-card--manual" onSubmit={handleSubmitManual}>
					<h2 className="add-card__title">Ручное добавление</h2>
					
					<div className="form-group">
						<label>Название *</label>
						<input
							type="text"
							value={title}
							placeholder="Введите название..."
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
					
					<div className="form-group">
						<label>Описание</label>
						<textarea
							rows="3"
							value={description}
							placeholder="Краткое описание..."
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					
					<div className="form-group">
						<label>Категория</label>
						<input
							type="text"
							value={category}
							placeholder="Например: Frontend"
							onChange={(e) => setCategory(e.target.value)}
						/>
					</div>
					
					<div className="form-group">
						<label>Источник / ссылка</label>
						<input
							type="text"
							value={source}
							placeholder="https://example.com"
							onChange={(e) => setSource(e.target.value)}
						/>
					</div>
					
					<div className="form-group">
						<label>Статус</label>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
						>
							<option value="not-started">Не начато</option>
							<option value="in-progress">В процессе</option>
							<option value="completed">Завершено</option>
						</select>
					</div>
					
					<button className="add-btn" type="submit">
						Добавить
					</button>
				</form>
				
				<div className="add-card add-card--import">
					<h2 className="add-card__title">Импорт дорожной карты</h2>
					<p className="add-card__subtitle">
						Загрузите список технологий из внешнего API в формате JSON.
					</p>
					
					<form className="add-import__form" onSubmit={handleImportRoadmap}>
						<div className="form-group">
							<label>URL API дорожной карты</label>
							<input
								type="text"
								value={importUrl}
								onChange={(e) => setImportUrl(e.target.value)}
								placeholder="https://..."
							/>
						</div>
						
						<div className="add-import__actions">
							<button
								type="submit"
								className="add-btn add-btn--secondary"
								disabled={importing}
							>
								{importing ? "Импорт..." : "Импортировать"}
							</button>
							
							<button
								type="button"
								className="add-btn add-btn--ghost"
								disabled={apiLoading}
								onClick={refetchApi}
							>
								Обновить данные API
							</button>
						</div>
					</form>
					
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
