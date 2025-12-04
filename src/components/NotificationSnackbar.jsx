import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function NotificationSnackbar({
	                              open,
	                              message,
	                              severity = "info",
	                              autoHideDuration = 4000,
	                              onClose,
                              }) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={autoHideDuration}
			onClose={onClose}
			anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
		>
			<MuiAlert
				onClose={onClose}
				severity={severity}
				variant="filled"
				sx={{ width: "100%" }}
			>
				{message}
			</MuiAlert>
		</Snackbar>
	);
}

export default NotificationSnackbar;
