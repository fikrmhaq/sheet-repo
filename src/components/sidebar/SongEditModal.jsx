import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Typography,
  IconButton,
  Divider,
  ThemeProvider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { darkTheme } from "../../pages/Dashboard";
import Button from "../Button";

export default function SongEditModal({
  id,
  open,
  onClose,
  onSubmit,
}) {
  const [song, setSong] = React.useState(null);

  React.useEffect(() => {
    if (!open) return;

    const stored = localStorage.getItem("songs");
    if (!stored) return;

    const songs = JSON.parse(stored);
    const found = songs.find(s => s.id === id);
    if (found) setSong(structuredClone(found));
  }, [id, open]);

  if (!song) return null;

  const updateField = (key) => (e) => {
    setSong(prev => ({ ...prev, [key]: e.target.value }));
  };

  const saveChanges = () => {
    const stored = localStorage.getItem("songs");
    if (!stored) return;

    const songs = JSON.parse(stored).map(s =>
      s.id === id ? song : s
    );

    localStorage.setItem("songs", JSON.stringify(songs));
    onSubmit?.(song);
    onClose();
  };

  const deleteVersion = (i) => {
    setSong(prev => ({
      ...prev,
      sheets: prev.sheets.filter(v => v.i !== i),
    }));
  };

  const editVersion = (i) => {
    const version = song.sheets.find(v => v.i === i);
    const updated = prompt("Name:", version.name);
    if (updated == null) return;

    setSong(prev => ({
      ...prev,
      sheets: prev.sheets.map(v =>
        v.i === i ? { ...v, name: updated } : v
      ),
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#111827",
          color: "#E5E7EB",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>Edit Song</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <ThemeProvider theme={darkTheme}>
            <TextField
              label="Title"
              value={song.title}
              onChange={updateField("title")}
              fullWidth
            />

            <TextField
              label="Artist"
              value={song.artist}
              onChange={updateField("artist")}
              fullWidth
            />

            <TextField
              label="Transpose"
              type="number"
              inputProps={{ min: -12, max: 12 }}
              value={song.transpose}
              onChange={updateField("transpose")}
              fullWidth
            />
          </ThemeProvider>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">
            Versions
          </Typography>

          {song.sheets.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No versions saved
            </Typography>
          )}

          <Stack spacing={1}>
            {song.sheets.map(v => (
              <Stack
                key={v.i}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  backgroundColor: "#1F2937",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                }}
              >
                <Typography fontSize={14}>
                  {v.name}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => editVersion(v.i)}
                    sx={{ color: "text.secondary" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => deleteVersion(v.i)}
                    sx={{ color: "#F87171" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions className="m-4">
        <Button onClick={onClose} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={saveChanges}
          variant="contained"
          sx={{
            backgroundColor: "#2563EB",
            "&:hover": { backgroundColor: "#1D4ED8" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
