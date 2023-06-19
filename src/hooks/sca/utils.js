import { Transform } from "./old_code";

export const find = (word, searchPart) => {
  for (let i = 0; i < word.length; i++) {
    if (word.charAt(i) === searchPart) {
      return i;
    }
  }
  return -1;
};

export const formatByRules = (form, fields, isLexicon) => {
  const rules = [...form.rules].filter((item) => item);

  let result = [...fields];

  if (isLexicon) {
    result = result[0].split("\n");
  }

  result = result.filter((item) => item);

  for (let i = 0; i < rules.length; i++) {
    if (rules[i].length > 2 && find(rules[i], "|") !== -1) {
      let parse = rules[i].split("|");
      let regex = new RegExp(parse[0], "g");
      result = result.map((word) => word.replace(regex, parse[1]));
    }
  }

  return result;
};

// Checks if categories have wrong format
export const checkCategoriesToBeValid = (categories) => {
  return categories.every((cat) => cat.match(/^([a-zA-Z])(=)(.+)$/gm));
};

// Are we at a word boundary?
function AtSpace(inWord, i, gix) {
  if (gix === -1) {
    // Before _ this must match beginning of word
    if (i === 0 || inWord.charAt(i - 1) === " ") return true;
  } else {
    // After _ this must match end of word
    if (i >= inWord.length || inWord.charAt(i) === " ") return true;
  }
  return false;
}

// Take a string and apply the rewrite rules backwards
export const turnBackWord = (s, rev, rules, isRewriteOutputEnabled) => {
  if (!isRewriteOutputEnabled) return s;

  let nrew = rules.length;

  let p1 = rev ? 0 : 1;
  let p2 = rev ? 1 : 0;

  let result = s;

  for (let w = 0; w < nrew; w++) {
    if (rules[w].length > 2 && find(rules[w], "|") !== -1) {
      let parse = rules[w].split("|");
      let regex = new RegExp(parse[p1], "g");
      result = result.replace(regex, parse[p2]);
    }
  }

  return result;
};

// Checks if sounds have wrong format
export const checkSoundsToBeValid = (sounds) => {
  let w;
  let rul = [...sounds];
  let soundsLength = sounds.length;

  // Remove trailing returns
  for (w = 0; w < soundsLength; w++) {
    let t = rul[w];
    if (t.charCodeAt(t.length - 1) === 13) {
      rul[w] = t.substr(0, t.length - 1);
      t = rul[w];
    }

    // Intermediate results marker has to stay in rules
    if (t.substr(0, 2) === "-*") {
      continue;
    }

    // Sanity checks for valid rules
    let valid = t.length > 0 && find(t, "_") !== -1;
    if (valid) {
      let thisRule = t.split("/");
      valid =
        thisRule.length > 2 ||
        (thisRule.length === 2 && find(thisRule[0], "→") !== -1);
      if (valid) {
        if (thisRule[0].length === 0)
          valid = thisRule[1].length > 0 && thisRule[2] !== "_";
      }
    }

    // Invalid rules: move 'em all up
    if (!valid) {
      soundsLength--;
      for (let q = w; q < soundsLength; q++) {
        rul[q] = rul[q + 1];
      }
      w--;
    }
  }

  return Boolean(soundsLength !== 0);
};

export const cookResult = (form, categories, sounds, lexicon) => {
  const rules = [...form.rules].filter((item) => item);

  let nWord = 0;
  let nDiff = 0;
  let result = "";
  let lexiconLength = lexicon.length;

  const transformed = [];

  for (let w = 0; w < lexiconLength; w++) {
    let inWord = lexicon[w];

    // remove trailing blanks
    while (inWord.charCodeAt(inWord.length - 1) === 32) {
      inWord = inWord.substr(0, inWord.length - 1);
    }

    if (inWord.length > 0) {
      if (inWord.charCodeAt(inWord.length - 1) === 13) {
        inWord = inWord.substr(0, inWord.length - 1);
      }

      let inTerm = "";

      const afterTransformation = Transform(inWord, sounds, categories);

      transformed.push(afterTransformation);

      let ourWord = afterTransformation.became;
      let outs;

      let parts = inWord.split(" ‣");
      if (parts.length > 1) inWord = parts[0];

      switch (form.outputFormat) {
        case "default":
          outs = inTerm + ourWord;
          break;
        case "arrow":
          outs = inWord + " → " + inTerm + ourWord;
          break;
        case "words":
          outs = ourWord + " [" + inTerm + inWord + "]";
          break;
      }

      result +=
        turnBackWord(outs, false, rules, form.isRewriteOutputEnabled) + "\n";

      nWord++;
      if (inWord !== ourWord) nDiff++;
    }
  }

  return [result.split("\n"), [nWord, nDiff], transformed];
};
