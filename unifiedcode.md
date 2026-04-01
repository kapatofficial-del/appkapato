// ============================================================
// KAPATO GPS TRACKER — Unified Firmware v1.6
// Boards: 7Semi ESP32-S3 | NodeMCU ESP32 | Beetle ESP32-C6
// ============================================================

// ============================================================
//  SECTION 1: CONFIGURE HERE
// ============================================================

#define DEVICE_ID       "KPT002"
#define API_HOST        "kapato.org"
#define API_PATH        "/api/ping"
#define API_URL         "https://kapato.org/api/ping"
#define APN             "airteliot.com"
#define SMS_NUMBER      "+916009202874"
#define INTERVAL        30000   // ms between cycles
#define GPS_WARMUP_MIN  5       // max minutes to wait for first fix on boot
#define GPS_TIMEOUT     90000   // ms to wait for fix per cycle

// Operating mode — uncomment ONE:
#define MODE_BOTH
// #define MODE_DATA_ONLY
// #define MODE_MSG_ONLY

// Uncomment ONE board:
// #define BOARD_7SEMI_ESP32S3
   #define BOARD_NODEMCU_ESP32
// #define BOARD_BEETLE_ESP32C6

// ============================================================
//  SECTION 2: PIN MAP — do not edit
// ============================================================

#if defined(BOARD_7SEMI_ESP32S3)
  #define EC200U_RX 12
  #define EC200U_TX 13
  #define L89_RX    16
  #define L89_TX    17
  #define L89_UART  2

#elif defined(BOARD_NODEMCU_ESP32)
  #define EC200U_RX 4
  #define EC200U_TX 5
  #define L89_RX    17
  #define L89_TX    16
  #define L89_UART  2

#elif defined(BOARD_BEETLE_ESP32C6)
  #define EC200U_RX 4
  #define EC200U_TX 5
  #define L89_RX    17
  #define L89_TX    16
  #define L89_UART  0

#else
  #error "No board selected."
#endif

// ============================================================
//  SECTION 3: CORE — do not edit
// ============================================================

HardwareSerial ec200u(1);
HardwareSerial l89(L89_UART);

// uptime in HH:MM:SS since boot (used when no RTC available)
String getUptime() {
  unsigned long s = millis() / 1000;
  unsigned long h = s / 3600; s %= 3600;
  unsigned long m = s / 60;   s %= 60;
  char buf[12];
  sprintf(buf, "%02lu:%02lu:%02lu", h, m, s);
  return String(buf);
}

// ── AT helpers ───────────────────────────────────────────────

String sendAT(const char* cmd, unsigned long timeout = 5000) {
  ec200u.println(cmd);
  String res = ""; unsigned long t = millis();
  while (millis() - t < timeout) {
    while (ec200u.available()) res += (char)ec200u.read();
    if (res.indexOf("OK") != -1 || res.indexOf("ERROR") != -1) break;
  }
  Serial.println(">> " + String(cmd) + "\n<< " + res);
  return res;
}

bool waitFor(const char* expected, unsigned long timeout = 10000) {
  String res = ""; unsigned long t = millis();
  while (millis() - t < timeout) {
    while (ec200u.available()) res += (char)ec200u.read();
    if (res.indexOf(expected) != -1) return true;
  }
  return false;
}

// ── Network registration wait ────────────────────────────────

void waitForNetwork() {
  Serial.println("[NET] Waiting for registration...");
  unsigned long t = millis();
  while (millis() - t < 30000) {
    String reg = sendAT("AT+CREG?");
    if (reg.indexOf(",1") != -1 || reg.indexOf(",5") != -1) {
      Serial.println("[NET] Registered");
      return;
    }
    delay(2000);
  }
  Serial.println("[NET] Registration timeout — restarting");
  ESP.restart();
}

// ── GPS warmup — exits on first fix, restarts if timeout ─────

