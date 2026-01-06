import { DIFFICULTY_NAMES } from "../constants";
import { countNotes } from "./notes";

function tokenizeSheet(sheet) {
  if (!sheet) return [];

  return sheet
    .split(/\s+/)
    .filter(Boolean);
}

function parseSheet(sheet) {
  const tokens = tokenizeSheet(sheet);

  return tokens.map((token) => ({
    value: token,
    chordSize: countNotes(token),
  }));
}

// function calculateVpDifficulty(sheet) {
//   const events = parseSheet(sheet);
//   if (events.length === 0) return 0;

//   let chordPower = 0;
//   let maxChord = 0;
//   let varianceSum = 0;

//   for (const e of events) {
//     chordPower += Math.pow(e.chordSize, 2.1);
//     maxChord = Math.max(maxChord, e.chordSize);
//   }

//   const avgChord = chordPower / events.length;

//   for (const e of events) {
//     varianceSum += Math.pow(e.chordSize - avgChord, 2);
//   }

//   const chordVariance = Math.sqrt(varianceSum / events.length);

//   // Extremely strong length compression
//   const density = Math.log(events.length + 1);

//   // 🔻 Strongly compressed base
//   const base =
//     Math.pow(chordPower, 0.65) *
//     Math.pow(density, 0.18);

//   // 🔥 Peak & volatility preserved
//   const peakMultiplier =
//     1 +
//     Math.log2(maxChord + 1) * 0.28 +
//     Math.log2(chordVariance + 1) * 0.40;

//   // 🔻 Smaller final scale
//   const stars =
//     Math.log10(base + 1) * 1.35 * peakMultiplier;

//   return Number(stars.toFixed(2));
// }
function calculateVpDifficulty(sheet) {
  const events = parseSheet(sheet);
  if (events.length === 0) return 0;

  let chordPower = 0;
  let maxChord = 0;
  let varianceSum = 0;

  let chordDistanceScore = 0;
  let lastChordIndex = -1;

  let chainChordSizes = [];
  let chainDistances = [];

  for (let i = 0; i < events.length; i++) {
    const e = events[i];

    // Basic chord power
    chordPower += Math.pow(e.chordSize, 2.1);
    maxChord = Math.max(maxChord, e.chordSize);

    if (e.chordSize > 1) {
      // Distance contribution
      if (lastChordIndex >= 0) {
        const distance = i - lastChordIndex - 1;
        chordDistanceScore += Math.pow(e.chordSize, 1.5) * (2 / (distance + 1));

        chainChordSizes.push(e.chordSize);
        chainDistances.push(distance);
      } else {
        chainChordSizes.push(e.chordSize);
        chainDistances.push(0);
      }

      lastChordIndex = i;
    } else {
      // Reset chain if distance too big
      if (chainDistances.length > 0 && chainDistances[chainDistances.length - 1] > 3) {
        chainChordSizes = [];
        chainDistances = [];
      }
    }
  }

  // Chain bonus
  let chainBonus = 0;
  if (chainChordSizes.length > 1) {
    const sumChordSizes = chainChordSizes.reduce((a, b) => a + b, 0);
    const avgDistance = chainDistances.reduce((a, b) => a + b, 0) / chainDistances.length;
    chainBonus = Math.pow(sumChordSizes, 1.3) * Math.log2(chainChordSizes.length + 1) * (1 / (avgDistance + 1));
  }

  // Chord variance
  const avgChord = chordPower / events.length;
  for (const e of events) {
    varianceSum += Math.pow(e.chordSize - avgChord, 2);
  }
  const chordVariance = Math.sqrt(varianceSum / events.length);

  // Density
  const density = Math.log(events.length + 1);

  // Base stars
  const base = Math.pow(chordPower, 0.65) * Math.pow(density, 0.18);

  // Peak multiplier
  const peakMultiplier =
    1 +
    Math.log2(maxChord + 1) * 0.28 +
    Math.log2(chordVariance + 1) * 0.40;

  // Distance + chain factor (additive)
  const distanceFactor = Math.log10(chordDistanceScore + 1) * 0.25 + Math.log10(chainBonus + 1) * 0.3;

  // Final stars
  let stars = Math.log10(base + 1) * 1.35 * peakMultiplier + distanceFactor;

  // 🔹 Scale down to reduce magnitude
  stars *= 0.5; // adjust factor to taste, e.g., 0.5, 0.6, etc.

  return Number(stars.toFixed(2));
}
function easinateChordOnce(chord, minSize = 2) {
  if (chord.length <= minSize) return chord;

  // Remove one inner note (closest to center)
  const middleStart = 1;
  const middleEnd = chord.length - 1;
  const middle = chord.slice(middleStart, middleEnd);

  if (middle.length <= 0) return chord;

  // Remove the last inner note (stable & predictable)
  const newMiddle = middle.slice(0, -1);

  return chord[0] + newMiddle + chord[chord.length - 1];
}

function easinateSheetOnce(sheet, minChordSize = 2) {
  return sheet.replace(/\[([^\]]+)\]/g, (_, chord) => {
    const eased = easinateChordOnce(chord, minChordSize);
    return `[${eased}]`;
  });
}

function genEasy(sheet, minChordSize = 2) {
  const versions = [];
  let current = sheet;

  while (true) {
    const next = easinateSheetOnce(current, minChordSize);

    // Stop if nothing changes
    if (next === current) break;

    versions.push(next);
    current = next;
  }

  return versions;
}

function generateEasinatedDifficultyTiers(sheet, options) {
  options = options || {};

  const minChordSize = options.minChordSize ?? 2;
  const minStarDrop = options.minStarDrop ?? 0.35;
  const maxVersions = options.maxVersions ?? 6;

  const rawVersions = genEasy(sheet, minChordSize);

  const tiers = [];
  let lastDifficulty = calculateVpDifficulty(sheet);

  for (const version of rawVersions) {
    const diff = calculateVpDifficulty(version);
    const drop = lastDifficulty - diff;

    if (drop >= minStarDrop) {
      tiers.push({
        sheet: version,
        difficulty: diff
      });
      lastDifficulty = diff;
    }

    if (tiers.length >= maxVersions) break;
  }

  return tiers;
}

function nameDifficultyTier(index) {
  if (index < DIFFICULTY_NAMES.length) {
    return DIFFICULTY_NAMES[index];
  }

  // beyond Insane → Insane++, Insane+++, ...
  const extra = index - (DIFFICULTY_NAMES.length - 1);
  return "Insane" + "+".repeat(extra);
}

function getDifficultyName(stars) {
  if (stars < 3) return "Easy";
  if (stars < 3.5) return "Easy++";
  if (stars < 4.5) return "Normal";
  if (stars < 5) return "Normal++";
  if (stars < 5.5) return "Hard";
  if (stars < 6) return "Hard++";
  if (stars < 6.5) return "Super Hard";
  if (stars < 7) return "Super Hard++";
  if (stars < 9) return "Insane";
  return "Insane++";
}


export {
    calculateVpDifficulty,
    genEasy,
    generateEasinatedDifficultyTiers,
    nameDifficultyTier,
    getDifficultyName
}