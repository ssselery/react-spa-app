// src/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
	const { user } = useAuth();
	
	// --- ключ хранилища исторических уведомлений ---
	const storageKey = user ? `notifications_${user.username}` : "notifications_guest";
	
	// --- Исторические уведомления для панели ---
	const [notifications, setNotifications] = useState(() => {
		const saved = localStorage.getItem(storageKey);
		return saved ? JSON.parse(saved) : [];
	});
	
	// --- Для всплывающих toast-уведомлений ---
	const [toasts, setToasts] = useState([]);
	
	// При смене пользователя загружаем его уведомления
	useEffect(() => {
		const saved = localStorage.getItem(storageKey);
		setNotifications(saved ? JSON.parse(saved) : []);
	}, [storageKey]);
	
	// Сохраняем в localStorage
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(notifications));
	}, [notifications]);
	
	// Добавление уведомления
	const addNotification = (title, description = "", type = "info") => {
		const id = Date.now();
		
		// — 1) добавляем в панель уведомлений —
		setNotifications((prev) => [
			{ id, title, description, type, createdAt: new Date().toISOString(), read: false },
			...prev
		]);
		
		// — 2) добавляем toast —
		setToasts((prev) => [
			{ id, title, description, type },
			...prev
		]);
		
		// Автоудаление toast через 3 сек
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 3000);
	};
	
	const markAllAsRead = () =>
		setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
	
	return (
		<NotificationContext.Provider value={{
			notifications,
			toasts,
			addNotification,
			markAllAsRead
		}}>
			{children}
		</NotificationContext.Provider>
	);
}

export function useNotifications() {
	return useContext(NotificationContext);
}
