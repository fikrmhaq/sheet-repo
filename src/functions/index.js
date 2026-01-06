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

function saveSheet({ title, artist, transpose, sheet }) {
  if (!sheet) return;

  const stored = localStorage.getItem("songs");

  let songs = [];

  if (stored) {
    try {
      songs = JSON.parse(stored);
      if (!Array.isArray(songs)) songs = [];
    } catch {
      songs = [];
    }
  }

  const nextId =
    songs.length === 0
      ? 0
      : Math.max(...songs.map(s => s.id ?? -1)) + 1;

  const songEntry = {
    id: nextId,
    title,
    artist,
    transpose,
    sheet,     // keep string
    sheets: [], // empty array
  };

  songs.push(songEntry);

  localStorage.setItem("songs", JSON.stringify(songs));
}

function getSheet(id) {
  const check = localStorage.getItem('songs')
  if(check){
    let data = JSON.parse(check).find(el => el.id === id)
    return data
  }
  return null
}

function saveVersion(songId, { name, sheet }) {
  if (!sheet || !name) return;

  const stored = localStorage.getItem("songs");
  if (!stored) return;

  let songs;
  try {
    songs = JSON.parse(stored);
    if (!Array.isArray(songs)) return;
  } catch {
    return;
  }

  const song = songs.find(s => s.id === songId);
  if (!song) return;

  if (!Array.isArray(song.sheets)) {
    song.sheets = [];
  }

  const nextI =
    song.sheets.length === 0
      ? 0
      : Math.max(...song.sheets.map(v => v.i ?? -1)) + 1;

  song.sheets.push({
    i: nextI,
    name,
    sheet,
  });
  // console.log({name,sheet})
  localStorage.setItem("songs", JSON.stringify(songs));
}

function editVersion(songId, versionI, newSheet) {
  if (!newSheet) return;

  const stored = localStorage.getItem("songs");
  if (!stored) return;

  let songs;
  try {
    songs = JSON.parse(stored);
    if (!Array.isArray(songs)) return;
  } catch {
    return;
  }

  const song = songs.find(s => s.id === songId);
  if (!song || !Array.isArray(song.sheets)) return;

  const version = song.sheets.find(v => v.i === versionI);
  if (!version) return;

  version.sheet = newSheet;

  localStorage.setItem("songs", JSON.stringify(songs));
}

export {
  downloadTxt,
  getNoteColorAuto,
  saveSheet,
  getSheet,
  saveVersion,
  editVersion
}