String gpsWarmup() {
  unsigned long warmupMs = GPS_WARMUP_MIN * 60UL * 1000UL;
  Serial.println("[GPS] Warmup started — max " + String(GPS_WARMUP_MIN) + " min");

  unsigned long start = millis();
  int elapsed = 0;

  while (millis() - start < warmupMs) {
    if (l89.available()) {
      String line = l89.readStringUntil('\n'); line.trim();
      if (!line.startsWith("$GNRMC") && !line.startsWith("$GPRMC")) continue;

      String f[12]; int fi = 0, s = 0;
      for (int i = 0; i < (int)line.length() && fi < 12; i++)
        if (line[i] == ',') { f[fi++] = line.substring(s, i); s = i + 1; }
      f[fi] = line.substring(s);

      if (f[2] == "A") {
        float rLat = f[3].toFloat(), rLng = f[5].toFloat();
        int dLat = rLat / 100, dLng = rLng / 100;
        float lat = dLat + (rLat - dLat * 100) / 60.0;
        float lng = dLng + (rLng - dLng * 100) / 60.0;
        if (f[4] == "S") lat = -lat;
        if (f[6] == "W") lng = -lng;
        char la[12], lo[12];
        dtostrf(lat, 1, 5, la); dtostrf(lng, 1, 5, lo);
        String coords = String(la) + "," + String(lo);
        Serial.println("[GPS] Fix at " + String((millis() - start) / 1000) + "s: " + coords);
        Serial.println("[GPS] Warmup done — proceeding");
        return coords;
      }
    }

    int secs = (millis() - start) / 1000;
    if (secs != elapsed) {
      elapsed = secs;
      if (secs % 10 == 0)
        Serial.println("[GPS] " + String(secs) + "s / " + String(warmupMs / 1000) + "s — searching...");
    }
  }

  Serial.println("[GPS] No fix after " + String(GPS_WARMUP_MIN) + " min — restarting");
  ESP.restart();
  return "";
}

// ── GPS per-cycle ────────────────────────────────────────────

String getGPS() {
  Serial.println("[GPS] Waiting for fix...");
  unsigned long t = millis(); int elapsed = 0;
  while (millis() - t < GPS_TIMEOUT) {
    if (l89.available()) {
      String line = l89.readStringUntil('\n'); line.trim();
      if (!line.startsWith("$GNRMC") && !line.startsWith("$GPRMC")) continue;
      String f[12]; int fi = 0, s = 0;
      for (int i = 0; i < (int)line.length() && fi < 12; i++)
        if (line[i] == ',') { f[fi++] = line.substring(s, i); s = i + 1; }
      f[fi] = line.substring(s);
      if (f[2] == "A") {
        float rLat = f[3].toFloat(), rLng = f[5].toFloat();
        int dLat = rLat / 100, dLng = rLng / 100;
        float lat = dLat + (rLat - dLat * 100) / 60.0;
        float lng = dLng + (rLng - dLng * 100) / 60.0;
        if (f[4] == "S") lat = -lat;
        if (f[6] == "W") lng = -lng;
        char la[12], lo[12];
        dtostrf(lat, 1, 5, la); dtostrf(lng, 1, 5, lo);
        Serial.println("[L89] " + String(la) + "," + String(lo));
        return String(la) + "," + String(lo);
      }
      int secs = (millis() - t) / 1000;
      if (secs != elapsed) { elapsed = secs; Serial.println("[L89] " + String(secs) + "s..."); }
    }
  }
  Serial.println("[GPS] No fix"); return "";
}

// ── SMS format ───────────────────────────────────────────────
//
// Format (pipe-delimited for easy Pi bridge parsing):
// KPT002 | LAT,LNG | https://maps.google.com/?q=LAT,LNG | up:HH:MM:SS | STATUS
//
// Example:
// KPT002 | 27.12345,93.45678 | https://maps.google.com/?q=27.12345,93.45678 | up:00:12:34 | TRACKING

String buildSMS(String lat, String lng, String status) {
  String coords = lat + "," + lng;
  String mapsUrl = "https://maps.google.com/?q=" + coords;
  String uptime = getUptime();
  return String(DEVICE_ID) + " | " + coords + " | " + mapsUrl + " | up:" + uptime + " | " + status;
}

// ── SMS send ─────────────────────────────────────────────────

void sendSMS(String message) {
#if defined(MODE_MSG_ONLY) || defined(MODE_BOTH)
  Serial.println("[SMS] " + message);
  if (sendAT("AT+CMGF=1").indexOf("OK") == -1) {
    Serial.println("[SMS] Text mode failed"); return;
  }
  String cmd = "AT+CMGS=\"" SMS_NUMBER "\"";
  ec200u.println(cmd);
  if (!waitFor(">", 5000)) { Serial.println("[SMS] No prompt"); return; }
  ec200u.print(message);
  ec200u.write(0x1A);
  delay(500);
  String res = ""; unsigned long t = millis();
  while (millis() - t < 20000) {
    while (ec200u.available()) res += (char)ec200u.read();
    if (res.indexOf("+CMGS:") != -1) { Serial.println("[SMS] OK"); return; }
    if (res.indexOf("ERROR") != -1)  { Serial.println("[SMS] Error: " + res); return; }
  }
  Serial.println("[SMS] Timeout");
#endif
}

// ── HTTP ping ────────────────────────────────────────────────

