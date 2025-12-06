import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider, CssBaseline } from "@mui/material";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

import "@a1rth/css-normalize";

import createAppTheme from "./theme/muiTheme";

const theme = createAppTheme("light");

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			
			<BrowserRouter basename = "/react-spa-app/">
				<AuthProvider>
					<App />
				</AuthProvider>
			</BrowserRouter>
		
		</ThemeProvider>
	</React.StrictMode>
);
