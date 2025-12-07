import { useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Chip,
	Stack,
	Paper,
	IconButton,
	Tooltip,
	useTheme,
	alpha,
	Avatar,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useState } from "react";

function getStatusConfig(status) {
	switch (status) {
		case "completed":
			return {
				label: "Завершено",
				color: "success",
				icon: <CheckCircleOutlineIcon />,
			};
		case "in-progress":
			return {
				label: "В процессе",
				color: "warning",
				icon: <PlayCircleOutlineIcon />,
			};
		default:
			return {
				label: "Не начато",
				color: "default",
				icon: <AccessTimeIcon />,
			};
	}
}

function getNextStatus(current) {
	if (current === "not-started") return "in-progress";
	if (current === "in-progress") return "completed";
	return "not-started";
}

export default function SimpleTechCard({ technology, onStatusChange }) {
	const navigate = useNavigate();
	const theme = useTheme();
	const [isBookmarked, setIsBookmarked] = useState(false);
	
	const statusCfg = getStatusConfig(technology.status);
	
	const handleStatusClick = () => {
		const next = getNextStatus(technology.status);
		onStatusChange(technology.id, next);
	};
	
	const getCategoryColor = (category) => {
		const colors = {
			frontend: theme.palette.primary.main,
			backend: theme.palette.secondary.main,
			database: theme.palette.success.main,
			language: theme.palette.warning.main,
			devops: theme.palette.info.main,
			other: theme.palette.grey[500],
		};
		return colors[category] || theme.palette.grey[500];
	};
	
	const categoryColor = getCategoryColor(technology.category);
	
	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				borderRadius: 3,
				border: "1px solid",
				borderColor: "divider",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				position: "relative",
				overflow: "hidden",
				transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				cursor: "pointer",
				"&:hover": {
					transform: "translateY(-8px)",
					borderColor: alpha(theme.palette.primary.main, 0.3),
					boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
					"& .arrow-button": {
						opacity: 1,
						transform: "translateX(0)",
					},
					"& .bookmark-button": {
						opacity: 1,
					},
				},
			}}
			onClick={() => navigate(`/technologies/${technology.id}`)}
		>
			{/* Категория полоса */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 4,
					background: `linear-gradient(90deg, ${categoryColor}, ${alpha(categoryColor, 0.5)})`,
				}}
			/>
			
			{/* Верхняя часть с кнопками */}
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
				<Avatar
					sx={{
						bgcolor: alpha(categoryColor, 0.1),
						color: categoryColor,
						width: 40,
						height: 40,
						fontSize: 16,
						fontWeight: 600,
					}}
				>
					{technology.title[0].toUpperCase()}
				</Avatar>
				
				<Stack direction="row" spacing={0.5}>
					<Tooltip title={isBookmarked ? "Удалить из закладок" : "Добавить в закладки"}>
						<IconButton
							size="small"
							className="bookmark-button"
							onClick={(e) => {
								e.stopPropagation();
								setIsBookmarked(!isBookmarked);
							}}
							sx={{
								opacity: 0.7,
								transition: "all 0.2s ease",
								"&:hover": {
									opacity: 1,
									color: theme.palette.warning.main,
								},
							}}
						>
							{isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
						</IconButton>
					</Tooltip>
					
					<Tooltip title="Перейти к деталям">
						<IconButton
							size="small"
							className="arrow-button"
							onClick={(e) => {
								e.stopPropagation();
								navigate(`/technologies/${technology.id}`);
							}}
							sx={{
								opacity: 0,
								transform: "translateX(10px)",
								transition: "all 0.3s ease",
								bgcolor: alpha(theme.palette.primary.main, 0.1),
								"&:hover": {
									bgcolor: alpha(theme.palette.primary.main, 0.2),
								},
							}}
						>
							<ArrowForwardIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Stack>
			</Box>
			
			{/* Заголовок */}
			<Typography
				variant="h6"
				sx={{
					fontWeight: 700,
					lineHeight: 1.3,
					mb: 1.5,
					color: theme.palette.text.primary,
					display: "-webkit-box",
					WebkitLineClamp: 2,
					WebkitBoxOrient: "vertical",
					overflow: "hidden",
				}}
			>
				{technology.title}
			</Typography>
			
			{/* Описание */}
			<Typography
				variant="body2"
				sx={{
					color: theme.palette.text.secondary,
					mb: 3,
					flex: 1,
					display: "-webkit-box",
					WebkitLineClamp: 3,
					WebkitBoxOrient: "vertical",
					overflow: "hidden",
				}}
			>
				{technology.description || "Описание отсутствует."}
			</Typography>
			
			{/* Категория и статус */}
			<Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
				<Stack direction="row" spacing={1}>
					<Chip
						icon={<CategoryIcon fontSize="small" />}
						label={technology.category || "Без категории"}
						size="small"
						variant="outlined"
						sx={{
							borderColor: alpha(categoryColor, 0.3),
							color: categoryColor,
							fontWeight: 500,
							"& .MuiChip-icon": {
								color: categoryColor,
							},
						}}
						onClick={(e) => {
							e.stopPropagation();
							// Можно добавить фильтрацию по категории
						}}
					/>
				</Stack>
				
				<Chip
					label={statusCfg.label}
					color={statusCfg.color}
					icon={statusCfg.icon}
					size="small"
					onClick={(e) => {
						e.stopPropagation();
						handleStatusClick();
					}}
					sx={{
						fontWeight: 600,
						cursor: "pointer",
						transition: "all 0.2s ease",
						"&:hover": {
							transform: "scale(1.05)",
						},
						"&.MuiChip-colorSuccess": {
							bgcolor: alpha(theme.palette.success.main, 0.1),
							color: theme.palette.success.main,
							"&:hover": {
								bgcolor: alpha(theme.palette.success.main, 0.2),
							},
						},
						"&.MuiChip-colorWarning": {
							bgcolor: alpha(theme.palette.warning.main, 0.1),
							color: theme.palette.warning.main,
							"&:hover": {
								bgcolor: alpha(theme.palette.warning.main, 0.2),
							},
						},
					}}
				/>
			</Stack>
			
			{/* ID и дата */}
			<Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
				<Typography
					variant="caption"
					sx={{
						color: theme.palette.text.disabled,
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<span>ID: {technology.id}</span>
					<span>{technology.createdAt || "Нет даты"}</span>
				</Typography>
			</Box>
		</Paper>
	);
}