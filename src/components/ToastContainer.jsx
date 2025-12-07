import { Box, Paper, Typography, IconButton, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

const iconByType = {
	success: <CheckCircleIcon fontSize="small" color="success" />,
	error: <ErrorIcon fontSize="small" color="error" />,
	warning: <WarningIcon fontSize="small" color="warning" />,
	info: <InfoIcon fontSize="small" color="info" />,
};

export default function ToastContainer({ toasts, onClose }) {
	if (toasts.length === 0) return null;
	
	return (
		<Box
			sx={{
				position: "fixed",
				top: 80,
				right: 20,
				display: "flex",
				flexDirection: "column",
				gap: 2,
				zIndex: 2000,
				width: 360,
				maxHeight: "calc(100vh - 100px)",
				overflowY: "auto",
				overflowX: "hidden",
				// ✅ Убираем полосу прокрутки полностью
				"&::-webkit-scrollbar": {
					width: 0,
					height: 0,
					background: "transparent",
				},
				"&::-webkit-scrollbar-thumb": {
					background: "transparent",
				},
				"&::-webkit-scrollbar-track": {
					background: "transparent",
				},
				scrollbarWidth: "none",
				msOverflowStyle: "none",
			}}
		>
			{toasts.map((toast) => (
				<Paper
					key={toast.id}
					elevation={4}
					sx={{
						borderRadius: 2,
						overflow: "hidden",
						animation: "slideIn 0.3s ease",
						"@keyframes slideIn": {
							from: {
								transform: "translateX(100%)",
								opacity: 0,
							},
							to: {
								transform: "translateX(0)",
								opacity: 1,
							},
						},
						flexShrink: 0,
					}}
				>
					<Alert
						severity={toast.type}
						icon={iconByType[toast.type]}
						action={
							<IconButton
								size="small"
								onClick={() => onClose && onClose(toast.id)}
								sx={{ color: "inherit" }}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						}
						sx={{
							alignItems: "flex-start",
							borderRadius: 2,
							"& .MuiAlert-message": {
								flex: 1,
								py: 0.5,
							},
						}}
					>
						<Box>
							<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
								{toast.title}
							</Typography>
							{toast.description && (
								<Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
									{toast.description}
								</Typography>
							)}
						</Box>
					</Alert>
				</Paper>
			))}
		</Box>
	);
}