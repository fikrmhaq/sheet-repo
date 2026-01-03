function easinateVPSheet(sheet, maxSize = 2) {
  return sheet.replace(/\[([^\]]+)\]/g, (_, chord) => {
    // Leave small chords untouched
    if (chord.length <= maxSize) return `[${chord}]`;

    // NEW: single-note reduction
    if (maxSize === 1) {
      return `[${chord[0]}]`;
    }

    // Original behavior (unchanged)
    if (maxSize === 2) {
      return `[${chord[0]}${chord[chord.length - 1]}]`;
    }

    // Extended behavior: first + low inner notes + last
    const first = chord[0];
    const last = chord[chord.length - 1];
    const middle = chord.slice(1, -1);

    const extra = middle.slice(0, maxSize - 2);

    return `[${first}${extra}${last}]`;
  });
}

export default easinateVPSheet