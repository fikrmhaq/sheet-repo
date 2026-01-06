import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
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
    const [title, setTitle] = React.useState("")
    const [artist, setArtist] = React.useState("")
    const [transpose, setTranspose] = React.useState("")
    const [value, setValue] = React.useState("");

    const handleSubmit = () => {
        onSubmit?.({ title, artist, transpose, sheet: value });
        setValue("");
        setArtist("");
        setTranspose("");
        setTitle("");
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
                <div className="font-inter">Save Sheet</div>
            </DialogTitle>

            <DialogContent>
                <ThemeProvider theme={darkTheme}>
                    <div>

                        <div className="mb-2">
                            <TextField className="w-full" label="Title" onChange={ev => setTitle(ev.target.value)} value={title} />
                        </div>
                        <div className="mb-2">
                            <TextField className="w-full" label="Artist" onChange={ev => setArtist(ev.target.value)} value={artist} />
                        </div>
                        <div>
                            <TextField className="w-full" label="Transpose" onChange={ev => setTranspose(ev.target.value)} value={transpose} />
                        </div>

                    </div>
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
        </Dialog>);
}