import { useState } from "react";
import {
  checkCategoriesToBeValid,
  checkSoundsToBeValid,
  cookResult,
  formatByRules,
} from "./utils";

export const useSca = () => {
  const [result, setResult] = useState([]);
  const [transformed, setTransformed] = useState([]);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    categories: "",
    validSounds: 0,
    words: [0, 0],
  });

  const changeSummary = (newPart) => {
    setSummary({
      ...summary,
      ...newPart,
    });
  };

  const calc = (form) => {
    const categories = formatByRules(form, form.categories);
    const isCategoriesValid = checkCategoriesToBeValid(categories);

    if (!isCategoriesValid) {
      return setError(
        "Categories must be of the form V=aeiou That is, a single letter, an equal sign, then a list of possible expansions."
      );
    }

    const sounds = formatByRules(form, form.sounds);
    const isSoundsValid = checkSoundsToBeValid(sounds);

    if (!isSoundsValid) {
      return setError(
        "There are no valid sound changes, so no output can be generated. Rules must be of the form s1/s2/e1_e2. The strings are optional, but the slashes are not."
      );
    }

    const lexicon = formatByRules(form, [form.lexicon], true);

    const [result, words, transformed] = cookResult(
      form,
      categories,
      sounds,
      lexicon
    );

    changeSummary({
      words,
      validSounds: sounds.length,
      categories: categories.reduce((acc, cat) => acc + cat[0], ""),
    });

    setTransformed(transformed);
    setResult(result);
  };

  return {
    calc,
    result,
    error,
    summary,
    transformed,
  };
};
