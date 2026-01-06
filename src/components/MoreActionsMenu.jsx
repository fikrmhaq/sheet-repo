import * as React from "react";
import { IconButton, Popover, Button, Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ActionButton({ icon, label, onClick, danger }) {
  return (
    <Button
    size="small"
      onClick={onClick}
      startIcon={icon}
      fullWidth
      sx={{
        justifyContent: "flex-start",
        color: danger ? "#F87171" : "#E5E7EB",
        textTransform: "none",
        borderRadius: "8px",
        px: 1.5,
        py: 1,
        "&:hover": {
          backgroundColor: danger
            ? "rgba(248,113,113,0.12)"
            : "rgba(255,255,255,0.08)",
        },
      }}
    >
      {label}
    </Button>
  );
}

export default function MoreActionsMenu({
  onAdd,
  onEdit,
  onDelete,
  hideAdd = false,
  hideEdit = false,
  hideDelete = false,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const hasAnyAction = !hideAdd || !hideEdit || !hideDelete;

  const handleOpen = (e) => {
    if (!hasAnyAction) return;
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handle = (cb) => () => {
    cb?.();
    handleClose();
  };

  if (!hasAnyAction) return null;

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: "rgb(156 163 175)", // text-gray-400
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.06)",
          },
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            backgroundColor: "#1F2937", // dark:bg-gray-800
            color: "#F9FAFB",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            p: 1,
            minWidth: 160,
          },
        }}
      >
        <Stack spacing={0.5}>
          {!hideAdd && (
            <ActionButton
              icon={<AddIcon fontSize="small" />}
              label="Add"
              onClick={handle(onAdd)}
            />
          )}

          {!hideEdit && (
            <ActionButton
              icon={<EditIcon fontSize="small" />}
              label="Edit"
              onClick={handle(onEdit)}
            />
          )}

          {!hideDelete && (
            <ActionButton
              icon={<DeleteIcon fontSize="small" />}
              label="Delete"
              danger
              onClick={handle(onDelete)}
            />
          )}
        </Stack>
      </Popover>
    </>
  );
}