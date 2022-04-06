const defaultLanguage = "en";
const locales: any = {
  en: {
    workspace_key: "Here is your workspace key :",
  },
  fr: {
    workspace_key: "Voici votre clé de workspace :",
  },
};

export const t = (language: string, key: string, variables: string[] = []) => {
  let str = locales[language][key] || locales[defaultLanguage][key] || key;
  variables.forEach((v, i) => (str = str.replace("@" + (i + 1), v)));
  return str;
};
