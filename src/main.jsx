import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import { ColorModeProvider } from "./context/ThemeModeContext";

import "@a1rth/css-normalize";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ColorModeProvider>
			<BrowserRouter basename="/react-spa-app/">
				
				<AuthProvider>
					<NotificationProvider>
						<App />
					</NotificationProvider>
				</AuthProvider>
			
			</BrowserRouter>
		</ColorModeProvider>
	</React.StrictMode>
);










