<script lang="ts">
	let { data } = $props();

	const d = data.device;

	let deviceId   = $state((d.device_id as string) ?? '');
	let apn        = $state((d.apn as string) ?? 'airteliot.com');
	let smsNumber  = $state((d.sms_number as string) ?? (d.client_phone as string) ?? '');
	let board      = $state((d.board as string) ?? 'BOARD_NODEMCU_ESP32');
	let mode       = $state((d.mode as string) ?? 'MODE_BOTH');
	let intervalMs = $state((d.interval_ms as number) ?? 30000);
	let warmupMin  = $state((d.gps_warmup_min as number) ?? 5);
	let timeoutMs  = $state((d.gps_timeout_ms as number) ?? 90000);

	let generated = $state('');
	let copied = $state(false);

	const boardLabels: Record<string, string> = {
		BOARD_7SEMI_ESP32S3:  '7Semi ESP32-S3',
		BOARD_NODEMCU_ESP32:  'NodeMCU ESP32',
		BOARD_BEETLE_ESP32C6: 'Beetle ESP32-C6'
	};

	const modeLabels: Record<string, string> = {
		MODE_BOTH:      'Data + SMS',
		MODE_DATA_ONLY: 'Data only',
		MODE_MSG_ONLY:  'SMS only'
	};

	const boardPins: Record<string, string> = {
		BOARD_7SEMI_ESP32S3:  '#define EC200U_RX 12\n#define EC200U_TX 13\n#define L89_RX    16\n#define L89_TX    17\n#define L89_UART  2',
		BOARD_NODEMCU_ESP32:  '#define EC200U_RX 4\n#define EC200U_TX 5\n#define L89_RX    17\n#define L89_TX    16\n#define L89_UART  2',
		BOARD_BEETLE_ESP32C6: '#define EC200U_RX 4\n#define EC200U_TX 5\n#define L89_RX    17\n#define L89_TX    16\n#define L89_UART  0'
	};

	function generate() {
		const isData = mode === 'MODE_DATA_ONLY' || mode === 'MODE_BOTH';
		const isSMS  = mode === 'MODE_MSG_ONLY'  || mode === 'MODE_BOTH';

		const lines: string[] = [];

		const add  = (s = '') => lines.push(s);
		const sec  = (t: string) => { add(); add('// ── ' + t + ' ' + '─'.repeat(Math.max(0, 52 - t.length))); add(); };

		// Header
		add(`// ============================================================`);
		add(`// KAPATO GPS TRACKER — ${deviceId}`);
		add(`// Board : ${boardLabels[board]}`);
		add(`// Mode  : ${modeLabels[mode]}`);
		add(`// ============================================================`);

		// Config
		sec('Config');
		add(`#define DEVICE_ID      "${deviceId}"`);
		if (isData) {
			add(`#define API_HOST       "kapato.org"`);
			add(`#define API_PATH       "/api/ping"`);
			add(`#define API_URL        "https://kapato.org/api/ping"`);
			add(`#define APN            "${apn}"`);
		}
		if (isSMS) {
			add(`#define SMS_NUMBER     "${smsNumber}"`);
		}
		add(`#define INTERVAL       ${intervalMs}   // ms between cycles`);
		add(`#define GPS_WARMUP_MIN ${warmupMin}       // max minutes to wait for first fix on boot`);
		add(`#define GPS_TIMEOUT    ${timeoutMs}   // ms to wait for fix per cycle`);

		// Pin map
		sec(`Pin map — ${boardLabels[board]}`);
		add(boardPins[board]);

		// Globals
		sec('Globals');
		add(`HardwareSerial ec200u(1);`);
		add(`HardwareSerial l89(L89_UART);`);

		// getUptime — only needed for SMS
		if (isSMS) {
			sec('Uptime helper');
			add(`String getUptime() {`);
			add(`  unsigned long s = millis() / 1000;`);
			add(`  unsigned long h = s / 3600; s %= 3600;`);
			add(`  unsigned long m = s / 60;   s %= 60;`);
			add(`  char buf[12];`);
			add(`  sprintf(buf, "%02lu:%02lu:%02lu", h, m, s);`);
			add(`  return String(buf);`);
			add(`}`);
		}

		// AT helpers
		sec('AT helpers');
		add(`String sendAT(const char* cmd, unsigned long timeout = 5000) {`);
		add(`  ec200u.println(cmd);`);
		add(`  String res = ""; unsigned long t = millis();`);
		add(`  while (millis() - t < timeout) {`);
		add(`    while (ec200u.available()) res += (char)ec200u.read();`);
		add(`    if (res.indexOf("OK") != -1 || res.indexOf("ERROR") != -1) break;`);
		add(`  }`);
		add(`  Serial.println(">> " + String(cmd) + "\\n<< " + res);`);
		add(`  return res;`);
		add(`}`);
		add();
		add(`bool waitFor(const char* expected, unsigned long timeout = 10000) {`);
		add(`  String res = ""; unsigned long t = millis();`);
		add(`  while (millis() - t < timeout) {`);
		add(`    while (ec200u.available()) res += (char)ec200u.read();`);
		add(`    if (res.indexOf(expected) != -1) return true;`);
		add(`  }`);
		add(`  return false;`);
		add(`}`);

		// waitForNetwork
		sec('Network');
		add(`void waitForNetwork() {`);
		add(`  Serial.println("[NET] Waiting for registration...");`);
		add(`  unsigned long t = millis();`);
		add(`  while (millis() - t < 30000) {`);
		add(`    String reg = sendAT("AT+CREG?");`);
		add(`    if (reg.indexOf(",1") != -1 || reg.indexOf(",5") != -1) {`);
		add(`      Serial.println("[NET] Registered");`);
		add(`      return;`);
		add(`    }`);
		add(`    delay(2000);`);
		add(`  }`);
		add(`  Serial.println("[NET] Registration timeout — restarting");`);
		add(`  ESP.restart();`);
		add(`}`);

		// GPS warmup
		sec('GPS warmup');
		add(`String gpsWarmup() {`);
		add(`  unsigned long warmupMs = GPS_WARMUP_MIN * 60UL * 1000UL;`);
		add(`  Serial.println("[GPS] Warmup started — max " + String(GPS_WARMUP_MIN) + " min");`);
		add(`  unsigned long start = millis();`);
		add(`  int elapsed = 0;`);
		add(`  while (millis() - start < warmupMs) {`);
		add(`    if (l89.available()) {`);
		add(`      String line = l89.readStringUntil('\\n'); line.trim();`);
		add(`      if (!line.startsWith("$GNRMC") && !line.startsWith("$GPRMC")) continue;`);
		add(`      String f[12]; int fi = 0, s = 0;`);
		add(`      for (int i = 0; i < (int)line.length() && fi < 12; i++)`);
		add(`        if (line[i] == ',') { f[fi++] = line.substring(s, i); s = i + 1; }`);
		add(`      f[fi] = line.substring(s);`);
		add(`      if (f[2] == "A") {`);
		add(`        float rLat = f[3].toFloat(), rLng = f[5].toFloat();`);
		add(`        int dLat = rLat / 100, dLng = rLng / 100;`);
		add(`        float lat = dLat + (rLat - dLat * 100) / 60.0;`);
		add(`        float lng = dLng + (rLng - dLng * 100) / 60.0;`);
		add(`        if (f[4] == "S") lat = -lat;`);
		add(`        if (f[6] == "W") lng = -lng;`);
		add(`        char la[12], lo[12];`);
		add(`        dtostrf(lat, 1, 5, la); dtostrf(lng, 1, 5, lo);`);
		add(`        String coords = String(la) + "," + String(lo);`);
		add(`        Serial.println("[GPS] Fix at " + String((millis() - start) / 1000) + "s: " + coords);`);
		add(`        Serial.println("[GPS] Warmup done — proceeding");`);
		add(`        return coords;`);
		add(`      }`);
		add(`    }`);
		add(`    int secs = (millis() - start) / 1000;`);
		add(`    if (secs != elapsed) {`);
		add(`      elapsed = secs;`);
		add(`      if (secs % 10 == 0)`);
		add(`        Serial.println("[GPS] " + String(secs) + "s / " + String(warmupMs / 1000) + "s — searching...");`);
		add(`    }`);
		add(`  }`);
		add(`  Serial.println("[GPS] No fix after " + String(GPS_WARMUP_MIN) + " min — restarting");`);
		add(`  ESP.restart();`);
		add(`  return "";`);
		add(`}`);

		// getGPS
		sec('GPS per-cycle');
		add(`String getGPS() {`);
		add(`  Serial.println("[GPS] Waiting for fix...");`);
		add(`  unsigned long t = millis(); int elapsed = 0;`);
		add(`  while (millis() - t < GPS_TIMEOUT) {`);
		add(`    if (l89.available()) {`);
		add(`      String line = l89.readStringUntil('\\n'); line.trim();`);
		add(`      if (!line.startsWith("$GNRMC") && !line.startsWith("$GPRMC")) continue;`);
		add(`      String f[12]; int fi = 0, s = 0;`);
		add(`      for (int i = 0; i < (int)line.length() && fi < 12; i++)`);
		add(`        if (line[i] == ',') { f[fi++] = line.substring(s, i); s = i + 1; }`);
		add(`      f[fi] = line.substring(s);`);
		add(`      if (f[2] == "A") {`);
		add(`        float rLat = f[3].toFloat(), rLng = f[5].toFloat();`);
		add(`        int dLat = rLat / 100, dLng = rLng / 100;`);
		add(`        float lat = dLat + (rLat - dLat * 100) / 60.0;`);
		add(`        float lng = dLng + (rLng - dLng * 100) / 60.0;`);
		add(`        if (f[4] == "S") lat = -lat;`);
		add(`        if (f[6] == "W") lng = -lng;`);
		add(`        char la[12], lo[12];`);
		add(`        dtostrf(lat, 1, 5, la); dtostrf(lng, 1, 5, lo);`);
		add(`        Serial.println("[L89] " + String(la) + "," + String(lo));`);
		add(`        return String(la) + "," + String(lo);`);
		add(`      }`);
		add(`      int secs = (millis() - t) / 1000;`);
		add(`      if (secs != elapsed) { elapsed = secs; Serial.println("[L89] " + String(secs) + "s..."); }`);
		add(`    }`);
		add(`  }`);
		add(`  Serial.println("[GPS] No fix"); return "";`);
		add(`}`);

		// SMS functions — only if SMS mode
		if (isSMS) {
			sec('SMS');
			add(`String buildSMS(String lat, String lng, String status) {`);
			add(`  String coords = lat + "," + lng;`);
			add(`  String mapsUrl = "https://maps.google.com/?q=" + coords;`);
			add(`  return String(DEVICE_ID) + " | " + coords + " | " + mapsUrl + " | up:" + getUptime() + " | " + status;`);
			add(`}`);
			add();
			add(`void sendSMS(String message) {`);
			add(`  Serial.println("[SMS] " + message);`);
			add(`  if (sendAT("AT+CMGF=1").indexOf("OK") == -1) {`);
			add(`    Serial.println("[SMS] Text mode failed"); return;`);
			add(`  }`);
			add(`  ec200u.println("AT+CMGS=\\"" SMS_NUMBER "\\"");`);
			add(`  if (!waitFor(">", 5000)) { Serial.println("[SMS] No prompt"); return; }`);
			add(`  ec200u.print(message);`);
			add(`  ec200u.write(0x1A);`);
			add(`  delay(500);`);
			add(`  String res = ""; unsigned long t = millis();`);
			add(`  while (millis() - t < 20000) {`);
			add(`    while (ec200u.available()) res += (char)ec200u.read();`);
			add(`    if (res.indexOf("+CMGS:") != -1) { Serial.println("[SMS] OK"); return; }`);
			add(`    if (res.indexOf("ERROR") != -1)  { Serial.println("[SMS] Error: " + res); return; }`);
			add(`  }`);
			add(`  Serial.println("[SMS] Timeout");`);
			add(`}`);
		}

		// HTTP ping — only if data mode
		if (isData) {
			sec('HTTP ping');
			add(`void sendPing(String lat, String lng) {`);
			add(`  String body = "{\\"id\\":\\"" DEVICE_ID "\\",\\"lat\\":" + lat + ",\\"lng\\":" + lng + "}";`);
			add(`  Serial.println("[PING] " + body);`);
			add(`  sendAT("AT+QSSLCFG=\\"sslversion\\",1,4");`);
			add(`  sendAT("AT+QSSLCFG=\\"ciphersuite\\",1,0xFFFF");`);
			add(`  sendAT("AT+QSSLCFG=\\"seclevel\\",1,0");`);
			add(`  sendAT("AT+QHTTPCFG=\\"contextid\\",1");`);
			add(`  sendAT("AT+QHTTPCFG=\\"contenttype\\",1");`);
			add(`  sendAT("AT+QHTTPCFG=\\"sslctxid\\",1");`);
			add(`  sendAT("AT+QHTTPCFG=\\"requestheader\\",1");`);
			add(`  char urlCmd[40]; sprintf(urlCmd, "AT+QHTTPURL=%d,10", strlen(API_URL));`);
			add(`  ec200u.println(urlCmd);`);
			add(`  if (!waitFor("CONNECT", 10000)) { Serial.println("[PING] URL fail"); return; }`);
			add(`  ec200u.print(API_URL); delay(3000);`);
			add(`  String hdr = "POST " API_PATH " HTTP/1.1\\r\\nHost: " API_HOST "\\r\\n"`);
			add(`               "Content-Type: application/json\\r\\nx-requested-with: XMLHttpRequest\\r\\n"`);
			add(`               "Content-Length: " + String(body.length()) + "\\r\\n\\r\\n";`);
			add(`  char postCmd[50]; sprintf(postCmd, "AT+QHTTPPOST=%d,10,20", hdr.length() + body.length());`);
			add(`  ec200u.println(postCmd);`);
			add(`  if (!waitFor("CONNECT", 10000)) { Serial.println("[PING] POST fail"); return; }`);
			add(`  ec200u.print(hdr); ec200u.print(body);`);
			add(`  String res = ""; unsigned long t = millis();`);
			add(`  while (millis() - t < 20000) {`);
			add(`    while (ec200u.available()) res += (char)ec200u.read();`);
			add(`    if (res.indexOf("+QHTTPPOST:") != -1) break;`);
			add(`  }`);
			add(`  Serial.println((res.indexOf(",200,") != -1 || res.indexOf(",201,") != -1) ? "[PING] OK!" : "[PING] Fail: " + res);`);
			add(`}`);
		}

		// setup
		sec('Setup');
		add(`void setup() {`);
		add(`  Serial.begin(115200); delay(2000);`);
		add(`  Serial.println("=== Kapato [" DEVICE_ID "] — ${modeLabels[mode]} ===");`);
		add(`  ec200u.begin(115200, SERIAL_8N1, EC200U_RX, EC200U_TX);`);
		add(`  l89.begin(9600, SERIAL_8N1, L89_RX, L89_TX);`);
		add(`  delay(3000);`);
		add(`  sendAT("ATE0");`);
		add(`  sendAT("AT+QCFG=\\"nwscanmode\\",0,1");`);
		add(`  waitForNetwork();`);
		if (isData) {
			add(`  String ip = sendAT("AT+CGPADDR=1");`);
			add(`  if (ip.indexOf("ERROR") != -1 || ip.indexOf("0.0.0.0") != -1) {`);
			add(`    sendAT("AT+QICSGP=1,1,\\"" APN "\\",\\"\\",\\"\\",1");`);
			add(`    sendAT("AT+QIACT=1", 15000);`);
			add(`    ip = sendAT("AT+CGPADDR=1");`);
			add(`  }`);
			add(`  Serial.println(ip.indexOf("ERROR") != -1 ? "[NET] No IP" : "[NET] 4G ready");`);
		}
		add(`  String firstFix = gpsWarmup();`);
		add(`  int c = firstFix.indexOf(',');`);
		add(`  String lat = firstFix.substring(0, c);`);
		add(`  String lng = firstFix.substring(c + 1);`);
		if (isData) add(`  sendPing(lat, lng);`);
		if (isSMS)  add(`  sendSMS(buildSMS(lat, lng, "ONLINE"));`);
		add(`}`);

		// loop
		sec('Loop');
		add(`void loop() {`);
		add(`  Serial.println("\\n--- Cycle [" DEVICE_ID "] ---");`);
		add(`  String coords = getGPS();`);
		add(`  if (coords.length() > 0) {`);
		add(`    int c = coords.indexOf(',');`);
		add(`    String lat = coords.substring(0, c);`);
		add(`    String lng = coords.substring(c + 1);`);
		if (isData) add(`    sendPing(lat, lng);`);
		if (isSMS)  add(`    sendSMS(buildSMS(lat, lng, "TRACKING"));`);
		add(`  } else {`);
		add(`    Serial.println("[SKIP] No fix");`);
		add(`  }`);
		add(`  delay(INTERVAL);`);
		add(`}`);

		generated = lines.join('\n');
	}

	async function copyCode() {
		await navigator.clipboard.writeText(generated);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function downloadCode() {
		const blob = new Blob([generated], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${deviceId}_firmware.ino`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div class="p-5 flex flex-col gap-4 h-full">

	<!-- Header -->
	<div class="flex items-center gap-3">
		<a href="/admin/devices/{d.id}" class="text-gray-500 hover:text-white transition flex items-center gap-1">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
			</svg>
		</a>
		<div>
			<h2 class="text-lg font-bold text-white font-mono leading-tight">{d.device_id} — Firmware Generator</h2>
			<p class="text-gray-500 text-xs">{d.mithun_name} · {d.client_name ?? 'Unassigned'}</p>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

		<!-- Left: Config -->
		<div class="bg-gray-900 border border-gray-800 rounded-xl flex flex-col overflow-hidden min-h-0">
			<div class="px-4 py-3 border-b border-gray-800">
				<p class="text-xs font-semibold text-white">Configuration</p>
				<p class="text-xs text-gray-500">Adjust then click Generate</p>
			</div>
			<div class="p-4 space-y-4 overflow-y-auto flex-1">

				<div>
					<p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Device</p>
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="deviceId">Device ID</label>
						<input id="deviceId" bind:value={deviceId} class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-green-400 font-mono" />
					</div>
				</div>

				<div>
					<p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Hardware</p>
					<div class="space-y-2">
						<div>
							<label class="text-xs text-gray-500 mb-1 block" for="board">Board</label>
							<select id="board" bind:value={board} class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white">
								{#each Object.entries(boardLabels) as [val, label]}
									<option value={val}>{label}</option>
								{/each}
							</select>
						</div>
						<div>
							<label class="text-xs text-gray-500 mb-1 block" for="mode">Mode</label>
							<select id="mode" bind:value={mode} class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white">
								{#each Object.entries(modeLabels) as [val, label]}
									<option value={val}>{label}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>

				<div>
					<p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Network & SMS</p>
					<div class="space-y-2">
						{#if mode !== 'MODE_MSG_ONLY'}
							<div>
								<label class="text-xs text-gray-500 mb-1 block" for="apn">APN</label>
								<input id="apn" bind:value={apn} class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white font-mono" />
							</div>
						{/if}
						{#if mode !== 'MODE_DATA_ONLY'}
							<div>
								<label class="text-xs text-gray-500 mb-1 block" for="smsNumber">
									SMS Number
									{#if d.client_phone && !d.sms_number}
										<span class="text-green-600 ml-1">(from client)</span>
									{/if}
								</label>
								<input id="smsNumber" bind:value={smsNumber} placeholder="+91XXXXXXXXXX" class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white font-mono" />
							</div>
						{/if}
					</div>
				</div>

				<div>
					<p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Timing</p>
					<div class="space-y-2">
						<div>
							<label class="text-xs text-gray-500 mb-1 block" for="intervalMs">
								Cycle Interval (ms) <span class="text-gray-600">= {(intervalMs / 1000).toFixed(0)}s</span>
							</label>
							<input id="intervalMs" bind:value={intervalMs} type="number" step="1000" min="5000" class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white" />
						</div>
						<div>
							<label class="text-xs text-gray-500 mb-1 block" for="warmupMin">GPS Warmup (min)</label>
							<input id="warmupMin" bind:value={warmupMin} type="number" min="1" max="30" class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white" />
						</div>
						<div>
							<label class="text-xs text-gray-500 mb-1 block" for="timeoutMs">
								GPS Timeout (ms) <span class="text-gray-600">= {(timeoutMs / 1000).toFixed(0)}s</span>
							</label>
							<input id="timeoutMs" bind:value={timeoutMs} type="number" step="5000" min="10000" class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white" />
						</div>
					</div>
				</div>

				<button
					onclick={generate}
					class="w-full bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
				>
					Generate Firmware
				</button>
			</div>
		</div>

		<!-- Right: Output -->
		<div class="bg-gray-900 border border-gray-800 rounded-xl flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
			<div class="px-4 py-3 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
				<div>
					<p class="text-xs font-semibold text-white">Generated Code</p>
					<p class="text-xs text-gray-500">{generated ? `${deviceId}_firmware.ino` : 'Click Generate to produce code'}</p>
				</div>
				{#if generated}
					<div class="flex gap-2">
						<button
							onclick={copyCode}
							class="text-xs px-3 py-1.5 rounded-lg border {copied ? 'border-green-600 text-green-400' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'} transition"
						>
							{copied ? 'Copied!' : 'Copy'}
						</button>
						<button
							onclick={downloadCode}
							class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition"
						>
							Download .ino
						</button>
					</div>
				{/if}
			</div>
			<div class="flex-1 overflow-y-auto min-h-0">
				{#if generated}
					<pre class="text-xs text-gray-300 font-mono p-4 leading-relaxed whitespace-pre">{generated}</pre>
				{:else}
					<div class="h-full flex flex-col items-center justify-center text-gray-600 gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
						</svg>
						<p class="text-sm">Configure and click Generate</p>
					</div>
				{/if}
			</div>
		</div>

	</div>

</div>
