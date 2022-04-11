# Twake-Plugins-N8n

n8n plugin for Twake

### Install

```
sudo docker build -t n8n .
sudo docker run \
  --restart unless-stopped \
  -dp 3001:3001 \
  -e SERVER_PORT=3001 \
  -e SERVER_PREFIX='/plugins/n8n' \
  -e CREDENTIALS_ENDPOINT='https://canary.twake.app' \
  -e CREDENTIALS_ID='abcdef' \
  -e CREDENTIALS_SECRET='some-twake-application-secret' \
  -e N8N_JWT_SECRET='secret' \
  -e N8N_ENDPOINT='myN8nInstall.com' \
  n8n
```
