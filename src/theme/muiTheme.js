import { createTheme } from "@mui/material/styles";

const createAppTheme = (mode = "light") => {
	const isLight = mode === "light";
	
	return createTheme({
		palette: {
			mode,
			primary: {
				main: isLight ? "#1976d2" : "#90caf9",
				light: isLight ? "#4791db" : "#bbdefb",
				dark: isLight ? "#115293" : "#42a5f5",
				contrastText: "#ffffff",
			},
			secondary: {
				main: isLight ? "#9c27b0" : "#ce93d8",
				light: isLight ? "#ba68c8" : "#e1bee7",
				dark: isLight ? "#7b1fa2" : "#ab47bc",
				contrastText: "#ffffff",
			},
			success: {
				main: isLight ? "#2e7d32" : "#66bb6a",
				light: isLight ? "#4caf50" : "#81c784",
				dark: isLight ? "#1b5e20" : "#388e3c",
			},
			warning: {
				main: isLight ? "#ed6c02" : "#ffa726",
				light: isLight ? "#ff9800" : "#ffb74d",
				dark: isLight ? "#e65100" : "#f57c00",
			},
			error: {
				main: isLight ? "#d32f2f" : "#f44336",
				light: isLight ? "#ef5350" : "#e57373",
				dark: isLight ? "#c62828" : "#d32f2f",
			},
			info: {
				main: isLight ? "#0288d1" : "#29b6f6",
				light: isLight ? "#03a9f4" : "#4fc3f7",
				dark: isLight ? "#01579b" : "#0288d1",
			},
			background: {
				default: isLight ? "#f8fafc" : "#0f172a",
				paper: isLight ? "#ffffff" : "#1e293b",
			},
			text: {
				primary: isLight ? "#1e293b" : "#f1f5f9",
				secondary: isLight ? "#64748b" : "#94a3b8",
				disabled: isLight ? "#94a3b8" : "#475569",
			},
			divider: isLight ? "#e2e8f0" : "#334155",
			action: {
				active: isLight ? "#64748b" : "#94a3b8",
				hover: isLight ? "rgba(30, 41, 59, 0.04)" : "rgba(241, 245, 249, 0.08)",
				hoverOpacity: 0.08,
				selected: isLight ? "rgba(30, 41, 59, 0.08)" : "rgba(241, 245, 249, 0.12)",
				selectedOpacity: 0.12,
				disabled: isLight ? "rgba(30, 41, 59, 0.26)" : "rgba(241, 245, 249, 0.3)",
				disabledBackground: isLight ? "rgba(30, 41, 59, 0.12)" : "rgba(241, 245, 249, 0.12)",
				focus: isLight ? "rgba(30, 41, 59, 0.12)" : "rgba(241, 245, 249, 0.12)",
				focusOpacity: 0.12,
				activatedOpacity: 0.12,
			},
		},
		shape: {
			borderRadius: 12,
		},
		typography: {
			fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
			h1: {
				fontWeight: 800,
				fontSize: "3rem",
				lineHeight: 1.1,
				letterSpacing: "-0.02em",
			},
			h2: {
				fontWeight: 700,
				fontSize: "2.25rem",
				lineHeight: 1.2,
				letterSpacing: "-0.01em",
			},
			h3: {
				fontWeight: 700,
				fontSize: "1.875rem",
				lineHeight: 1.3,
			},
			h4: {
				fontWeight: 700,
				fontSize: "1.5rem",
				lineHeight: 1.4,
			},
			h5: {
				fontWeight: 600,
				fontSize: "1.25rem",
				lineHeight: 1.5,
			},
			h6: {
				fontWeight: 600,
				fontSize: "1.125rem",
				lineHeight: 1.5,
			},
			subtitle1: {
				fontWeight: 500,
				fontSize: "1rem",
				lineHeight: 1.6,
			},
			subtitle2: {
				fontWeight: 500,
				fontSize: "0.875rem",
				lineHeight: 1.5,
			},
			body1: {
				fontSize: "1rem",
				lineHeight: 1.6,
			},
			body2: {
				fontSize: "0.875rem",
				lineHeight: 1.5,
			},
			button: {
				textTransform: "none",
				fontWeight: 600,
				fontSize: "0.875rem",
				letterSpacing: "0.01em",
			},
			caption: {
				fontSize: "0.75rem",
				lineHeight: 1.4,
			},
			overline: {
				fontSize: "0.75rem",
				fontWeight: 600,
				letterSpacing: "0.05em",
				textTransform: "uppercase",
			},
		},
		shadows: [
			"none",
			"0 1px 2px rgba(0, 0, 0, 0.05)",
			"0 1px 3px rgba(0, 0, 0, 0.1)",
			"0 2px 4px rgba(0, 0, 0, 0.1)",
			"0 4px 8px rgba(0, 0, 0, 0.1)",
			"0 8px 16px rgba(0, 0, 0, 0.1)",
			"0 16px 32px rgba(0, 0, 0, 0.1)",
			"0 24px 48px rgba(0, 0, 0, 0.1)",
			"0 32px 64px rgba(0, 0, 0, 0.1)",
			...Array(16).fill("none"),
		],
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: {
						scrollBehavior: "smooth",
						"&::-webkit-scrollbar": {
							width: "8px",
							height: "8px",
						},
						"&::-webkit-scrollbar-track": {
							backgroundColor: "transparent",
						},
						"&::-webkit-scrollbar-thumb": {
							backgroundColor: isLight ? "#cbd5e1" : "#475569",
							borderRadius: "4px",
							"&:hover": {
								backgroundColor: isLight ? "#94a3b8" : "#64748b",
							},
						},
					},
				},
			},
			MuiButton: {
				defaultProps: {
					disableElevation: true,
				},
				styleOverrides: {
					root: {
						borderRadius: 10,
						textTransform: "none",
						fontWeight: 600,
						padding: "10px 24px",
						fontSize: "0.875rem",
						transition: "all 0.2s ease",
					},
					sizeSmall: {
						padding: "6px 16px",
						fontSize: "0.8125rem",
					},
					sizeLarge: {
						padding: "14px 32px",
						fontSize: "0.9375rem",
					},
					contained: {
						"&:hover": {
							transform: "translateY(-1px)",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
						},
						"&:active": {
							transform: "translateY(0)",
						},
					},
					outlined: {
						borderWidth: 1.5,
						"&:hover": {
							borderWidth: 1.5,
						},
					},
				},
			},
			MuiPaper: {
				defaultProps: {
					elevation: 0,
				},
				styleOverrides: {
					root: {
						borderRadius: 16,
						backgroundImage: "none",
						transition: "box-shadow 0.2s ease, transform 0.2s ease",
					},
					outlined: {
						borderWidth: 1.5,
						"&:hover": {
							boxShadow: isLight
								? "0 4px 20px rgba(0, 0, 0, 0.05)"
								: "0 4px 20px rgba(0, 0, 0, 0.2)",
						},
					},
					elevation1: {
						boxShadow: isLight
							? "0 1px 3px rgba(0, 0, 0, 0.1)"
							: "0 1px 3px rgba(0, 0, 0, 0.3)",
					},
					elevation2: {
						boxShadow: isLight
							? "0 3px 6px rgba(0, 0, 0, 0.1)"
							: "0 3px 6px rgba(0, 0, 0, 0.3)",
					},
				},
			},
			MuiCard: {
				styleOverrides: {
					root: {
						borderRadius: 16,
						overflow: "hidden",
						transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
						"&:hover": {
							transform: "translateY(-4px)",
							boxShadow: isLight
								? "0 12px 32px rgba(0, 0, 0, 0.1)"
								: "0 12px 32px rgba(0, 0, 0, 0.3)",
						},
					},
				},
			},
			MuiCardContent: {
				styleOverrides: {
					root: {
						padding: "24px",
						"&:last-child": {
							paddingBottom: "24px",
						},
					},
				},
			},
			MuiCardActions: {
				styleOverrides: {
					root: {
						padding: "16px 24px",
					},
				},
			},
			MuiTextField: {
				styleOverrides: {
					root: {
						"& .MuiOutlinedInput-root": {
							borderRadius: 10,
							transition: "all 0.2s ease",
							"&:hover .MuiOutlinedInput-notchedOutline": {
								borderColor: isLight ? "#94a3b8" : "#64748b",
							},
							"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
								borderWidth: 2,
							},
						},
						"& .MuiInputLabel-root": {
							"&.Mui-focused": {
								fontWeight: 600,
							},
						},
					},
				},
			},
			MuiInputBase: {
				styleOverrides: {
					root: {
						fontSize: "0.9375rem",
					},
				},
			},
			MuiInputLabel: {
				styleOverrides: {
					root: {
						fontSize: "0.9375rem",
					},
				},
			},
			MuiSelect: {
				styleOverrides: {
					root: {
						borderRadius: 10,
					},
				},
			},
			MuiChip: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						fontWeight: 500,
						transition: "all 0.2s ease",
						"&:hover": {
							transform: "translateY(-1px)",
						},
					},
					sizeSmall: {
						height: "24px",
						fontSize: "0.75rem",
					},
				},
			},
			MuiAppBar: {
				styleOverrides: {
					root: {
						backgroundImage: "none",
						boxShadow: isLight
							? "0 1px 3px rgba(0, 0, 0, 0.1)"
							: "0 1px 3px rgba(0, 0, 0, 0.3)",
						backdropFilter: "blur(8px)",
						backgroundColor: isLight
							? "rgba(255, 255, 255, 0.9)"
							: "rgba(15, 23, 42, 0.9)",
					},
				},
			},
			MuiDivider: {
				styleOverrides: {
					root: {
						borderColor: isLight ? "#e2e8f0" : "#334155",
					},
				},
			},
			MuiListItem: {
				styleOverrides: {
					root: {
						borderRadius: 8,
						marginBottom: "4px",
						"&:hover": {
							backgroundColor: isLight ? "rgba(30, 41, 59, 0.04)" : "rgba(241, 245, 249, 0.08)",
						},
					},
				},
			},
			MuiAlert: {
				styleOverrides: {
					root: {
						borderRadius: 12,
						alignItems: "flex-start",
					},
					standardSuccess: {
						backgroundColor: isLight ? "#f0f9f0" : "#1b3721",
					},
					standardError: {
						backgroundColor: isLight ? "#fdf0f0" : "#3c1f1f",
					},
					standardWarning: {
						backgroundColor: isLight ? "#fff8e6" : "#3c2f1f",
					},
					standardInfo: {
						backgroundColor: isLight ? "#e6f4ff" : "#1f2f3c",
					},
				},
			},
			MuiLinearProgress: {
				styleOverrides: {
					root: {
						borderRadius: 6,
						height: 8,
					},
				},
			},
			MuiTooltip: {
				styleOverrides: {
					tooltip: {
						borderRadius: 8,
						fontSize: "0.75rem",
						padding: "8px 12px",
						backdropFilter: "blur(8px)",
						backgroundColor: isLight
							? "rgba(30, 41, 59, 0.9)"
							: "rgba(15, 23, 42, 0.9)",
					},
				},
			},
			MuiAvatar: {
				styleOverrides: {
					root: {
						borderRadius: 10,
					},
				},
			},
			MuiBadge: {
				styleOverrides: {
					badge: {
						fontWeight: 600,
					},
				},
			},
		},
	});
};

export default createAppTheme;