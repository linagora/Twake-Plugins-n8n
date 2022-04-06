import config from "config";
import fetch from "node-fetch";

export const getAccessToken = async (): Promise<string> => {
  const url = config.get("credentials.endpoint") + "/api/console/v1/login";
  const body = {
    id: config.get("credentials.id"),
    secret: config.get("credentials.secret"),
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data.resource.access_token.value;
};

export const parseJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    Buffer.from(base64, "base64")
      .toString()
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};
