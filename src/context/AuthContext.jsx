import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		try {
			const saved = localStorage.getItem("user");
			return saved ? JSON.parse(saved) : null;
		} catch {
			return null;
		}
	});
	
	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		} else {
			localStorage.removeItem("user");
			localStorage.setItem("technologies_guest", JSON.stringify([]));
		}
	}, [user]);
	
	const login = (username) => {
		setUser({ username });
	};
	
	const logout = () => {
		setUser(null);
		localStorage.setItem("technologies_guest", JSON.stringify([]));
	};
	
	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
