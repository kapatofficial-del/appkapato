<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount, onDestroy } from 'svelte';

	let { data, form } = $props();

	type Ping = { id: number; lat: number; lng: number; ts: string };

	let editing = $state(false);
	let mapEl = $state<HTMLDivElement | null>(null);
	let map: import('leaflet').Map | null = null;
	let markers: import('leaflet').CircleMarker[] = [];
	let routeLine: import('leaflet').Polyline | null = null;
	let highlightedMarker: import('leaflet').CircleMarker | null = null;
	let selectedPingId = $state<number | null>(null);
	let viewMode = $state<'route' | 'latest'>('route');

	const pings: Ping[] = data.pings;
	// pings are DESC from DB, reverse for chronological order for route drawing
	const chronoPings = [...pings].reverse();

	async function initMap() {
		if (!mapEl || pings.length === 0) return;

		const L = (await import('leaflet')).default;

		map = L.map(mapEl, { maxZoom: 19 }).setView([pings[0].lat, pings[0].lng], 13);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19
		}).addTo(map);

		drawRoute(L);
	}

	function drawRoute(L: typeof import('leaflet').default) {
		if (!map) return;

		// Clear existing
		markers.forEach(m => m.remove());
		markers = [];
		if (routeLine) { routeLine.remove(); routeLine = null; }

		if (chronoPings.length === 0) return;

		// Draw route polyline
		const latlngs = chronoPings.map(p => [p.lat, p.lng] as [number, number]);
		routeLine = L.polyline(latlngs, { color: '#22c55e', weight: 2, opacity: 0.6 }).addTo(map);

		// Draw all pings as small dots
		chronoPings.forEach((ping, i) => {
			const isLatest = i === chronoPings.length - 1;
			const marker = L.circleMarker([ping.lat, ping.lng], {
				radius: isLatest ? 8 : 4,
				fillColor: isLatest ? '#22c55e' : '#6b7280',
				color: isLatest ? '#16a34a' : '#4b5563',
				weight: 1,
				fillOpacity: isLatest ? 1 : 0.7
			}).addTo(map!);

			marker.bindPopup(`
				<div style="font-family:monospace;font-size:12px;line-height:1.6">
					<b>${isLatest ? '📍 Latest' : `Ping #${i + 1}`}</b><br/>
					${ping.lat}, ${ping.lng}<br/>
					${ping.ts}
				</div>
			`);

			marker.on('click', () => {
				selectedPingId = ping.id;
			});

			markers.push(marker);
		});

		// Fit map to route bounds
		map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });
	}

	async function focusPing(ping: Ping) {
		if (!map) return;
		selectedPingId = ping.id;
		map.setView([ping.lat, ping.lng], 15, { animate: true });
		// open popup for this marker
		const idx = chronoPings.findIndex(p => p.id === ping.id);
		if (idx !== -1 && markers[idx]) {
			markers[idx].openPopup();
		}
	}

	async function fitAll() {
		if (!map || chronoPings.length === 0) return;
		if (routeLine) map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });
	}

	onMount(() => {
		initMap();
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
	<style>
		.leaflet-container img { max-width: none !important; }
	</style>
</svelte:head>

<div class="p-5 flex flex-col gap-4 h-full">

	<!-- Back + Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<a href="/admin/devices" class="text-gray-500 hover:text-white transition flex items-center gap-1">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
				</svg>
			</a>
			<div>
				<h2 class="text-lg font-bold text-white font-mono leading-tight">{data.device.device_id}</h2>
				<p class="text-gray-500 text-xs">{data.device.mithun_name} · {data.device.client_name ?? 'Unassigned'}</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<span class="px-2 py-0.5 rounded-full text-xs font-medium {data.device.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}">
				{data.device.active ? 'Active' : 'Inactive'}
			</span>
			<form method="POST" action="?/toggle" use:enhance>
				<button type="submit" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition">
					{data.device.active ? 'Deactivate' : 'Activate'}
				</button>
			</form>
			<button
				onclick={() => editing = !editing}
				class="text-xs px-3 py-1.5 rounded-lg border {editing ? 'border-blue-600 text-blue-400' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'} transition"
			>
				{editing ? 'Cancel' : 'Edit'}
			</button>
		</div>
	</div>

	<!-- Error -->
	{#if form?.error}
		<div class="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg px-3 py-2">
			{form.error}
		</div>
	{/if}

	<!-- Device Info / Edit -->
	{#if editing}
		<div class="bg-gray-900 border border-blue-600/30 rounded-xl p-4">
			<form method="POST" action="?/update" use:enhance={() => ({ result, update }) => { if (result.type === 'success') editing = false; update(); }} class="space-y-3">
				<div class="grid grid-cols-3 gap-3">
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="device_id">Device ID <span class="text-red-400">*</span></label>
						<input id="device_id" name="device_id" value={data.device.device_id} required class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white font-mono" />
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="mithun_name">Mithun Name <span class="text-red-400">*</span></label>
						<input id="mithun_name" name="mithun_name" value={data.device.mithun_name} required class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white" />
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="client_id">Client</label>
						<select id="client_id" name="client_id" class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white">
							<option value="">— Unassigned —</option>
							{#each data.clients as client}
								<option value={client.id} selected={data.device.client_id === client.id}>{client.name}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="flex gap-2">
					<button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition">Save</button>
					<button type="button" onclick={() => editing = false} class="text-gray-500 hover:text-white text-xs px-3 py-1.5 transition">Cancel</button>
				</div>
			</form>
		</div>
	{:else}
		<div class="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-8 text-sm">
			<div><span class="text-gray-500 text-xs">Device ID</span><p class="text-green-400 font-mono font-bold">{data.device.device_id}</p></div>
			<div><span class="text-gray-500 text-xs">Mithun</span><p class="text-white">{data.device.mithun_name}</p></div>
			<div><span class="text-gray-500 text-xs">Client</span><p class="text-white">{data.device.client_name ?? '—'}</p></div>
			<div><span class="text-gray-500 text-xs">Registered</span><p class="text-gray-400 text-xs">{data.device.created_at}</p></div>
		</div>
	{/if}

	<!-- Map + Table side by side -->
	<div class="grid grid-cols-2 gap-4 flex-1 min-h-0">

		<!-- Map -->
		<div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
			<div class="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
				<div>
					<p class="text-xs font-semibold text-white">Location Map</p>
					<p class="text-xs text-gray-500">
						{#if pings.length > 0}{pings.length} pings · Latest: {pings[0].ts}{:else}No data{/if}
					</p>
				</div>
				{#if pings.length > 0}
					<div class="flex gap-1.5">
						<button onclick={fitAll} class="text-xs px-2.5 py-1 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition">Fit All</button>
						<a href="https://www.google.com/maps?q={pings[0].lat},{pings[0].lng}" target="_blank" class="text-xs px-2.5 py-1 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition">Google Maps</a>
					</div>
				{/if}
			</div>
			{#if pings.length > 0}
				<div bind:this={mapEl} class="w-full flex-1 min-h-0"></div>
				<div class="px-4 py-2 border-t border-gray-800 flex items-center gap-3 text-xs text-gray-500">
					<span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span> Latest</span>
					<span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-full bg-gray-500"></span> Ping</span>
					<span class="flex items-center gap-1"><span class="inline-block w-4 h-0.5 bg-green-500/60"></span> Route</span>
				</div>
			{:else}
				<div class="h-40 flex items-center justify-center text-gray-600 text-sm">No location pings yet</div>
			{/if}
		</div>

		<!-- Location Table -->
		<div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col">
			<div class="px-4 py-2.5 border-b border-gray-800 flex-shrink-0">
				<p class="text-xs font-semibold text-white">Location History <span class="text-gray-500 font-normal ml-1">(last {pings.length})</span></p>
			</div>
			<div class="overflow-y-auto flex-1 min-h-0">
				<table class="w-full text-xs whitespace-nowrap">
					<thead class="bg-gray-800 text-gray-400 sticky top-0">
						<tr>
							<th class="text-left px-4 py-2">#</th>
							<th class="text-left px-4 py-2">Time</th>
							<th class="text-left px-4 py-2">Lat</th>
							<th class="text-left px-4 py-2">Lng</th>
							<th class="text-left px-4 py-2"></th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-800">
						{#each pings as ping, i (ping.id)}
							<tr
								class="hover:bg-gray-800/50 transition cursor-pointer {selectedPingId === ping.id ? 'bg-green-500/10' : ''}"
								onclick={() => focusPing(ping)}
							>
								<td class="px-4 py-2 text-gray-500">{i === 0 ? '🟢' : pings.length - i}</td>
								<td class="px-4 py-2 text-gray-300">{ping.ts}</td>
								<td class="px-4 py-2 font-mono text-gray-400">{ping.lat}</td>
								<td class="px-4 py-2 font-mono text-gray-400">{ping.lng}</td>
								<td class="px-4 py-2">
									<div class="flex gap-1" onclick={(e) => e.stopPropagation()}>
										<a href="https://www.google.com/maps?q={ping.lat},{ping.lng}" target="_blank" class="px-2 py-1 rounded border border-gray-700 text-blue-400 hover:border-blue-700 transition">↗</a>
										<form method="POST" action="?/deletePing" use:enhance>
											<input type="hidden" name="id" value={ping.id} />
											<button type="submit" onclick={(e) => { e.stopPropagation(); if (!confirm('Delete?')) e.preventDefault(); }} class="px-2 py-1 rounded border border-red-900 text-red-400 hover:bg-red-500/10 transition">✕</button>
										</form>
									</div>
								</td>
							</tr>
						{:else}
							<tr><td colspan="5" class="px-4 py-8 text-center text-gray-500">No pings yet.</td></tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

	</div>

</div>
