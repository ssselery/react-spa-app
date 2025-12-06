import { useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Chip,
	Stack,
	Paper,
	IconButton,
	Tooltip,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function getStatusConfig(status) {
	switch (status) {
		case "completed":
			return { label: "Завершено", color: "success" };
		case "in-progress":
			return { label: "В процессе", color: "warning" };
		default:
			return { label: "Не начато", color: "default" };
	}
}

function getNextStatus(current) {
	if (current === "not-started") return "in-progress";
	if (current === "in-progress") return "completed";
	return "not-started";
}

export default function SimpleTechCard({ technology, onStatusChange }) {
	const navigate = useNavigate();
	const statusCfg = getStatusConfig(technology.status);
	
	const handleStatusClick = () => {
		const next = getNextStatus(technology.status);
		onStatusChange(technology.id, next);
	};
	
	return (
		<Paper
			elevation={0}
			sx={{
				p: 2.5,
				borderRadius: "12px",
				border: "1px solid #e5e5e5",
				transition: "0.2s",
				display: "flex",
				flexDirection: "column",
				gap: 2,
				"&:hover": {
					borderColor: "#d0d0d0",
					boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
				},
			}}
		>
			{/* header: title + иконка Подробнее */}
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
			>
				<Typography
					variant="h6"
					sx={{ fontWeight: 600, letterSpacing: "-0.2px" }}
				>
					{technology.title}
				</Typography>
				
				<Tooltip title="Подробнее">
					<IconButton
						size="small"
						onClick={() => navigate(`/technologies/${technology.id}`)}
					>
						<ArrowForwardIcon fontSize="small" />
					</IconButton>
				</Tooltip>
			</Stack>
			
			{/* описание */}
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{
					display: "-webkit-box",
					WebkitLineClamp: 3,
					WebkitBoxOrient: "vertical",
					overflow: "hidden",
				}}
			>
				{technology.description || "Описание отсутствует."}
			</Typography>
			
			{/* чипы, прибиты вниз */}
			<Stack
				direction="row"
				spacing={1}
				flexWrap="wrap"
				sx={{ mt: "auto" }} // <-- прибиваем блок вниз
			>
				{technology.category && (
					<Chip size="small" variant="outlined" label={technology.category} />
				)}
				
				<Chip
					label={statusCfg.label}
					color={statusCfg.color}
					onClick={handleStatusClick}
					size="small"
					sx={{
						cursor: "pointer",
						userSelect: "none",
						"&:hover": { opacity: 0.85 },
					}}
				/>
			</Stack>
		</Paper>
	);
}
