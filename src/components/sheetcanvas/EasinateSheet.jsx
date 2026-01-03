import { Input, InputBase, TextField, ThemeProvider } from "@mui/material";
import { memo, useState } from "react";
import { darkTheme, useMain } from "../../pages/Dashboard";

export default memo(() => {
    const [max, setMax] = useState(2)
    const main = useMain()
    return (
        <ThemeProvider theme={darkTheme}>
            <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <TextField
                    label="Easinate"
                    value={max}
                    inputProps={{
                        inputMode: "numeric",
                        pattern: "-?[0-9]*", // allows negative integers
                    }}
                    onChange={(e) => {
                        const value = e.target.value;

                        // allow empty (so user can delete)
                        if (value === "" || /^-?\d+$/.test(value)) {
                            setMax(value);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();

                            if (max === "" || max === "-") return;

                            main.onEasinate(parseInt(max, 10));
                        }
                    }}
                />
            </div>
        </ThemeProvider>
    )
})