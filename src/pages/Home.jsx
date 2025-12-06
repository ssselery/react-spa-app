import {
	Box,
	Typography,
	Button,
	Paper,
	Stack,
	Container,
} from "@mui/material";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import useTechnologies from "../hooks/useTechnologies";

export default function Home() {
	const { user } = useAuth();
	const { techList } = useTechnologies();
	
	const total = techList.length;
	const completed = techList.filter(t => t.status === "completed").length;
	const inProgress = techList.filter(t => t.status === "in-progress").length;
	const notStarted = techList.filter(t => t.status === "not-started").length;
	
	return (
		<Box sx={{ py: 6 }}>
			<Container maxWidth="md">
				
				{/* — HERO — */}
				<Box sx={{ textAlign: "center", mb: 6 }}>
					<Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
						{user ? `Привет, ${user.username}!` : "Трекер технологий"}
					</Typography>
					
					<Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
						Управляйте своим прогрессом: добавляйте технологии, отмечайте
						изученное, отслеживайте развитие.
					</Typography>
					
					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={2}
						justifyContent="center"
					>
						<Button
							component={Link}
							to="/technologies"
							variant="contained"
							sx={{ textTransform: "none", borderRadius: 2 }}
						>
							Перейти к списку
						</Button>
						
						<Button
							component={Link}
							to={user ? "/add" : "/login"}
							variant="outlined"
							sx={{ textTransform: "none", borderRadius: 2 }}
						>
							{user ? "Добавить технологию" : "Войти"}
						</Button>
					</Stack>
				</Box>
				
				{/* — СТАТИСТИКА (центрировано) — */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						width: "100%",
					}}
				>
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: {
								xs: "1fr 1fr",
								sm: "1fr 1fr 1fr 1fr",
							},
							gap: 2,
							maxWidth: 700,   // ← Центрирование по ширине
							width: "100%",
						}}
					>
						{[
							{ label: "Всего", value: total },
							{ label: "Изучено", value: completed },
							{ label: "В процессе", value: inProgress },
							{ label: "Не начато", value: notStarted },
						].map((item, i) => (
							<Paper
								key={i}
								variant="outlined"
								sx={{
									p: 2.5,
									textAlign: "center",
									borderRadius: 3,
								}}
							>
								<Typography variant="body2" sx={{ color: "text.secondary" }}>
									{item.label}
								</Typography>
								
								<Typography variant="h5" sx={{ fontWeight: 700 }}>
									{item.value}
								</Typography>
							</Paper>
						))}
					</Box>
				</Box>
			
			</Container>
		</Box>
	);
}
