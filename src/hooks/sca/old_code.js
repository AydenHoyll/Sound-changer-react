import { find } from "./utils";

const reverse = (s) => {
  let outs = "";
  for (let i = s.length - 1; i >= 0; i--) {
    outs += s.charAt(i);
  }
  return outs;
};

const ApplyRule = (inWord, index, sounds, categories) => {
  let outWord = "";

  let t = sounds[index].replace("→", "/");

  if (t.substr(0, 2) === "-*") {
    return inWord;
  }

  // Regular rules
  let thisRule = t.split("/");

  let gIx;
  let gLen = 0;
  let gCat;
  let catIndex = categories.reduce((acc, cat) => acc + cat[0], "");

  const rulesApplied = [];

  let i = 0;

  const AtSpace = (inWord, i, gIx) => {
    if (gIx === -1) {
      if (i === 0 || inWord.charAt(i - 1) === " ") return true;
    } else {
      if (i >= inWord.length || inWord.charAt(i) === " ") return true;
    }
    return false;
  };

  const CatSub = (repl, categories) => {
    let outs = "";
    let lastChar = "";

    for (let i = 0; i < repl.length; i++) {
      let ix = find(catIndex, repl.charAt(i));
      if (ix !== -1) {
        if (gCat < categories[ix].length) {
          lastChar = categories[ix].charAt(gCat);
          outs += lastChar;
        }
      } else if (repl.charAt(i) === "²") {
        outs += lastChar;
      } else {
        lastChar = repl.charAt(i);
        outs += lastChar;
      }
    }

    return outs;
  }

  const MatchCharOrCat = (inWordCh, tgtCh, categories) => {
    let ix = find(catIndex, tgtCh);
    if (ix !== -1) {
      return find(categories[ix], inWordCh) !== -1;
    } else {
      return inWordCh === tgtCh;
    }
  };

  const IsTarget = (tgt, inWord, i) => {
    if (find(tgt, "[") !== -1) {
      gLen = 0;
      let inBracket = false;
      let foundInside = false;
      for (let j = 0; j < tgt.length; j++) {
        if (tgt.charAt(j) === "[") {
          inBracket = true;
        } else if (tgt.charAt(j) === "]") {
          if (!foundInside) return false;
          i++;
          gLen++;
          inBracket = false;
        } else if (inBracket) {
          if (i >= inWord.length) return false;
          if (!foundInside) foundInside = tgt.charAt(j) === inWord.charAt(i);
        } else {
          if (i >= inWord.length) return false;
          if (tgt.charAt(j) !== inWord.charAt(i)) return false;
          i++;
          gLen++;
        }
      }
    } else {
      gLen = tgt.length;
      for (let k = 0; k < gLen; k++) {
        if (MatchCharOrCat(inWord.charAt(i + k), tgt.charAt(k)) === false)
          return false;
      }
      return true;
    }

    return true;
  }

  const Match = (inWord, tgt, env, categories) => {
    let optional = false;
    gIx = -1;

    for (let j = 0; j < env.length; j++) {
      switch (env.charAt(j)) {
        case "[":
          let found = false;
          for (j++; j < env.length && env.charAt(j) !== "]"; j++) {
            if (found) continue;
            let cx = find(catIndex, env.charAt(j));

            if (env.charAt(j) === "#") {
              found = AtSpace(inWord, i, gIx);
            } else if (cx !== -1) {
              if (find(categories[cx], inWord.charAt(i)) !== -1) {
                found = true;
                i++;
              }
            } else {
              found = i < inWord.length && env.charAt(j) === inWord.charAt(i);
              if (found) i++;
            }
          }
          if (!found && !optional) return false;
          break;
        case "(": // Start optional
          optional = true;
          break;
        case ")": // End optional
          optional = false;
          break;
        case "#": // Word boundary
          if (!AtSpace(inWord, i, gIx)) return false;
          break;
        case "²": // Degemination
          if (
            i === 0 ||
            i >= inWord.length ||
            inWord.charAt(i) !== inWord.charAt(i - 1)
          )
            return false;
          i++;
          break;
        case "…": {
          // Wildcard
          let tempGIx = gIx;
          let tempGCat = gCat;
          let tempGLen = gLen;
          let anyTruth = false;

          let newEnv = env.substr(j + 1, env.length - j - 1);

          for (let k = i; k < inWord.length && anyTruth === false; k++) {
            if (inWord[k] === " ") break;

            if (Match(inWord, k, tgt, newEnv)) {
              anyTruth = true;
            }
          }

          if (tempGIx !== -1) {
            gIx = tempGIx;
            gCat = tempGCat;
            gLen = tempGLen;
          }

          return anyTruth;
        }
        case "_": // Location of target
          gIx = i;
          if (tgt.length === 0) {
            gLen = 0;
            break;
          }

          if (i >= inWord.length) return false;

          let ix = find(catIndex, tgt.charAt(0));

          if (ix !== -1) {
            // target is a category
            gCat = find(categories[ix], inWord.charAt(i));
            if (gCat === -1) {
              return false;
            } else {
              gLen = tgt.length === 0 ? 0 : 1;
              if (tgt.length > 1) {
                let tLen = tgt.length - 1;
                if (!IsTarget(tgt.substr(1, tLen), inWord, i + 1)) return false;
                gLen += tLen;
              }
            }
            i += tgt.length;
          } else {
            if (!IsTarget(tgt, inWord, i)) return false;
            i += gLen;
          }
          break;
        default:
          let cont = i < inWord.length;

          if (cont) {
            cont = MatchCharOrCat(inWord.charAt(i), env.charAt(j), categories);
            if (cont) i++;
          }

          if (!optional && !cont) return false;
      }
    }

    return true;
  };

  while (i <= inWord.length && inWord.charAt(i) !== "‣") {
    if (Match(inWord, thisRule[0], thisRule[2], categories)) {
      let tgt = thisRule[0];
      let repl = thisRule[1];

      if (thisRule.length > 3) {
        // There's an exception
        let sLix = find(thisRule[3], "_");
        if (sLix !== -1) {
          let tGix = gIx;
          let tgLen = gLen;
          let tgCat = gCat;

          // How far before _ do we check?
          let brackets = false;
          let preCount = 0;

          for (let k = 0; k < sLix; k++) {
            switch (thisRule[3].charAt(k)) {
              case "[":
                brackets = true;
                break;
              case "]":
                brackets = false;
                preCount++;
                break;
              case "#":
                break;
              default:
                if (!brackets) preCount++;
            }
          }

          gIx = tGix;
          gLen = tgLen;
          gCat = tgCat;
        }
      }

      rulesApplied.push([sounds[index], outWord || inWord]);

      outWord = inWord.substr(0, gIx);

      if (repl.length > 0) {
        if (repl === "\\\\") {
          let found = inWord.substr(gIx, gLen);
          outWord += reverse(found);
        } else if (gCat !== -1) {
          outWord += CatSub(repl, categories);
        } else {
          outWord += repl;
        }
      }
      gIx += gLen;
      i = outWord.length;

      if (tgt.length === 0) i++;

      outWord += inWord.substr(gIx, inWord.length - gIx);

      inWord = outWord;
    } else {
      i++;
    }
  }

  if (outWord !== "") return [outWord, rulesApplied];
  else return [inWord, rulesApplied];
};

export const Transform = (inWord, sounds, categories) => {
  let word = inWord;
  let rulesApplied = [];

  if (word.length > 0) {
    for (let i = 0; i < sounds.length; i++) {
      const [result, rules] = ApplyRule(word, i, sounds, categories);
      word = result;

      if (rules.length) {
        rulesApplied.push(...rules);
      }
    }
  }

  return {
    was: inWord,
    became: word,
    rulesApplied,
  };
};
