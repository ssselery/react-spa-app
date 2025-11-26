import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
	const [value, setValue] = useState(() => {
		try {
			const stored = window.localStorage.getItem(key);
			if (stored !== null) {
				return JSON.parse(stored);
			}
			if (typeof initialValue === "function") {
				return initialValue();
			}
			return initialValue;
		} catch {
			if (typeof initialValue === "function") {
				return initialValue();
			}
			return initialValue;
		}
	});
	
	useEffect(() => {
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch {
		}
	}, [key, value]);
	
	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(key);
			if (stored !== null) {
				setValue(JSON.parse(stored));
			} else {
				if (typeof initialValue === "function") {
					setValue(initialValue());
				} else {
					setValue(initialValue);
				}
			}
		} catch {
			if (typeof initialValue === "function") {
				setValue(initialValue());
			} else {
				setValue(initialValue);
			}
		}
	}, [key]);
	
	return [value, setValue];
}

export default useLocalStorage;
