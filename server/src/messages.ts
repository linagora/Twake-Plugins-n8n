import { HookEvent } from "./types";
import { t } from "./i18n";

export const generateConfig = (
  user: HookEvent["content"]["user"],
  jwt: any
) => {
  const lang = user?.preferences.locale || "";
  return [
    {
      type: "system",
      content: t(lang, "workspace_key"),
    },
    {
      type: "copiable",
      user_identifier: true,
      content: jwt,
    },
  ];
};

export const formateN8nMessage = (content: string) => {
  return [
    {
      type: "twacode",
      elements: [
        {
          type: "compile",
          content: content,
        },
      ],
    },
  ];
};
