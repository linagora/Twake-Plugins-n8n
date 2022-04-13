const defaultLanguage = "en";
const locales: any = {
  en: {
    workspace_key_1: "1. Start by creating an account on n8n: ",
    workspace_key_2:
      "2. Once on n8n create an account for Twake using this key:",
    workspace_key_info:
      "N8n will see the channels from the current opened workspace and current user.",
  },
  fr: {
    workspace_key_1: "1. Commencez par créer un compte sur n8n: ",
    workspace_key_2:
      "2. Une fois sur n8n créer un compte pour Twake en utilisant cette clé:",
    workspace_key_info:
      "N8n va voir les chaînes de l'espace de travail actuel et de l'utilisateur actuel.",
  },
};

export const t = (language: string, key: string, variables: string[] = []) => {
  let str = locales[language][key] || locales[defaultLanguage][key] || key;
  variables.forEach((v, i) => (str = str.replace("@" + (i + 1), v)));
  return str;
};
