import { LanguageType } from "../../types";

import * as Countries from "i18n-iso-countries";
import EnglishCountries from "i18n-iso-countries/langs/en.json";
import FrenchCountries from "i18n-iso-countries/langs/fr.json";

import English from "./en.json";
import French from "./fr.json";
import { toPascalCase } from "./caseChanger";
import { setLanguage } from "../utils";

interface TranslateStringProps {
  text: string;
}

// Recursive Typings for nested JSON objects
type JsonRecord<T> = Record<string, T | string>;
interface Json extends JsonRecord<Json> {}

Countries.registerLocale(EnglishCountries);
Countries.registerLocale(FrenchCountries);

export const getCountryName = (
  country: string,
  language: LanguageType,
  optionString: string
) => {
  const code = Countries.getAlpha2Code(country, "en"); //TODO: Review our strategy for country name language localization
  const translatedCountryName = Countries.getName(code, language);
  const displayText = translatedCountryName
    ? translatedCountryName
    : Translate(optionString, [toPascalCase(country)]) || country;
  return displayText;
};

const recursiveFind = (object: any, keys: string[], index: number): string => {
  const key = keys[index];
  const nextObj = object[key];

  if (index + 1 === keys.length) {
    return nextObj;
  }
  return recursiveFind(nextObj, keys, index + 1);
};

let language: LanguageType = LanguageType.english;

export const setLanguageType = (newLanguage: LanguageType) => {
  setLanguage(newLanguage);
  language = newLanguage;
};

/**
 * Used to translate JSON based on language and return a string
 * @param text
 * @param specifier
 * @param substitution
 * @param addSpaces
 * @returns string
 */
export default function Translate(
  text: string,
  specifier: string[] | null = null,
  substitution: Record<string, string | number> | null = null,
  addSpaces: [boolean, boolean] | null = null
): string {
  const translationDictionary: Json =
    language === LanguageType.english ? (English as Json) : (French as Json);

  try {
    let translatedString = translationDictionary[text];

    if (!translatedString) {
      return specifier ? specifier[specifier.length - 1] : text;
    }

    if (specifier) {
      translatedString = recursiveFind(translatedString, specifier, 0);
    }

    if (substitution) {
      Object.keys(substitution).forEach((key) => {
        const value = substitution[key];
        const replace = new RegExp(key, "g");
        translatedString = (translatedString as string).replace(
          replace,
          `${value}`
        );
      });
    }

    if (addSpaces && addSpaces[0]) {
      translatedString = " " + translatedString;
    }

    if (addSpaces && addSpaces[1]) {
      translatedString += " ";
    }
    return translatedString as string;
  } catch (e) {
    return `No translation for string ${text}`;
  }
}

/**
 * Used to translate JSON based on language and return an object
 * @param text
 * @returns object
 */
export function TranslateObject(text: string): object {
  const translationDictionary: Json =
    language === LanguageType.english ? (English as Json) : (French as Json);

  try {
    return translationDictionary[text] as object;
  } catch (e) {
    return { error: `No translation object for string ${text}` };
  }
}
