# Kapato Project Progress

## What We Built

### VPS Setup (OVH Cloud)
- 4 vCores, 8GB RAM, 75GB SSD — Singapore
- OS: Debian 13
- Connected via SSH: `ssh debian@51.79.254.94`

### Server Stack
- **Docker** — runs the app as a container
- **Nginx** — reverse proxy, forwards traffic from port 80/443 to app on port 3000
- **Let's Encrypt (Certbot)** — free SSL, auto-renews every 90 days
- **Cockpit** — web GUI for server management at https://51.79.254.94:9090

### App Stack
- **SvelteKit** (frontend + backend)
- **SQLite** via better-sqlite3 (database stored at `/opt/kapato/data/kapato.db` on VPS)
- **Tailwind CSS** (styling)
- **adapter-node** (runs as a Node.js server)

### Domain & SSL
- Domain: kapato.org (Hostinger)
- DNS A records pointing to 51.79.254.94
- HTTPS live at https://kapato.org

---

## Features Built

### Public Website
- Home page
- About page
- Navbar with Login button

### Admin Panel (`/admin`)
- Login page with session cookies
- Dashboard with quick links
- Device management — add/deactivate/delete devices
- Location pings viewer — see all GPS pings with Google Maps links

### GPS Tracking API
- `POST /api/ping` — receives GPS data from devices
- Payload: `{"id": "KPT001", "lat": 25.123, "lng": 91.456}`
- Returns `OK` or `ERR`

### Database Tables
- `users` — admin accounts
- `devices` — registered GPS devices with mithun names
- `locations` — GPS pings from devices

---

## Deployment Flow

```
Make changes on Mac
      ↓
docker build --platform linux/amd64 -t kapato .
      ↓
docker save kapato | gzip > kapato.tar.gz
      ↓
scp to VPS → docker load → docker run
      ↓
Live at https://kapato.org
```

---

## Default Credentials
- Admin login: `admin` / `kapato123`
- Change this before going live!
