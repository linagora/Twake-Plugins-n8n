import fetch from "node-fetch";
import { ChannelType, HookEvent, N8nHeadersEvent } from "./types";
import { getAccessToken, parseJwt } from "./utils";
import { formateN8nMessage, generateConfig } from "./messages";
import config from "config";
import jwt from "jsonwebtoken";

export const cancel = async (event: HookEvent) => {
  const deletedMessage = event.content.message;
  deletedMessage.subtype = "deleted";
  deletedMessage.id = undefined;
  await sendMessage(deletedMessage, {
    company_id: event.content.message.context.company_id,
    workspace_id: event.content.message.context.workspace_id,
    channel_id: event.content.message.context.channel_id,
    thread_id: event.content.message.context.thread_id,
  });
};

export const sendN8nMessage = async (body: any, headers: any) => {
  const jwtFromN8n = headers.authorization.split(" ")[1];
  const company_id = parseJwt(jwtFromN8n).company_id;
  const workspace_id = parseJwt(jwtFromN8n).workspace_id;
  const msg = {
    subtype: "application",
    blocks: formateN8nMessage(body.object.content.formatted),
    override: {
      title: body.object.hidden_data.custom_title
        ? body.object.hidden_data.custom_title
        : undefined,
      picture: body.object.hidden_data.custom_icon
        ? body.object.hidden_data.custom_icon
        : undefined,
    },
  };
  await sendMessage(msg, {
    company_id: company_id,
    workspace_id: workspace_id,
    channel_id: body.object.channel_id,
  });
};

export const createKey = async (event: HookEvent) => {
  const jwtPayload = {
    workspace_id: event.workspace_id,
    company_id: event.company_id,
  };

  const token = jwt.sign(jwtPayload, config.get("n8n.jwt_secret"));

  const form = generateConfig(event.content.user, token);

  await createConfigurator(form, {
    user_id: event.user_id || "",
    connection_id: event.connection_id || "",
  });
};

const createConfigurator = async (
  form: any,
  options: {
    user_id: string;
    connection_id: string;
  }
) => {
  const url = config.get("credentials.endpoint") + "/api/console/v1/configure";

  const data = {
    user_id: options.user_id,
    connection_id: options.connection_id,

    form: form,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify(data),
    });
    const t = await res.json();
    console.log("t", t);
    return t;
  } catch (err) {
    console.log("err", err);
    return null;
  }
};

export const listChannels = async (event: N8nHeadersEvent) => {
  const jwtFromN8n = event.authorization.split(" ")[1];
  const company_id = parseJwt(jwtFromN8n).company_id;
  const workspace_id = parseJwt(jwtFromN8n).workspace_id;

  const url =
    config.get("credentials.endpoint") +
    `/api/channels/v1/companies/${company_id}/workspaces/${workspace_id}/channels`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });
    return await res.json().then((data: any) => {
      const activeChannels = data.resources.filter((channel: ChannelType) => {
        return channel.stats ? channel.stats.members > 0 : channel.id;
      });
      const channelsInfoTosend: ChannelType[] = [];
      activeChannels.forEach((channel: ChannelType) => {
        channelsInfoTosend.push({
          company_id: channel.company_id,
          workspace_id: channel.workspace_id,
          owner: channel.owner,
          name: channel.name,
          id: channel.id,
          icon: channel.icon,
        });
      });
      return channelsInfoTosend;
    });
  } catch (err) {
    console.log("err", err);
    return null;
  }
};

//Send message
const sendMessage = async (
  message: any,
  options: {
    company_id: string;
    workspace_id: string;
    channel_id: string;
    thread_id?: string;
  }
) => {
  const url =
    config.get("credentials.endpoint") +
    (options.thread_id
      ? `/api/messages/v1/companies/${options.company_id}/threads/${options.thread_id}/messages`
      : `/api/messages/v1/companies/${options.company_id}/threads`);

  let data: any = {
    resource: message,
  };
  if (!options.thread_id) {
    data = {
      resource: {
        participants: [
          {
            type: "channel",
            id: options.channel_id,
            company_id: options.company_id,
            workspace_id: options.workspace_id,
          },
        ],
      },
      options: {
        message,
      },
    };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json().then((data: any) => {
      const resourceResponseTosend: any = [];

      resourceResponseTosend.push(data.resource);
    });
  } catch (err) {
    console.log("err", err);
    return null;
  }
};
