import express from "express";
import config from "config";
import { HookEvent, N8nBodyEvent, N8nHeadersEvent } from "./types";
import { createKey, listChannels, sendN8nMessage } from "./events";

const prefix =
  "/" +
  ((config.get("server.prefix") || "") as string).replace(/(^\/|\/$)/g, "");

const app = express();
app.use(express.json());

app.use(prefix + "/assets", express.static(__dirname + "/../assets"));

// Entrypoint for every events comming from Twake
app.post(prefix + "/hook", async (req, res) => {
  const event = req.body as HookEvent;

  if (
    (event.type === "action" && event.name === "open") ||
    (event.type === "configuration" && event.name === "workspace")
  ) {
    //Open configurator with Twake API key for n8n
    return res.send(await createKey(event));
  }

  res.send({ error: "Not implemented" });
});

app.post(prefix + "/channel", async (req, res) => {
  const event = req.headers as N8nHeadersEvent;
  return res.send(await listChannels(event));
});

app.post(prefix + "/actions/message/save", async (req, res) => {
  const event_body = req.body as N8nBodyEvent;
  const event_headers = req.headers as N8nHeadersEvent;

  await sendN8nMessage(event_body, event_headers);

  return res.send({ object: "ok" });
});

const port = config.get("server.port");
app.listen(port, (): void => {
  console.log(`Plugin started on port ${port}`);
});
