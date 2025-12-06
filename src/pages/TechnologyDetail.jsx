import { useParams, useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Paper,
	Button,
	Chip,
	Stack,
	Divider,
	TextField,
	Link as MuiLink,
	useTheme,
} from "@mui/material";
import useTechnologies from "../hooks/useTechnologies";

export default function TechnologyDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const theme = useTheme();
	
	const { getTechnologyById, updateStatus, updateNotes } = useTechnologies();
	const tech = getTechnologyById(id);
	
	if (!tech) {
		return (
			<Box sx={{ py: 6, textAlign: "center" }}>
				<Typography variant="h4" sx={{ mb: 2 }}>
					Технология не найдена
				</Typography>
				
				<Button variant="outlined" onClick={() => navigate(-1)}>
					Вернуться назад
				</Button>
			</Box>
		);
	}
	
	// цвета статусов
	const STATUS_STYLES = {
		"not-started": { label: "Не начато", color: "default" },
		"in-progress": { label: "В процессе", color: "warning" },
		completed: { label: "Завершено", color: "success" },
	};
	
	return (
		<Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
			<Paper
				variant="outlined"
				sx={{
					width: "100%",
					maxWidth: 900,
					p: 4,
					borderRadius: 3,
					bgcolor: "background.paper",
				}}
			>
				{/* КНОПКА НАЗАД */}
				<Button
					variant="text"
					onClick={() => navigate(-1)}
					sx={{ mb: 2, textTransform: "none" }}
				>
					← Назад
				</Button>
				
				{/* ЗАГОЛОВОК */}
				<Box sx={{ mb: 2 }}>
					<Typography variant="h4" sx={{ fontWeight: 700 }}>
						{tech.title}
					</Typography>
					
					<Typography
						variant="caption"
						sx={{ color: "text.secondary", mt: 1, display: "block" }}
					>
						ID: {tech.id}
					</Typography>
				</Box>
				
				<Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
					{tech.description}
				</Typography>
				
				<Divider sx={{ my: 3 }} />
				
				{/* СТАТУСЫ */}
				<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
					Статус
				</Typography>
				
				<Stack direction="row" spacing={1} sx={{ mb: 3 }}>
					{Object.entries(STATUS_STYLES).map(([key, s]) => (
						<Chip
							key={key}
							label={s.label}
							color={key === tech.status ? s.color : "default"}
							variant={key === tech.status ? "filled" : "outlined"}
							onClick={() => updateStatus(id, key)}
							sx={{
								cursor: "pointer",
								fontWeight: key === tech.status ? 600 : 400,
							}}
						/>
					))}
				</Stack>
				
				<Divider sx={{ my: 3 }} />
				
				{/* ИНФОРМАЦИЯ */}
				<Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
					Информация
				</Typography>
				
				<Stack spacing={1.5} sx={{ mb: 3 }}>
					<Box>
						<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
							Категория:
						</Typography>
						<Typography variant="body2">{tech.category || "—"}</Typography>
					</Box>
					
					<Box>
						<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
							Источник:
						</Typography>
						{tech.source ? (
							<MuiLink
								href={tech.source}
								target="_blank"
								rel="noopener"
								sx={{ fontSize: "0.9rem" }}
							>
								{tech.source}
							</MuiLink>
						) : (
							<Typography variant="body2">—</Typography>
						)}
					</Box>
					
					<Box>
						<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
							Дата добавления:
						</Typography>
						<Typography variant="body2">{tech.createdAt || "—"}</Typography>
					</Box>
				</Stack>
				
				<Divider sx={{ my: 3 }} />
				
				{/* ЗАМЕТКИ */}
				<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
					Заметки
				</Typography>
				
				<TextField
					multiline
					minRows={4}
					fullWidth
					placeholder="Добавьте заметку…"
					value={tech.notes || ""}
					onChange={(e) => updateNotes(id, e.target.value)}
					sx={{
						borderRadius: 2,
						"& .MuiOutlinedInput-root": {
							borderRadius: "12px",
						},
					}}
				/>
			</Paper>
		</Box>
	);
}
