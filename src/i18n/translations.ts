import en from "./en.json";
import pt from "./pt.json";

const frKeys = Object.keys(en);
const enKeys = Object.keys(pt);

if (frKeys.length !== enKeys.length) {
  throw "The number of i18n keys on each language file are not matching.";
}

for (const key of frKeys) {
  if (!enKeys.includes(key)) {
    throw `The i18n key ${key} is not included on all translation files.`;
  }
}

export default {
  en,
  pt,
};
