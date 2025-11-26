import { useEffect, useMemo } from "react";
import useLocalStorage from "./useLocalStorage";
import { useAuth } from "../context/AuthContext";

const defaultTechnologies = [
	{
		id: 1,
		title: "React",
		description: "Библиотека для создания пользовательских интерфейсов",
		category: "frontend",
		status: "not-started",
		source: "",
		notes: "",
		createdAt: "2025-01-01",
	},
	{
		id: 2,
		title: "JavaScript",
		description: "Язык программирования для веба",
		category: "language",
		status: "not-started",
		source: "",
		notes: "",
		createdAt: "2025-01-02",
	},
	{
		id: 3,
		title: "Node.js",
		description: "Выполнение JavaScript на сервере",
		category: "backend",
		status: "not-started",
		source: "",
		notes: "",
		createdAt: "2025-01-03",
	},
];

function useTechnologies() {
	const { user } = useAuth();
	
	const storageKey = useMemo(
		() => `technologies_${user?.username || "guest"}`,
		[user?.username]
	);
	
	const [techList, setTechList] = useLocalStorage(storageKey, defaultTechnologies);
	
	useEffect(() => {
		if (!user && (!techList || techList.length === 0)) {
			setTechList(defaultTechnologies);
		}
	}, [user, techList, setTechList]);
	
	const addTechnology = (techData) => {
		const newTech = {
			id:
				techList.length > 0
					? Math.max(...techList.map((t) => Number(t.id) || 0)) + 1
					: 1,
			title: techData.title,
			description: techData.description || "",
			category: techData.category || "",
			source: techData.source || "",
			status: techData.status || "not-started",
			notes: techData.notes || "",
			createdAt: techData.createdAt || new Date().toISOString().split("T")[0],
		};
		
		setTechList((prev) => [...prev, newTech]);
		return newTech;
	};
	
	const updateStatus = (id, newStatus) => {
		setTechList((prev) =>
			prev.map((t) =>
				t.id === Number(id) ? { ...t, status: newStatus } : t
			)
		);
	};
	
	const updateNotes = (id, notes) => {
		setTechList((prev) =>
			prev.map((t) =>
				t.id === Number(id) ? { ...t, notes } : t
			)
		);
	};
	
	const getTechnologyById = (id) => {
		return techList.find((t) => t.id === Number(id)) || null;
	};
	
	const clearTechnologiesForCurrentUser = () => {
		setTechList([]);
	};
	
	const resetToDefaultsForCurrentUser = () => {
		setTechList(defaultTechnologies);
	};
	
	return {
		techList,
		addTechnology,
		updateStatus,
		updateNotes,
		getTechnologyById,
		clearTechnologiesForCurrentUser,
		resetToDefaultsForCurrentUser,
	};
}

export default useTechnologies;
