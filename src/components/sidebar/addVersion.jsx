import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    // Button,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import Button from "../Button";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

export default function ({ open, onClose, onSubmit }) {
    const [name, setName] = React.useState("")

    const handleSubmit = () => {
        onSubmit?.(name);
        setName("")
        onClose?.();
    };

    return (

        <Dialog
            PaperProps={{
                sx: {
                    backgroundColor: "#111827",
                    color: "#E5E7EB",
                    borderRadius: 3,
                },
            }}
            open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <div className="font-inter">Add Version</div>
            </DialogTitle>

            <DialogContent>
                <ThemeProvider theme={darkTheme}>
                    <div>
                        <div className="">
                            <TextField className="w-full" label="Version Name" onChange={ev => setName(ev.target.value)} value={name} />
                        </div>
                    </div>
                </ThemeProvider>
            </DialogContent>

            <DialogActions className="m-4">
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
    );
}