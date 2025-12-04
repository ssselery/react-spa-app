// src/pages/TechnologyList.jsx
import { useState } from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";

import useTechnologies from "../hooks/useTechnologies";
import TechnologyCard from "../components/TechnologyCard";
import SimpleTechCard from "../components/SimpleTechCard";
import SearchDebounced from "../components/SearchDebounced";
import RemoteApiSearch from "../components/RemoteApiSearch";

function TechnologyList() {
	const { techList, updateStatus, addTechnology } = useTechnologies();
	const [query, setQuery] = useState("");
	
	const lowerQuery = query.toLowerCase();
	
	const filtered = techList.filter((t) => {
		const title = (t.title || "").toLowerCase();
		const desc = (t.description || "").toLowerCase();
		const category = (t.category || "").toLowerCase();
		
		return (
			title.includes(lowerQuery) ||
			desc.includes(lowerQuery) ||
			category.includes(lowerQuery)
		);
	});
	
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			<Box>
				<Typography variant="h4" component="h1" gutterBottom>
					Технологии
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Можно искать по названию, описанию и категории. Ниже — импорт из
					пользовательского API.
				</Typography>
			</Box>
			
			<Box sx={{ maxWidth: 460 }}>
				<SearchDebounced onSearch={setQuery} />
			</Box>
			
			{filtered.length === 0 ? (
				<Paper sx={{ p: 3 }}>
					<Typography>Ничего не найдено</Typography>
				</Paper>
			) : (
				<Grid container spacing={2}>
					{filtered.map((tech) => (
						<Grid item xs={12} sm={6} md={4} key={tech.id}>
							<SimpleTechCard
								technology={tech}
								onStatusChange={updateStatus}
							/>
						</Grid>
					))}
				</Grid>
			)}
			
			<Paper sx={{ p: 3, mt: 2 }}>
				<RemoteApiSearch onImportTechnology={addTechnology} />
			</Paper>
		</Box>
	);
}

export default TechnologyList;
