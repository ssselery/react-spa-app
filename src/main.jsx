import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App.jsx";
import "@a1rth/css-normalize";
import "./styles/index.scss";

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<HashRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</HashRouter>
	</React.StrictMode>
);
