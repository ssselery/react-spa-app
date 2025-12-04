import { useNavigate } from "react-router-dom";
import {
	Card,
	CardContent,
	CardActions,
	Typography,
	Button,
	Chip,
	Box,
} from "@mui/material";

function getStatusColor(status) {
	switch (status) {
		case "completed":
			return "success";
		case "in-progress":
			return "warning";
		default:
			return "default";
	}
}

function getStatusText(status) {
	switch (status) {
		case "completed":
			return "Завершено";
		case "in-progress":
			return "В процессе";
		default:
			return "Не начато";
	}
}

function SimpleTechCard({ technology, onStatusChange }) {
	const navigate = useNavigate();
	
	return (
		<Card
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<CardContent>
				<Typography variant="h6" component="h3" gutterBottom noWrap>
					{technology.title}
				</Typography>
				
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{
						mb: 2,
						display: "-webkit-box",
						WebkitLineClamp: 3,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
					}}
				>
					{technology.description || "Описание не указано."}
				</Typography>
				
				<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
					{technology.category && (
						<Chip
							label={technology.category}
							variant="outlined"
							size="small"
						/>
					)}
					<Chip
						label={getStatusText(technology.status)}
						color={getStatusColor(technology.status)}
						size="small"
					/>
				</Box>
			</CardContent>
			
			<CardActions sx={{ px: 2, pb: 2 }}>
				<Button
					size="small"
					variant="text"
					onClick={() => navigate(`/technologies/${technology.id}`)}
				>
					Подробнее
				</Button>
				
				{technology.status !== "completed" && (
					<Button
						size="small"
						variant="contained"
						onClick={() =>
							onStatusChange(technology.id, "completed")
						}
					>
						Завершить
					</Button>
				)}
				
				<Button
					size="small"
					variant="outlined"
					onClick={() =>
						onStatusChange(
							technology.id,
							technology.status === "in-progress"
								? "not-started"
								: "in-progress"
						)
					}
				>
					{technology.status === "in-progress"
						? "Приостановить"
						: "Начать"}
				</Button>
			</CardActions>
		</Card>
	);
}

export default SimpleTechCard;