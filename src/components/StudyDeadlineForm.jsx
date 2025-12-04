import { useState, useEffect } from "react";

function StudyDeadlineForm({ onSave, initialData = {}, onCancel }) {
	const [date, setDate] = useState(initialData.date || "");
	const [comment, setComment] = useState(initialData.comment || "");
	const [errors, setErrors] = useState({});
	const [isValid, setIsValid] = useState(false);
	
	const validate = () => {
		const err = {};
		
		if (!date) {
			err.date = "Дата обязательна";
		} else {
			const d = new Date(date);
			const now = new Date();
			now.setHours(0, 0, 0, 0);
			if (d < now) err.date = "Дата не может быть в прошлом";
		}
		
		if (comment.trim().length < 5)
			err.comment = "Комментарий должен содержать минимум 5 символов";
		
		setErrors(err);
		setIsValid(Object.keys(err).length === 0);
	};
	
	useEffect(() => validate(), [date, comment]);
	
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!isValid) return;
		
		onSave({ date, comment });
	};
	
	return (
		<form onSubmit={handleSubmit} noValidate className="deadline-form">
			<h2>Установить сроки изучения</h2>
			
			<div className="form-group">
				<label htmlFor="deadline">
					<span className="required-note">Дата обязательна</span>
					Дата завершения
				</label>
				
				<input
					id="deadline"
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					aria-invalid={!!errors.date}
					aria-describedby={errors.date ? "deadline-error" : undefined}
					className={errors.date ? "error" : ""}
				/>
				
				{errors.date && (
					<span id="deadline-error" role="alert" className="error-message">
						{errors.date}
					</span>
				)}
			</div>
			
			<div className="form-group">
				<label htmlFor="comment">Комментарий</label>
				<textarea
					id="comment"
					rows="3"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					aria-invalid={!!errors.comment}
					aria-describedby={errors.comment ? "comment-error" : undefined}
				/>
				
				{errors.comment && (
					<span id="comment-error" role="alert" className="error-message">
						{errors.comment}
					</span>
				)}
			</div>
			
			<div className="form-actions">
				<button className="add-btn" disabled={!isValid}>Сохранить</button>
				<button type="button" className="add-btn--ghost" onClick={onCancel}>Отмена</button>
			</div>
		</form>
	);
}

export default StudyDeadlineForm;
