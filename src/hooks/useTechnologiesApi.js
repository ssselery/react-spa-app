import { useState, useEffect } from "react";

function useTechnologiesApi() {
	const [technologies, setTechnologies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	
	const fetchTechnologies = async () => {
		try {
			setLoading(true);
			setError(null);
			
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			const mockTechnologies = [
				{
					id: 1,
					title: "React",
					description: "Библиотека для создания пользовательских интерфейсов",
					category: "frontend",
					difficulty: "beginner",
					resources: ["https://react.dev", "https://ru.reactjs.org"],
				},
				{
					id: 2,
					title: "Node.js",
					description: "Среда выполнения JavaScript на сервере",
					category: "backend",
					difficulty: "intermediate",
					resources: ["https://nodejs.org", "https://nodejs.org/ru/docs/"],
				},
				{
					id: 3,
					title: "TypeScript",
					description: "Типизированное надмножество JavaScript",
					category: "language",
					difficulty: "intermediate",
					resources: ["https://www.typescriptlang.org"],
				},
			];
			
			setTechnologies(mockTechnologies);
		} catch (err) {
			console.error("Ошибка загрузки:", err);
			setError("Не удалось загрузить технологии");
		} finally {
			setLoading(false);
		}
	};
	
	const addTechnology = async (techData) => {
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));
			
			const newTech = {
				id: Date.now(),
				...techData,
				createdAt: new Date().toISOString(),
			};
			
			setTechnologies((prev) => [...prev, newTech]);
			return newTech;
		} catch (err) {
			console.error("Ошибка добавления технологии:", err);
			throw new Error("Не удалось добавить технологию");
		}
	};
	
	useEffect(() => {
		fetchTechnologies();
	}, []);
	
	return {
		technologies,
		loading,
		error,
		refetch: fetchTechnologies,
		addTechnology,
	};
}

export default useTechnologiesApi;