void sendPing(String lat, String lng) {
#if defined(MODE_DATA_ONLY) || defined(MODE_BOTH)
  String body = "{\"id\":\"" DEVICE_ID "\",\"lat\":" + lat + ",\"lng\":" + lng + "}";
  Serial.println("[PING] " + body);

  sendAT("AT+QSSLCFG=\"sslversion\",1,4");
  sendAT("AT+QSSLCFG=\"ciphersuite\",1,0xFFFF");
  sendAT("AT+QSSLCFG=\"seclevel\",1,0");
  sendAT("AT+QHTTPCFG=\"contextid\",1");
  sendAT("AT+QHTTPCFG=\"contenttype\",1");
  sendAT("AT+QHTTPCFG=\"sslctxid\",1");
  sendAT("AT+QHTTPCFG=\"requestheader\",1");

  char urlCmd[40]; sprintf(urlCmd, "AT+QHTTPURL=%d,10", strlen(API_URL));
  ec200u.println(urlCmd);
  if (!waitFor("CONNECT", 10000)) { Serial.println("[PING] URL fail"); return; }
  ec200u.print(API_URL); delay(3000);

  String hdr = "POST " API_PATH " HTTP/1.1\r\nHost: " API_HOST "\r\n"
               "Content-Type: application/json\r\nx-requested-with: XMLHttpRequest\r\n"
               "Content-Length: " + String(body.length()) + "\r\n\r\n";
  char postCmd[50]; sprintf(postCmd, "AT+QHTTPPOST=%d,10,20", hdr.length() + body.length());
  ec200u.println(postCmd);
  if (!waitFor("CONNECT", 10000)) { Serial.println("[PING] POST fail"); return; }
  ec200u.print(hdr); ec200u.print(body);

  String res = ""; unsigned long t = millis();
  while (millis() - t < 20000) {
    while (ec200u.available()) res += (char)ec200u.read();
    if (res.indexOf("+QHTTPPOST:") != -1) break;
  }
  Serial.println((res.indexOf(",200,") != -1 || res.indexOf(",201,") != -1) ? "[PING] OK!" : "[PING] Fail: " + res);
#endif
}

// ============================================================
//  SETUP
// ============================================================

void setup() {
  Serial.begin(115200); delay(2000);
  Serial.println("=== Kapato [" DEVICE_ID "] ===");

#if defined(MODE_DATA_ONLY)
  Serial.println("[MODE] Data only");
#elif defined(MODE_MSG_ONLY)
  Serial.println("[MODE] SMS only");
#elif defined(MODE_BOTH)
  Serial.println("[MODE] Data + SMS");
#endif

  ec200u.begin(115200, SERIAL_8N1, EC200U_RX, EC200U_TX);
  l89.begin(9600, SERIAL_8N1, L89_RX, L89_TX);
  delay(3000);

  sendAT("ATE0");
  sendAT("AT+QCFG=\"nwscanmode\",0,1");

  waitForNetwork();

#if defined(MODE_DATA_ONLY) || defined(MODE_BOTH)
  String ip = sendAT("AT+CGPADDR=1");
  if (ip.indexOf("ERROR") != -1 || ip.indexOf("0.0.0.0") != -1) {
    sendAT("AT+QICSGP=1,1,\"" APN "\",\"\",\"\",1");
    sendAT("AT+QIACT=1", 15000);
    ip = sendAT("AT+CGPADDR=1");
  }
  Serial.println(ip.indexOf("ERROR") != -1 ? "[NET] No IP" : "[NET] 4G ready");
#endif

  // GPS warmup — exits on first fix, restarts if no fix in window
  String firstFix = gpsWarmup();
  int c = firstFix.indexOf(',');
  String lat = firstFix.substring(0, c);
  String lng = firstFix.substring(c + 1);

  sendPing(lat, lng);
  sendSMS(buildSMS(lat, lng, "ONLINE"));
}

// ============================================================
//  LOOP
// ============================================================

void loop() {
  Serial.println("\n--- Cycle [" DEVICE_ID "] ---");
  String coords = getGPS();
  if (coords.length() > 0) {
    int c = coords.indexOf(',');
    String lat = coords.substring(0, c);
    String lng = coords.substring(c + 1);
    sendPing(lat, lng);
    sendSMS(buildSMS(lat, lng, "TRACKING"));
  } else {
    Serial.println("[SKIP] No fix");
  }
  delay(INTERVAL);
}
```

SMS will now look like this on your phone:
```
KPT002 | 27.12345,93.45678 | https://maps.google.com/?q=27.12345,93.45678 | up:00:12:34 | TRACKING