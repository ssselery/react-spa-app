import { useState } from "react";
import useTechnologies from "../hooks/useTechnologies";

function BulkStatusEditor() {
	const { techList, updateStatus } = useTechnologies();
	const [selected, setSelected] = useState([]);
	const [newStatus, setNewStatus] = useState("not-started");
	
	const toggle = (id) =>
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	
	const apply = () => {
		selected.forEach((id) => updateStatus(id, newStatus));
		alert("Статус обновлён для выбранных технологий");
	};
	
	return (
		<div className="bulk-editor">
			<h2>Массовое изменение статуса</h2>
			
			<ul className="bulk-list">
				{techList.map((t) => (
					<li key={t.id}>
						<label>
							<input
								type="checkbox"
								checked={selected.includes(t.id)}
								onChange={() => toggle(t.id)}
							/>
							{t.title}
						</label>
					</li>
				))}
			</ul>
			
			<select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
				<option value="not-started">Не начато</option>
				<option value="in-progress">В процессе</option>
				<option value="completed">Завершено</option>
			</select>
			
			<button disabled={selected.length === 0} onClick={apply} className="add-btn">
				Применить
			</button>
		</div>
	);
}

export default BulkStatusEditor;
