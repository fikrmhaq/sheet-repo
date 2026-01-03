import { memo } from "react";
import Tooltip from "./Tooltip";
import { useMain } from "../pages/Dashboard";
import Notes from "./sheetcanvas/Notes";
import { getNoteColorAuto } from "../functions";

export default memo(() => {
    const main = useMain()
    return (
        <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
            <div className="flex max-w-[100%] flex-wrap text-2xl perspective-1000 m-10">
                {/* {main.sheet} */}
                {/* {JSON.stringify(main.displaySheet)} */}
                {
                    main.displaySheet.map((el, i) => {
                        let changed = main.noteChanges.find(c => c.i === el.i)
                        let note = changed ? changed.changes[changed.changes.length - 1] : el.note
                        if (Array.isArray(el)) {
                            return <div className="mr-6 mb-6 flex">
                                {
                                    el.map(x => {
                                        let changed = main.noteChanges.find(c => c.i === x.i)
                                        let note = changed ? changed.changes[changed.changes.length - 1] : x.note
                                        return (
                                            <Notes i={x.i} text={note} ><div className={`${changed ? 'border-b-2 border-yellow-400' : ''} ${getNoteColorAuto(note)}`}>{note}</div></Notes>
                                        )
                                    })
                                }
                            </div>
                        } else {
                            return (
                                <Notes i={el.i} text={note}>
                                    <div class={`mr-6 mb-6 ${changed ? 'border-b-2 border-yellow-400' : ''} ${getNoteColorAuto(note)}`}>{note}</div>
                                </Notes>
                            )

                        }
                    })
                }
            </div>
        </div>
    )
})