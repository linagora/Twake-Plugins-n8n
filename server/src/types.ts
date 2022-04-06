export type HookEvent = {
  type: "action" | "interactive_message_action" | "hook" | "configuration";
  name?: string;
  connection_id?: string;
  company_id?: string;
  workspace_id?: string;
  user_id?: string;
  content: {
    command?: string;
    channel?: any;
    thread?: any;
    message?: any;
    user?: {
      preferences: {
        locale: string;
      };
      first_name: string;
      last_name: string;
    };
  };
};

export type ChannelType = {
  name: string;
  id: string;
  company_id: string;
  workspace_id: string;
  icon: string;
  owner: string;

  stats?: {
    members: number;
    messages: number;
  };
};

export type N8nBodyEvent = {
  object: {
    channel_id: string;
    content: {
      formatted: string;
    };
  };
};

export type N8nHeadersEvent = {
  authorization: string;
};
