import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
	Box,
	Paper,
	TextField,
	Typography,
	Button,
} from "@mui/material";

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();
	
	const [username, setUsername] = useState("");
	
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!username.trim()) return;
		
		login(username.trim());
		navigate("/");
	};
	
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "70vh",
				mt: 4,
			}}
		>
			<Paper
				variant="outlined"
				sx={{
					p: 4,
					borderRadius: 3,
					width: "100%",
					maxWidth: 420,
				}}
			>
				<Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
					Вход
				</Typography>
				
				<Typography sx={{ mb: 3, color: "text.secondary" }}>
					Введите имя пользователя, чтобы продолжить.
				</Typography>
				
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Имя пользователя"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						sx={{ mb: 3 }}
					/>
					
					<Button
						type="submit"
						variant="contained"
						fullWidth
						disabled={!username.trim()}
						sx={{
							textTransform: "none",
							borderRadius: 2,
							fontSize: "1rem",
						}}
					>
						Войти
					</Button>
				</form>
			</Paper>
		</Box>
	);
}
