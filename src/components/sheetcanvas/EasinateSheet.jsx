import { Input, InputBase, TextField, ThemeProvider } from "@mui/material";
import { memo, useState } from "react";
import { darkTheme, useMain } from "../../pages/Dashboard";

export default memo(() => {
    const [max, setMax] = useState(2)
    const main = useMain()
    return (
        <ThemeProvider theme={darkTheme}>
            <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
                <TextField label="Easinate"
                    onChange={ev => setMax(ev.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            const value = e.currentTarget.value; // 👈 directly here
                            main.onEasinate(parseInt(max))
                            // submit(value)
                        }
                    }}
                />
            </div>
        </ThemeProvider>
    )
})