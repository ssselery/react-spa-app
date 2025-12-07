import { useState } from "react";
import {
	Box,
	Paper,
	Typography,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Button,
	Select,
	MenuItem,
	Alert,
	Stack,
	Divider,
	Chip,
} from "@mui/material";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import useTechnologies from "../hooks/useTechnologies";

export default function BulkStatusEditor() {
	const { techList, updateStatus } = useTechnologies();
	const [selected, setSelected] = useState([]);
	const [newStatus, setNewStatus] = useState("not-started");
	const [showSuccess, setShowSuccess] = useState(false);
	
	const toggle = (id) => {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};
	
	const toggleAll = () => {
		if (selected.length === techList.length) {
			setSelected([]);
		} else {
			setSelected(techList.map((t) => t.id));
		}
	};
	
	const apply = () => {
		selected.forEach((id) => updateStatus(id, newStatus));
		setShowSuccess(true);
		setTimeout(() => setShowSuccess(false), 3000);
	};
	
	const statusOptions = [
		{ value: "not-started", label: "Не начато", color: "default" },
		{ value: "in-progress", label: "В процессе", color: "warning" },
		{ value: "completed", label: "Завершено", color: "success" },
	];
	
	const getStatusLabel = (status) => {
		const option = statusOptions.find(opt => opt.value === status);
		return option ? option.label : status;
	};
	
	return (
		<Paper
			elevation={0}
			sx={{
				p: 4,
				borderRadius: 3,
				border: "1px solid",
				borderColor: "divider",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
				<PlaylistAddCheckIcon fontSize="large" color="primary" />
				<Box>
					<Typography variant="h5" sx={{ fontWeight: 600 }}>
						Массовое изменение статуса
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Выберите технологии и примените к ним новый статус
					</Typography>
				</Box>
			</Box>
			
			{showSuccess && (
				<Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
					Статус обновлён для {selected.length} выбранных технологий
				</Alert>
			)}
			
			<Stack spacing={3}>
				<Box>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
						<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
							Список технологий ({techList.length})
						</Typography>
						
						<FormControlLabel
							control={
								<Checkbox
									checked={selected.length === techList.length && techList.length > 0}
									indeterminate={selected.length > 0 && selected.length < techList.length}
									onChange={toggleAll}
								/>
							}
							label="Выбрать все"
						/>
					</Box>
					
					<Paper
						variant="outlined"
						sx={{
							p: 2,
							maxHeight: 300,
							overflow: "auto",
							borderRadius: 2,
							bgcolor: "background.default",
						}}
					>
						<FormGroup>
							{techList.map((tech) => (
								<Box
									key={tech.id}
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										p: 1.5,
										borderRadius: 1,
										bgcolor: selected.includes(tech.id) ? "action.selected" : "transparent",
										"&:hover": {
											bgcolor: "action.hover",
										},
									}}
								>
									<FormControlLabel
										control={
											<Checkbox
												checked={selected.includes(tech.id)}
												onChange={() => toggle(tech.id)}
												size="small"
											/>
										}
										label={
											<Box>
												<Typography variant="body2" sx={{ fontWeight: 500 }}>
													{tech.title}
												</Typography>
												<Typography variant="caption" color="text.secondary">
													{tech.category}
												</Typography>
											</Box>
										}
									/>
									
									<Chip
										label={getStatusLabel(tech.status)}
										size="small"
										color={statusOptions.find(opt => opt.value === tech.status)?.color || "default"}
										variant="outlined"
									/>
								</Box>
							))}
						</FormGroup>
					</Paper>
				</Box>
				
				<Divider />
				
				<Box>
					<Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
						Выберите новый статус
					</Typography>
					
					<Select
						fullWidth
						value={newStatus}
						onChange={(e) => setNewStatus(e.target.value)}
						sx={{ borderRadius: 2 }}
					>
						{statusOptions.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Chip
										label={option.label}
										size="small"
										color={option.color}
										sx={{ minWidth: 80 }}
									/>
								</Box>
							</MenuItem>
						))}
					</Select>
				</Box>
				
				<Box>
					<Button
						variant="contained"
						disabled={selected.length === 0}
						onClick={apply}
						fullWidth
						size="large"
						sx={{
							py: 1.5,
							fontWeight: 600,
						}}
					>
						Применить новый статус к {selected.length} элементам
					</Button>
					
					<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
						Выбрано: {selected.length} из {techList.length} технологий
					</Typography>
				</Box>
			</Stack>
		</Paper>
	);
}