import { Box, Typography, Paper, Avatar, useTheme } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Bio() {
	const { user } = useAuth();
	const theme = useTheme();
	
	return (
		<Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
			<Paper
				variant="outlined"
				sx={{
					p: 4,
					maxWidth: 600,
					width: "100%",
					borderRadius: 3,
					bgcolor: "background.paper",
					textAlign: "center",
				}}
			>
				<Avatar
					sx={{
						width: 80,
						height: 80,
						fontSize: 32,
						bgcolor: theme.palette.primary.main,
						margin: "0 auto 16px",
					}}
				>
					{user?.username?.[0]?.toUpperCase() || "U"}
				</Avatar>
				
				<Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
					{user?.username || "Имя пользователя"}
				</Typography>
				
				<Typography variant="body1" sx={{ color: "text.secondary" }}>
					Профиль пользователя — раздел скоро будет расширен 🛠️
				</Typography>
			</Paper>
		</Box>
	);
}
