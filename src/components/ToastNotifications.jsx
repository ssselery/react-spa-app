import { Box, Paper, Typography } from "@mui/material";
import { useNotifications } from "../context/NotificationContext";

export default function ToastNotifications() {
	const { notifications } = useNotifications();
	
	const visible = notifications.filter((n) => !n.hidden);
	
	const colors = {
		success: "#4caf50",
		error: "#f44336",
		warning: "#ffa726",
		info: "#29b6f6",
	};
	
	return (
		<Box
			sx={{
				position: "fixed",
				top: 80,
				right: 20,
				display: "flex",
				flexDirection: "column",
				gap: 1.2,
				zIndex: 2000,
			}}
		>
			{visible.map((n) => (
				<Paper
					key={n.id}
					elevation={6}
					sx={{
						p: 2,
						minWidth: 260,
						borderLeft: `6px solid ${colors[n.type]}`,
						opacity: n.hidden ? 0 : 1,
						transform: n.hidden ? "translateX(40px)" : "translateX(0)",
						transition: "all .4s ease",
						borderRadius: 2,
						bgcolor: "background.paper",
					}}
				>
					<Typography sx={{ fontWeight: 600 }}>{n.title}</Typography>
					{n.description && (
						<Typography sx={{ color: "text.secondary", mt: 0.5 }}>
							{n.description}
						</Typography>
					)}
				</Paper>
			))}
		</Box>
	);
}
