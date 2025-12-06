import { Box, Paper, Typography } from "@mui/material";

export default function ToastContainer({ toasts }) {
	return (
		<Box
			sx={{
				position: "fixed",
				top: 70,
				right: 20,
				display: "flex",
				flexDirection: "column",
				gap: 1,
				zIndex: 20000
			}}
		>
			{toasts.map((t) => (
				<Paper
					key={t.id}
					sx={{
						p: 1.5,
						borderLeft: `4px solid ${
							t.type === "success"
								? "#4caf50"
								: t.type === "error"
									? "#d32f2f"
									: t.type === "warning"
										? "#ed6c02"
										: "#1976d2"
						}`,
						minWidth: 260
					}}
				>
					<Typography sx={{ fontWeight: 600 }}>{t.title}</Typography>
					{t.description && (
						<Typography variant="body2" sx={{ color: "text.secondary" }}>
							{t.description}
						</Typography>
					)}
				</Paper>
			))}
		</Box>
	);
}
