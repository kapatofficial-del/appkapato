# Kapato API Documentation

Base URL: `https://kapato.org`

---

## GPS Ping Endpoint

### `POST /api/ping`

Receives GPS location from a tracking device. Only accepts pings from active registered devices.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "KPT001",
  "lat": 25.123456,
  "lng": 91.456789
}
```

**Parameters:**

| Field | Type   | Required | Description                        |
|-------|--------|----------|------------------------------------|
| id    | string | Yes      | Device ID (must exist in system)   |
| lat   | number | Yes      | Latitude (decimal degrees)         |
| lng   | number | Yes      | Longitude (decimal degrees)        |

**Responses:**

| Response | Status | Meaning                              |
|----------|--------|--------------------------------------|
| `OK`     | 200    | Location saved successfully          |
| `ERR`    | 400    | Missing fields                       |
| `ERR`    | 404    | Device not found or inactive         |

---

## Admin Endpoints

### `POST /admin/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "kapato123"
}
```

**Response:**
```json
{ "success": true }
```

---

### `POST /admin/logout`

Clears the admin session cookie.

**Response:**
```json
{ "success": true }
```

---

## cURL Test Commands

### Test GPS ping (valid device)
```bash
curl -X POST https://kapato.org/api/ping \
  -H "Content-Type: application/json" \
  -d '{"id": "KPT001", "lat": 25.123456, "lng": 91.456789}'
```

### Test GPS ping locally
```bash
curl -X POST http://localhost:5173/api/ping \
  -H "Content-Type: application/json" \
  -d '{"id": "KPT001", "lat": 25.123456, "lng": 91.456789}'
```

### Test with missing fields (should return ERR)
```bash
curl -X POST https://kapato.org/api/ping \
  -H "Content-Type: application/json" \
  -d '{"id": "KPT001"}'
```

### Test with unknown device (should return ERR)
```bash
curl -X POST https://kapato.org/api/ping \
  -H "Content-Type: application/json" \
  -d '{"id": "UNKNOWN", "lat": 25.123456, "lng": 91.456789}'
```

### Test admin login
```bash
curl -X POST https://kapato.org/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "kapato123"}'
```

---

## Device Payload Example (for hardware team)

Minimal payload for 2G devices:
```
POST /api/ping HTTP/1.1
Host: kapato.org
Content-Type: application/json

{"id":"KPT001","lat":25.123,"lng":91.456}
```

Keep coordinates to 3 decimal places (~110m accuracy) to save bandwidth on 2G.
