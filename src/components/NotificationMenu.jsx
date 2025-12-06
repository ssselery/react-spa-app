import {
	Menu,
	MenuItem,
	ListItemText,
	ListItemIcon,
	Typography,
	Divider,
	Box,
	IconButton
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";

import { useNotifications } from "../context/NotificationContext";

export default function NotificationMenu({ anchorEl, onClose }) {
	const open = Boolean(anchorEl);
	const { notifications, markAsRead, clearNotifications } = useNotifications();
	
	const iconByType = {
		success: <CheckCircleIcon color="success" />,
		error: <ErrorIcon color="error" />,
		info: <InfoIcon color="primary" />,
	};
	
	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: { width: 330, maxHeight: 400, overflowY: "auto" },
			}}
		>
			<Box sx={{ px: 2, py: 1 }}>
				<Typography sx={{ fontWeight: 700 }}>Уведомления</Typography>
			</Box>
			
			<Divider />
			
			{notifications.length === 0 && (
				<MenuItem disabled>
					<ListItemText primary="Нет уведомлений" />
				</MenuItem>
			)}
			
			{notifications.map((n) => (
				<MenuItem
					key={n.id}
					onClick={() => {
						markAsRead(n.id);
						onClose();
					}}
				>
					<ListItemIcon>
						{iconByType[n.type] || iconByType.info}
					</ListItemIcon>
					
					<ListItemText
						primary={n.title}
						secondary={n.description}
						sx={{
							opacity: n.read ? 0.6 : 1,
						}}
					/>
				</MenuItem>
			))}
			
			{notifications.length > 0 && (
				<>
					<Divider />
					<MenuItem onClick={clearNotifications}>
						<ListItemText
							primary="Очистить все"
							sx={{ textAlign: "center", color: "red" }}
						/>
					</MenuItem>
				</>
			)}
		</Menu>
	);
}
