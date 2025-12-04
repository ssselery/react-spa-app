import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createAppTheme from "../theme/muiTheme";

const ColorModeContext = createContext({
	mode: "light",
	toggleColorMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export function ColorModeProvider({ children }) {
	const [mode, setMode] = useState(() => {
		if (typeof window === "undefined") return "light";
		return localStorage.getItem("mui-mode") || "light";
	});
	
	const colorMode = useMemo(
		() => ({
			mode,
			toggleColorMode: () => {
				setMode((prev) => {
					const next = prev === "light" ? "dark" : "light";
					localStorage.setItem("mui-mode", next);
					return next;
				});
			},
		}),
		[mode]
	);
	
	const theme = useMemo(() => createAppTheme(mode), [mode]);
	
	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}