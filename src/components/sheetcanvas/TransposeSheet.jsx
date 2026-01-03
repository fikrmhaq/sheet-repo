import { IconButton, TextField, Box } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { useMain } from "../../pages/Dashboard";

export default function ({
    value,
    onChange,
    min = 0,
    max = Infinity,
    step = 1,
}) {
    const [transpose, setTranspose] = useState('')
    const [fixed, setFixed] = useState(false)
    const main = useMain()
    const clamp = (val) => Math.min(max, Math.max(min, val));

    const handleInputChange = (e) => {
        const num = Number(e.target.value);
        if (!isNaN(num)) onChange(clamp(num));
    };

    const increment = () => {
        main.changeTranspose(transpose + 1)
        setTranspose(prev => prev + 1)
    };
    const decrement = () => {
        main.changeTranspose(transpose - 1)
        setTranspose(prev => prev - 1)
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "background.paper",
                borderRadius: 2,
                px: 1,
            }}
        >
            <IconButton disabled={transpose === '' ? true : false} onClick={decrement} size="small">
                <RemoveIcon />
            </IconButton>

            <TextField
                disabled={fixed}
                value={transpose}
                onChange={ev => setTranspose(ev.target.value)}
                variant="standard"
                InputProps={{
                    disableUnderline: true,
                    inputProps: {
                        style: { textAlign: "center", width: 48 },
                    },
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const value = e.currentTarget.value; // 👈 directly here
                        // submit(value)
                        setTranspose(parseInt(ev.target.value))
                        
                        setFixed(true)
                    }
                }}
            />

            <IconButton disabled={transpose === '' ? true : false} onClick={increment} size="small">
                <AddIcon />
            </IconButton>
        </Box>
    );
}