import {
    Card,
    CardContent,
    Stack,
    Typography,
    Button,
} from "@mui/material";
import { useMain } from "../../pages/Dashboard";

export default function FloatingActionCard({onCancel, onSubmit}) {
    return (
        <Card
            elevation={10}
            sx={{
                position: "fixed",
                bottom: 24,
                right: 24,
                bgcolor: "#121212",
                borderRadius: 3,
                px: 1,
                py: 1,
                zIndex: 1300,
            }}
        >
            <CardContent >
                <Stack direction="row" spacing={1.5}>
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
                        onClick={onCancel}
                    >
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
                        onClick={onSubmit}
                    >
                        Save
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}