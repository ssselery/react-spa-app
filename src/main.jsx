import React from "react";
import ReactDOM from "react-dom/client";

import { HashRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

import "@a1rth/css-normalize";
import "./styles/index.scss";

import createAppTheme from "./theme/muiTheme";

const theme = createAppTheme("light"); // 🔥 ВАЖНО: вызываем функцию и создаём объект темы

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<HashRouter>
				<AuthProvider>
					<App />
				</AuthProvider>
			</HashRouter>
		</ThemeProvider>
	</React.StrictMode>
);
