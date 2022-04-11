# Twake-Plugins-N8n

n8n plugin for Twake

### Install

```
cd server
sudo docker run -dp 3001:3001 --restart unless-stopped -e SERVER_PREFIX='plugins/n8n' -e SERVER_PORT=3001 -e CREDENTIALS_ENDPOINT='https://canary.twake.app' n8n
```
