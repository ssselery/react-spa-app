import {
	Box,
	Typography,
	Paper,
	Container,
	TextField,
	InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

import useTechnologies from "../hooks/useTechnologies";
import SimpleTechCard from "../components/SimpleTechCard";
import RemoteApiSearch from "../components/RemoteApiSearch";

export default function TechnologyList() {
	const { techList, updateStatus, addTechnology } = useTechnologies();
	const [query, setQuery] = useState("");
	
	const q = query.toLowerCase();
	
	const filtered = techList.filter((t) => {
		const title = (t.title || "").toLowerCase();
		const desc = (t.description || "").toLowerCase();
		const cat = (t.category || "").toLowerCase();
		return title.includes(q) || desc.includes(q) || cat.includes(q);
	});
	
	return (
		<Box sx={{ py: 4 }}>
			<Container maxWidth="lg">
				{/* HEADER */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						mb: 3,
					}}
				>
					<Typography variant="h4" sx={{ fontWeight: 700 }}>
						Технологии
					</Typography>
					
					<TextField
						size="small"
						placeholder="Поиск технологий…"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						sx={{
							width: 260,
							"& .MuiOutlinedInput-root": {
								borderRadius: "12px",
							},
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" />
								</InputAdornment>
							),
						}}
					/>
				</Box>
				
				{/* GRID */}
				<Box
					sx={{
						display: "grid",
						gap: 3,
						gridTemplateColumns: {
							xs: "1fr",
							sm: "1fr 1fr",
							md: "1fr 1fr 1fr",
						},
					}}
				>
					{filtered.map((tech) => (
						<SimpleTechCard
							key={tech.id}
							technology={tech}
							onStatusChange={updateStatus}
						/>
					))}
				</Box>
				
				{/* API BLOCK */}
				<Paper
					variant="outlined"
					sx={{
						p: 3,
						mt: 5,
						borderRadius: 3,
						borderColor: "#e0e0e0",
						backgroundColor: "background.paper",
					}}
				>
					<RemoteApiSearch onImportTechnology={addTechnology} />
				</Paper>
			
			</Container>
		</Box>
	);
}
