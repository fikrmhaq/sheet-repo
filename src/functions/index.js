import { NOTE_COLORS } from "../constants";
import { countNotes } from "./notes";

function downloadTxt(filename = 'download.txt', content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getNoteColorAuto(value) {
  const count = countNotes(value);
  const level = Math.min(Math.max(count, 1), 5);

  return NOTE_COLORS[level];
}

export {
    downloadTxt,
    getNoteColorAuto
}