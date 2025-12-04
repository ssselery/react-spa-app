import { createTheme } from "@mui/material/styles";

export const getDesignTokens = (mode) => ({
	palette: {
		mode,
		primary: { main: "#ff6b35" },
		secondary: { main: "#0066cc" },
		background: {
			default: mode === "light" ? "#f5f5f7" : "#121212",
			paper: mode === "light" ? "#ffffff" : "#1e1e1e",
		},
	},
	shape: { borderRadius: 12 },
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					borderRadius: 999,
				},
			},
		},
	},
});

export default function createAppTheme(mode = "light") {
	return createTheme(getDesignTokens(mode));
}
