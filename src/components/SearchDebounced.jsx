import { useState, useEffect } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchDebounced({ onSearch, delay = 400 }) {
	const [value, setValue] = useState("");
	
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (typeof onSearch === "function") {
				onSearch(value);
			}
		}, delay);
		
		return () => clearTimeout(timeout);
	}, [value, delay, onSearch]);
	
	return (
		<TextField
			fullWidth
			size="small"
			value={value}
			onChange={(e) => setValue(e.target.value)}
			placeholder="Поиск технологий…"
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<SearchIcon fontSize="small" />
					</InputAdornment>
				),
			}}
			sx={{
				"& .MuiOutlinedInput-root": {
					borderRadius: "10px",
				},
			}}
		/>
	);
}
