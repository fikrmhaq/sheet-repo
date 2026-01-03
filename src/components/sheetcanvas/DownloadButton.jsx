import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import { ThemeProvider } from "@mui/material";
import { darkTheme, useMain } from "../../pages/Dashboard";
import { downloadTxt } from "../../functions";
import { stringifyVPSheet } from "../../functions/notes";

export default function DownloadButton() {
    const main = useMain()
    return (
        <ThemeProvider theme={darkTheme}>
            <button
            className="rounded-lg
    bg-purple-600
    px-5 py-2
    text-sm font-medium text-white
    shadow-md shadow-purple-900/40
    transition
    hover:bg-purple-500
    active:bg-purple-700
    focus:outline-none focus:ring-2 focus:ring-purple-500/60"
            onClick={() => downloadTxt('download.txt',stringifyVPSheet(main.displaySheet))}
                variant="contained"
            //   startIcon={}
            >
                <DownloadIcon />
            </button>
        </ThemeProvider>
    );
}