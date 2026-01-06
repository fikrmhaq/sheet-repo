import { useEffect, useState } from "react";
import { calculateVpDifficulty } from "../../functions/sheetdifficulty";
import { useMain } from "../../pages/Dashboard";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { IconButton } from "@mui/material";
import MoreActionsMenu from "../MoreActionsMenu";

export default function SongListItem({
    title,
    artist,
    songs = [],
    id,
    name,
    onAddVersion,
    onEditSheet,
    onDeleteSheet
}) {
    const [open, setOpen] = useState(false);
    const main = useMain()

    useEffect(() => {
        // console.log('songs', songs)
    }, [])

    return (
        <li className="mb-1 last:mb-0">
            {/* Header */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-full text-left focus:outline-none"
            >
                <div
                    className={`flex items-center justify-between px-3 py-2 rounded-lg
            bg-gradient-to-r
            transition-colors duration-200
            ${open
                            ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                            : "from-transparent to-transparent"
                        }
          `}
                >
                    <div className="flex items-center min-w-0">
                        {/* Icon */}
                        <svg
                            className={`shrink-0 fill-current ${open
                                ? "text-violet-500"
                                : "text-gray-400 dark:text-gray-500"
                                }`}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                        >
                            <path d="M5.936.278A7.983 7.983 0 0 1 8 0a8 8 0 1 1-8 8c0-.722.104-1.413.278-2.064a1 1 0 1 1 1.932.516A5.99 5.99 0 0 0 2 8a6 6 0 1 0 6-6c-.53 0-1.045.076-1.548.21A1 1 0 1 1 5.936.278Z" />
                            <path d="M6.068 7.482A2.003 2.003 0 0 0 8 10a2 2 0 1 0-.518-3.932L3.707 2.293a1 1 0 0 0-1.414 1.414l3.775 3.775Z" />
                        </svg>

                        {/* Title + Artist */}
                        <div className="ml-4 min-w-0">
                            <div className="text-sm font-medium truncate text-gray-800 dark:text-gray-100">
                                {title}
                            </div>
                            <div className="text-xs truncate text-gray-500 dark:text-gray-400">
                                {artist}
                            </div>
                        </div>
                    </div>

                    {/* Chevron */}
                    {/* <IconButton onClick={() => onAddVersion(id)}>
                        <PlaylistAddIcon fontSize="small" className="text-gray-400" />
                    </IconButton> */}
                    <MoreActionsMenu onAdd={() => onAddVersion(id)} onEdit={() => onEditSheet()} onDelete={() => onDeleteSheet()} />
                    {/* <svg
                        className={`w-3 h-3 fill-current text-gray-400 dark:text-gray-500
              transition-transform duration-300
              ${open ? "rotate-180" : ""}
            `}
                        viewBox="0 0 12 12"
                    >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                    </svg> */}
                </div>
            </button>

            {/* Dropdown */}
            <div
                className={`pl-9 mt-1 space-y-1 overflow-hidden
          transition-all duration-300 ease-in-out
          ${open
                        ? "max-h-96 opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-1"
                    }
        `}
            >
                {songs.map((song, idx) => (
                    <div className="flex items-center">
                        <button
                            key={idx}
                            type="button"
                            onClick={() => main.showSheet({ id, i: song.i, sheet: song.sheet })}
                            className="group w-full text-left rounded-md px-2 py-1
              text-sm truncate transition-all duration-150
              text-gray-500/90 dark:text-gray-400
              hover:text-gray-700 dark:hover:text-gray-200
              hover:bg-violet-500/[0.06] dark:hover:bg-violet-500/[0.12]"
                        >
                            <div className="flex items-center">
                                <div className="group-hover:text-violet-500">
                                    <p>{![undefined, null, ''].includes(song.name) ? song.name : song.difficulty}</p>
                                    {song.type === 0 && <p className="text-[10px]">Original</p>}
                                </div>
                                <div className="ml-2 text-xs opacity-60">
                                    ({calculateVpDifficulty(song.sheet)}★)
                                </div>
                            </div>
                        </button>
                    </div>
                ))}

            </div>
        </li>
    );
}