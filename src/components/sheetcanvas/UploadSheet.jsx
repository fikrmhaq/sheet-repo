import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    ThemeProvider,
    createTheme,
} from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

export default function ({ open, onClose, onSubmit }) {
    const [value, setValue] = React.useState("");

    const handleSubmit = () => {
        onSubmit?.(value);
        setValue("");
        onClose?.();
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    <div className="font-inter">Enter Sheet</div>
                </DialogTitle>

                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Sheet"
                        type="text"
                        fullWidth
                        multiline
                        minRows={20}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="outlined"
                        sx={{
                            color: "#bb86fc",
                            borderColor: "#bb86fc",
                            "&:hover": {
                                borderColor: "#d0a9ff",
                                bgcolor: "rgba(187, 134, 252, 0.08)",
                            },
                        }}
                        onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                     variant="contained"
                        sx={{
                            bgcolor: "#bb86fc",
                            color: "#000",
                            "&:hover": {
                                bgcolor: "#d0a9ff",
                            },
                        }}
                    onClick={handleSubmit} >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}