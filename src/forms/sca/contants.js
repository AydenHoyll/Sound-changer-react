export const INITIAL_VALUES = {
  categories: [
    "V=aeiou",
    "L=āēīōū",
    "C=ptcqbdgmnlrhs",
    "F=ie",
    "B=ou",
    "S=ptc",
    "Z=bdg",
    "",
    "",
  ],
  rules: ["lh|lj", "", "", "", "", "", "", "", ""],
  sounds: [
    "[sm]//_#",
    "i/j/_V",
    "L/V/_",
    "e//Vr_#",
    "v//V_V",
    "u/o/_#",
    "gn/nh/_",
    "S/Z/V_V",
    "c/i/F_t",
    "c/u/B_t",
    "p//V_t",
    "ii/i/_",
    "e//C_rV",
  ],
  lexicon: "lector\ndoctor\nfocus\njocus\ndistrictus",
  outputFormat: "default",
};

export const FORM_INPUTS = [
  {
    title: "Categories",
    name: "categories",
    placeholder: "ex. V=aeiou",
  },
  {
    title: "Sound changes",
    name: "sounds",
    placeholder: "ex. [sm]//_#",
  },
  {
    title: "Rewrite rules",
    name: "rules",
    placeholder: "ex. lh|lj",
  },
];
