import { VP_KEYS } from "../constants";

function formatSheet(text) {
    return text
        .replace(/\r\n/g, "\n")
        .replace(/\t/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function parseNotes(text) {
    const clean = formatSheet(text);

    const tokens = [];
    let buffer = "";
    let inBracket = false;

    for (const char of clean) {
        if (char === "[") {
            if (buffer) {
                tokens.push(buffer.length === 1 ? buffer : buffer.split(""));
                buffer = "";
            }
            inBracket = true;
            buffer = "[";
        }
        else if (char === "]") {
            buffer += "]";
            tokens.push(buffer);     // keep [plxn] as full string
            buffer = "";
            inBracket = false;
        }
        else if (inBracket) {
            buffer += char;
        }
        else if (char === " ") {
            if (buffer) {
                tokens.push(buffer.length === 1 ? buffer : buffer.split(""));
                buffer = "";
            }
        }
        else {
            buffer += char;
        }
    }

    // flush remaining
    if (buffer) {
        tokens.push(buffer.length === 1 ? buffer : buffer.split(""));
    }

    return tokens;
}

function stringifyVPSheet(data) {
    return data.map(item => {

        // Single token
        if (!Array.isArray(item)) {
            return item.note;
        }

        // Grouped token
        return item.map(n => n.note).join("");

    }).join(" ");
}

function displaySheet(sheet) {
    const notes = parseNotes(sheet);

    var index = 0
    var note_construct = []

    for (let i = 0; i < notes.length; i++) {
        // console.log(i)
        if (Array.isArray(notes[i])) {
            let construct = []
            for (let j = 0; j < notes[i].length; j++) {
                construct.push({ i: index, note: notes[i][j] })
                index++
            }
            note_construct.push(construct)
        } else {
            note_construct.push({ i: index, note: notes[i] })
            index++
        }
    }
    console.log(note_construct)
    // console.log('construct_stringify', stringifyVPSheet(note_construct))
    return note_construct
}

function noteUpdate(prev, key, cursorPos) {
    const isWrapped = prev.startsWith("[") && prev.endsWith("]");
    const isSingleNote =
        prev.length === 1 && VP_KEYS.includes(prev);

    // 1️⃣ block invalid keys (except Backspace)
    if (
        key !== "Backspace" &&
        key !== "[" &&
        key !== "]" &&
        !VP_KEYS.includes(key)
    ) {
        return prev;
    }

    // 2️⃣ single-note → auto-convert to chord on VP key
    if (isSingleNote && VP_KEYS.includes(key)) {
        if (key === prev) return prev;

        const ordered = [prev, key]
            .sort((a, b) => VP_KEYS.indexOf(a) - VP_KEYS.indexOf(b))
            .join("");

        return `[${ordered}]`;
    }

    // 3️⃣ single-note → ignore brackets
    if (isSingleNote && (key === "[" || key === "]")) {
        return prev;
    }

    // 4️⃣ wrap logic (only allowed if not single note)
    if ((key === "[" || key === "]") && !isWrapped) {
        return `[${prev}]`;
    }

    // 5️⃣ ⌫ Backspace (cursor-aware, wrapped only)
    if (key === "Backspace") {
        if (!isWrapped) return prev;

        const contentStart = 1;
        const contentEnd = prev.length - 1;

        if (cursorPos <= contentStart || cursorPos > contentEnd) {
            return prev;
        }

        const content = prev.slice(1, -1);
        const deleteIndex = cursorPos - contentStart - 1;

        if (deleteIndex < 0 || deleteIndex >= content.length) {
            return prev;
        }

        const newContent =
            content.slice(0, deleteIndex) +
            content.slice(deleteIndex + 1);

        if (newContent.length === 0) return "";
        if (newContent.length === 1) return newContent;

        return `[${newContent}]`;
    }

    // 6️⃣ block adding unless wrapped
    if (!isWrapped) {
        return prev;
    }

    // 7️⃣ add key to chord
    const content = prev.slice(1, -1);
    if (content.includes(key)) return prev;

    const ordered = [...content, key]
        .sort((a, b) => VP_KEYS.indexOf(a) - VP_KEYS.indexOf(b))
        .join("");

    return `[${ordered}]`;
}

function applyLatestChanges(arr1, arr2) {
    // build lookup: i -> last change
    const changeMap = new Map(
        arr2.map(({ i, changes }) => [i, changes.at(-1)])
    );

    return arr1.map(item => {
        // case 1: single note object
        if (!Array.isArray(item)) {
            if (changeMap.has(item.i)) {
                return {
                    ...item,
                    note: changeMap.get(item.i),
                };
            }
            return item;
        }

        // case 2: chord (array of notes)
        return item.map(noteObj => {
            if (changeMap.has(noteObj.i)) {
                return {
                    ...noteObj,
                    note: changeMap.get(noteObj.i),
                };
            }
            return noteObj;
        });
    });
}

function countNotes(value) {
    if (!value) return 0;

    // chord
    if (value.startsWith("[") && value.endsWith("]")) {
        return value.slice(1, -1).length;
    }

    // single note
    return 1;
}


export {
    displaySheet,
    parseNotes,
    formatSheet,
    stringifyVPSheet,
    noteUpdate,
    applyLatestChanges,
    countNotes
}