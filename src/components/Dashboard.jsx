import React from "react";
import {
	Box,
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Badge,
	Tabs,
	Tab,
	Card,
	CardContent,
	Grid,
	List,
	ListItem,
	ListItemText,
	LinearProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

function TabPanel({ children, value, index }) {
	return (
		<div role="tabpanel" hidden={value !== index}>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function Dashboard({ technologies }) {
	const [tabValue, setTabValue] = React.useState(0);
	const [notificationCount] = React.useState(3);
	
	const stats = {
		total: technologies.length,
		completed: technologies.filter((t) => t.status === "completed").length,
		inProgress: technologies.filter((t) => t.status === "in-progress").length,
		notStarted: technologies.filter((t) => t.status === "not-started").length,
	};
	
	const completionPercentage =
		stats.total > 0
			? Math.round((stats.completed / stats.total) * 100)
			: 0;
	
	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};
	
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" color="default" elevation={1}>
				<Toolbar>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, fontWeight: 600 }}
					>
						Панель управления технологиями
					</Typography>
					
					<IconButton color="inherit">
						<Badge badgeContent={notificationCount} color="error">
							<NotificationsIcon />
						</Badge>
					</IconButton>
				</Toolbar>
			</AppBar>
			
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={tabValue} onChange={handleTabChange}>
					<Tab label="Обзор" />
					<Tab label="Статистика" />
				</Tabs>
			</Box>
			
			<TabPanel value={tabValue} index={0}>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={6} md={3}>
						<Card>
							<CardContent>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
									<CheckCircleIcon color="success" sx={{ mr: 1 }} />
									<Typography
										color="text.secondary"
										variant="body2"
									>
										Завершено
									</Typography>
								</Box>
								<Typography variant="h4">
									{stats.completed}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					
					<Grid item xs={12} sm={6} md={3}>
						<Card>
							<CardContent>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
									<ScheduleIcon color="warning" sx={{ mr: 1 }} />
									<Typography
										color="text.secondary"
										variant="body2"
									>
										В процессе
									</Typography>
								</Box>
								<Typography variant="h4">
									{stats.inProgress}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					
					<Grid item xs={12} sm={6} md={3}>
						<Card>
							<CardContent>
								<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
									<TrendingUpIcon color="info" sx={{ mr: 1 }} />
									<Typography
										color="text.secondary"
										variant="body2"
									>
										Не начато
									</Typography>
								</Box>
								<Typography variant="h4">
									{stats.notStarted}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					
					<Grid item xs={12} sm={6} md={3}>
						<Card>
							<CardContent>
								<Typography
									color="text.secondary"
									variant="body2"
									gutterBottom
								>
									Общий прогресс
								</Typography>
								<Typography variant="h4" gutterBottom>
									{completionPercentage}%
								</Typography>
								<LinearProgress
									variant="determinate"
									value={completionPercentage}
									sx={{ height: 8, borderRadius: 4 }}
								/>
							</CardContent>
						</Card>
					</Grid>
					
					<Grid item xs={12} md={6}>
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Недавно добавленные
								</Typography>
								<List>
									{technologies.slice(0, 5).map((tech) => (
										<ListItem key={tech.id}>
											<ListItemText
												primary={tech.title}
												secondary={tech.category}
											/>
										</ListItem>
									))}
								</List>
							</CardContent>
						</Card>
					</Grid>
					
					<Grid item xs={12} md={6}>
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									По категориям
								</Typography>
								<List>
									{["frontend", "backend", "database", "ui-library", "other"].map(
										(category) => {
											const count = technologies.filter(
												(t) => t.category === category
											).length;
											if (!count) return null;
											return (
												<ListItem key={category}>
													<ListItemText
														primary={category}
														secondary={`${count} технологий`}
													/>
												</ListItem>
											);
										}
									)}
								</List>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</TabPanel>
			
			<TabPanel value={tabValue} index={1}>
				<Typography variant="h4" gutterBottom>
					Детальная статистика
				</Typography>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Card>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Общая информация
								</Typography>
								<Typography>Всего технологий: {stats.total}</Typography>
								<Typography>Завершено: {stats.completed}</Typography>
								<Typography>В процессе: {stats.inProgress}</Typography>
								<Typography>Не начато: {stats.notStarted}</Typography>
								<Typography sx={{ mt: 2 }}>
									Процент выполнения: {completionPercentage}%
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</TabPanel>
		</Box>
	);
}

export default Dashboard;
