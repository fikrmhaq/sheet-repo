import {
    Card,
    CardContent,
    Stack,
    Typography,
    // Button,
} from "@mui/material";
import { useMain } from "../../pages/Dashboard";
import Button from "../Button";

export default function FloatingActionCard({ onCancel, onSubmit }) {
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
                 
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                      
                        onClick={onSubmit}
                    >
                        Apply
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}