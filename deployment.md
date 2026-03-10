# Kapato Deployment Guide

## VPS Info
- **IP:** 51.79.254.94
- **User:** debian
- **SSH:** `ssh debian@51.79.254.94`

## Stack
- SvelteKit + adapter-node
- Docker (linux/amd64)
- Running on port 3000

---

## How to Deploy / Redeploy

Every time you make changes to the app, follow these steps:

### Step 1 — Build Docker image on your Mac
```bash
cd /Users/jomeenmimar/development/kapato/vps/appkapato
docker build --platform linux/amd64 -t kapato .
```

### Step 2 — Save and send to VPS
```bash
docker save kapato | gzip > kapato.tar.gz
scp kapato.tar.gz debian@51.79.254.94:~
```

### Step 3 — Load and restart on VPS
```bash
ssh debian@51.79.254.94
sudo docker stop kapato
sudo docker rm kapato
sudo docker load < kapato.tar.gz
sudo docker run -d -p 3000:3000 --name kapato --restart always kapato
```

### Step 4 — Verify it's running
```bash
sudo docker ps
```

**App is live at:** http://51.79.254.94:3000

---

## Useful Commands on VPS

| Command | What it does |
|---|---|
| `sudo docker ps` | Check if container is running |
| `sudo docker logs kapato` | View app logs |
| `sudo docker stop kapato` | Stop the app |
| `sudo docker restart kapato` | Restart the app |
| `sudo docker stats` | Live CPU/RAM usage |

---

## Other Services
- **Cockpit (server GUI):** https://51.79.254.94:9090
