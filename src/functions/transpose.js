import { VP_KEYS } from "../constants";

function transposeNote(note, semitone, keyOrder) {
  const idx = keyOrder.indexOf(note);
  if (idx === -1) return note; // rests, symbols, etc.

  const next = idx + semitone;
  if (next < 0 || next >= keyOrder.length) return note;

  return keyOrder[next];
}

function transposeToken(token, semitone, keyOrder) {
  return token.replace(/[^\[\]\-]/g, ch =>
    transposeNote(ch, semitone, keyOrder)
  );
}

function transposeVPSheet(data, semitone, keyOrder = VP_KEYS) {
  if (semitone < -12 || semitone > 12) {
    throw new RangeError("Transpose must be between -12 and 12");
  }

  return data.map(item => {

    // single token
    if (!Array.isArray(item)) {
      return {
        ...item,
        note: transposeToken(item.note, semitone, keyOrder)
      };
    }

    // grouped token
    return item.map(n => ({
      ...n,
      note: transposeToken(n.note, semitone, keyOrder)
    }));

  });
}

export {
    transposeVPSheet,
    transposeNote,
    transposeToken
}