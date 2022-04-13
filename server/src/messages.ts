import { HookEvent } from "./types";
import { t } from "./i18n";

export const generateConfig = (
  user: HookEvent["content"]["user"],
  jwt: any
) => {
  const lang = user?.preferences.locale || "";
  return [
    {
      type: "twacode",
      elements: [
        {
          type: "system",
          content: t(lang, "workspace_key_1"),
        },
        {
          type: "url",
          content: "https://n8n.io/",
          url: "https://n8n.io/",
        },
        {
          type: "br",
        },
        {
          type: "br",
        },
        {
          type: "system",
          content: t(lang, "workspace_key_2"),
        },
        {
          type: "copiable",
          user_identifier: true,
          content: jwt,
        },
        {
          type: "br",
        },
        {
          type: "system",
          content: t(lang, "workspace_key_info"),
        },
      ],
    },
  ];
};

export const formatN8nMessage = (content: string) => {
  try {
    const parsed = JSON.parse(content);
    if (parsed.twacode) {
      return [
        {
          type: "twacode",
          content: parsed.twacode,
        },
      ];
    } else if (parsed.blocks) {
      return parsed.blocks;
    }
  } catch (e) {}

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
