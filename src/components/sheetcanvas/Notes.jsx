import * as React from "react";
import {
  Popover,
  Box,
  Card,
  CardContent,
  Typography,
  InputBase,
  Button,
  ThemeProvider,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { darkTheme, useMain } from "../../pages/Dashboard";
import { noteUpdate } from "../../functions/notes";
import ChangeHistory from "./ChangeHistory";

export default function ({ children, text, i }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const main = useMain()
  const [value, setValue] = React.useState(text)


  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setValue(text)
  };

  React.useEffect(() => {
    let change = main.noteChanges.find(el => el.i === i)
    if(change){
      setValue(change.changes[change.changes.length - 1])
    }
  }, [main.noteChanges])

  const submitValue = () => {
    // if (!main.noteChanges.map(el => el.i).includes(i)) {
    //   main.setNoteChanges({ i, change: text })
    //   setTimeout(() => {
    //     main.setNoteChanges({ i, change: value })
    //   }, 1000)
    // } else {
    //   main.setNoteChanges({ i, change: value })
    // }
    main.setNoteChanges({ i, change: value })
    setAnchorEl(null);
  }

  // React.useEffect(() => {
  //   setValue(text)
  // }, [])

  let note_count = text.split('').includes('[') ? text.split('').filter(el => !['[', ']'].includes(el)).length : 1

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          //   px: 1,
          py: 1,
          bgcolor: "background.transparent",
          borderRadius: 1,
          display: "inline-block",
        }}
      >
        {children}
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Card sx={{ width: 260 }}>
          <CardContent>
            <div className="flex justify-between">
              <InputBase
                sx={{
                  fontSize: "20px", // affects the input text
                }}
                value={value}
                onKeyDown={ev => {
                  // if(value === null) {
                  //   setValue(ev.target.value)
                  //   return
                  // }

                  setValue(noteUpdate(value, ev.key, ev.currentTarget.selectionStart))
                }}
              />
              <IconButton
                aria-label="more options"
                size="small"
              >
                {note_count}
              </IconButton>
            </div>
            {/* <Typography variant="h6">Title</Typography> */}
            <Typography variant="body2" color="text.secondary">
              {main.noteChanges.map(el => el.i).includes(i) ? (
                <ChangeHistory changes={main.noteChanges.find(el => el.i === i).changes} />
                // <div>
                //   {
                //     main.noteChanges.find(el => el.i === i).changes.map((x, index) => {
                //       return (
                //         <div>
                //           {index !== 0 && '->'}
                //           {x}
                //         </div>
                //       )
                //     })
                //   }
                // </div>
              ) : 'No changes yet.'}
            </Typography>
            <div className="flex justify-end" >
              {
                ![null, text].includes(value) &&
                <button
                  class="
    rounded-full
    bg-purple-600
    px-5 py-2
    text-sm font-medium text-white
    shadow-md shadow-purple-900/40
    transition
    hover:bg-purple-500
    active:bg-purple-700
    focus:outline-none focus:ring-2 focus:ring-purple-500/60
  "
                  onClick={submitValue}
                >Save</button>

              }
            </div>
          </CardContent>
        </Card>
      </Popover>
    </ThemeProvider>
  );
}