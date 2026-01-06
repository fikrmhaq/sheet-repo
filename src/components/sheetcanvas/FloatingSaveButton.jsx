import { IconButton, Tooltip } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

export default function FloatingSaveButton({ onClick }) {
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Tooltip title="Save">
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={onClick}
                        className="
          rounded-full
          bg-purple-600
         p-4
          text-sm font-medium text-white
          shadow-lg shadow-purple-900/50
          transition
          hover:bg-purple-500
          hover:-translate-y-0.5
          active:bg-purple-700
          active:translate-y-0
          focus:outline-none
          focus:ring-2
          focus:ring-purple-500/60
        "
                    >
                        <SaveIcon fontSize="large" />
                    </button>
                </div>
            </Tooltip>
        </div>
    );
}