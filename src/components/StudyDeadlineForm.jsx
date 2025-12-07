import { useState, useEffect } from "react";
import {
	Box,
	Paper,
	TextField,
	Button,
	Typography,
	Stack,
	Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";

export default function StudyDeadlineForm({ onSave, initialData = {}, onCancel }) {
	const [date, setDate] = useState(initialData.date ? new Date(initialData.date) : null);
	const [comment, setComment] = useState(initialData.comment || "");
	const [errors, setErrors] = useState({});
	const [isValid, setIsValid] = useState(false);
	
	const validate = () => {
		const err = {};
		
		if (!date) {
			err.date = "Дата обязательна";
		} else {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const selectedDate = new Date(date);
			selectedDate.setHours(0, 0, 0, 0);
			
			if (selectedDate < today) {
				err.date = "Дата не может быть в прошлом";
			}
		}
		
		if (comment.trim().length < 5) {
			err.comment = "Комментарий должен содержать минимум 5 символов";
		}
		
		setErrors(err);
		setIsValid(Object.keys(err).length === 0);
	};
	
	useEffect(() => {
		validate();
	}, [date, comment]);
	
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!isValid) return;
		
		onSave({
			date: date.toISOString().split("T")[0],
			comment,
		});
	};
	
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
			<Paper
				elevation={0}
				sx={{
					p: 4,
					borderRadius: 3,
					border: "1px solid",
					borderColor: "divider",
					maxWidth: 500,
					mx: "auto",
				}}
			>
				<Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
					Установить сроки изучения
				</Typography>
				
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					Укажите дату завершения и комментарий для планирования обучения
				</Typography>
				
				<Box component="form" onSubmit={handleSubmit} noValidate>
					<Stack spacing={3}>
						<Box>
							<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
								<CalendarTodayIcon fontSize="small" />
								Дата завершения *
							</Typography>
							
							<DatePicker
								value={date}
								onChange={(newValue) => setDate(newValue)}
								format="dd.MM.yyyy"
								slotProps={{
									textField: {
										fullWidth: true,
										error: !!errors.date,
										helperText: errors.date,
										placeholder: "Выберите дату",
										
										InputProps: {
											'aria-required': 'true',
											'aria-invalid': !!errors.date,
											'aria-describedby': errors.date ? 'date-error' : undefined,
										},
										InputLabelProps: {
											htmlFor: 'date-picker',
										},
										sx: { borderRadius: 2 }
									},
								}}
							/>
						</Box>
						
						<Box>
							<Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
								<DescriptionIcon fontSize="small" />
								Комментарий *
							</Typography>
							
							<TextField
								fullWidth
								multiline
								rows={4}
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								error={!!errors.comment}
								helperText={errors.comment}
								placeholder="Опишите план изучения, цели или дополнительные заметки..."
								inputProps={{
									'aria-required': 'true',
									'aria-invalid': !!errors.comment,
									'aria-describedby': errors.comment ? 'comment-error' : undefined,
								}}
								
								InputProps={{
									sx: { borderRadius: 2 }
								}}
							/>
						</Box>
						
						{Object.keys(errors).length > 0 && (
							<Alert severity="error" sx={{ borderRadius: 2 }}>
								Пожалуйста, исправьте ошибки перед отправкой
							</Alert>
						)}
						
						<Stack direction="row" spacing={2} sx={{ pt: 1 }}>
							<Button
								type="submit"
								variant="contained"
								disabled={!isValid}
								fullWidth
								sx={{
									py: 1.5,
									fontWeight: 600,
								}}
							>
								Сохранить сроки
							</Button>
							
							<Button
								type="button"
								variant="outlined"
								onClick={onCancel}
								fullWidth
								sx={{
									py: 1.5,
								}}
							>
								Отмена
							</Button>
						</Stack>
					</Stack>
				</Box>
			</Paper>
		</LocalizationProvider>
	);
}