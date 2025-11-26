import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "@a1rth/css-normalize";
import "./styles/index.scss";

import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<BrowserRouter basename="/react-spa-app">
				<App />
			</BrowserRouter>
		</AuthProvider>
	</StrictMode>
);
