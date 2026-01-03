import { Box, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function ChangeHistory({ changes = [] }) {
  if (!changes.length) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "grey.300",
        fontFamily: "monospace",
      }}
    >
      {changes.map((change, index) => (
        <Box
          key={index}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Typography
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
              fontSize: 14,
            }}
          >
            {change}
          </Typography>

          {index < changes.length - 1 && (
            <ArrowForwardIosIcon sx={{ fontSize: 12, opacity: 0.6 }} />
          )}
        </Box>
      ))}
    </Box>
  );
}