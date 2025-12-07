import {
	Box,
	Paper,
	Typography,
	Chip,
	Stack,
	Link,
	useTheme,
} from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

export default function TechnologyListApi({ technologies }) {
	const theme = useTheme();
	
	if (!technologies || technologies.length === 0) {
		return (
			<Box sx={{ textAlign: "center", p: 4 }}>
				<Typography variant="body1" color="text.secondary">
					Технологии пока не загружены
				</Typography>
			</Box>
		);
	}
	
	return (
		<Stack spacing={3}>
			{technologies.map((tech) => (
				<Paper
					key={tech.id}
					variant="outlined"
					sx={{
						p: 3,
						borderRadius: 3,
						borderColor: "divider",
						"&:hover": {
							borderColor: "primary.main",
						},
						transition: "all 0.2s ease",
					}}
				>
					<Box sx={{ mb: 2 }}>
						<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
							<Typography variant="h6" sx={{ fontWeight: 600 }}>
								{tech.title}
							</Typography>
							
							{tech.category && (
								<Chip
									label={tech.category}
									size="small"
									variant="outlined"
									sx={{ borderRadius: 2 }}
								/>
							)}
						</Box>
						
						{tech.description && (
							<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
								{tech.description}
							</Typography>
						)}
						
						{tech.difficulty && (
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
								<Typography variant="caption" sx={{ fontWeight: 500 }}>
									Уровень:
								</Typography>
								<Chip
									label={tech.difficulty}
									size="small"
									color={
										tech.difficulty === "beginner" ? "success" :
											tech.difficulty === "intermediate" ? "warning" :
												"error"
									}
									sx={{ borderRadius: 2 }}
								/>
							</Box>
						)}
						
						{tech.resources && tech.resources.length > 0 && (
							<Box>
								<Typography variant="caption" sx={{ fontWeight: 500, display: "block", mb: 1 }}>
									Ресурсы:
								</Typography>
								<Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
									{tech.resources.map((url, i) => (
										<Link
											key={url}
											href={url}
											target="_blank"
											rel="noopener noreferrer"
											
											aria-label={`Открыть ресурс ${i + 1} в новой вкладке`}
											
											sx={{
												display: "inline-flex",
												alignItems: "center",
												gap: 0.5,
												px: 1.5,
												py: 0.5,
												borderRadius: 2,
												bgcolor: theme.palette.mode === "light" ? "grey.100" : "grey.800",
												textDecoration: "none",
												color: "text.secondary",
												fontSize: "0.75rem",
												fontWeight: 500,
												"&:hover": {
													bgcolor: theme.palette.mode === "light" ? "grey.200" : "grey.700",
													color: "primary.main",
												},
											}}
										>
											Ресурс #{i + 1}
											<LaunchIcon fontSize="inherit" />
										</Link>
									))}
								</Stack>
							</Box>
						)}
					</Box>
				</Paper>
			))}
		</Stack>
	);
}