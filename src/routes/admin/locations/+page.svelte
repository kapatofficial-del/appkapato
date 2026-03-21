<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	let selected = $state<Set<number>>(new Set());

	let deviceFilter = $state('all');
	let search = $state('');

	const filtered = $derived(data.pings.filter((p: { id: number; device_id: string; mithun_name: string | null }) => {
		const matchDevice = deviceFilter === 'all' || p.device_id === deviceFilter;
		const matchSearch = !search || p.device_id.toLowerCase().includes(search.toLowerCase()) || (p.mithun_name ?? '').toLowerCase().includes(search.toLowerCase());
		return matchDevice && matchSearch;
	}));

	const allIds = $derived(filtered.map((p: { id: number }) => p.id));
	const allSelected = $derived(allIds.length > 0 && allIds.every((id: number) => selected.has(id)));

	function toggleAll() {
		selected = allSelected ? new Set() : new Set(allIds);
	}

	function toggleRow(id: number) {
		const next = new Set(selected);
		next.has(id) ? next.delete(id) : next.add(id);
		selected = next;
	}

	function deleteManyEnhance() {
		return ({ result, update }: { result: { type: string }; update: () => void }) => {
			if (result.type === 'success') selected = new Set();
			update();
		};
	}
</script>

<div class="p-8">

	<div class="mb-4 flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-white">Location Pings</h2>
			<p class="text-gray-500 text-sm mt-1">Last 100 incoming pings from devices</p>
		</div>
	</div>

	<!-- Filters -->
	<div class="flex items-center gap-3 mb-4 flex-wrap">
		<div class="relative flex-1 min-w-48">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
			</svg>
			<input bind:value={search} placeholder="Search device ID or Mithun name…" class="w-full bg-gray-900 border border-gray-800 focus:border-green-500 focus:outline-none rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600" />
		</div>
		<select bind:value={deviceFilter} class="bg-gray-900 border border-gray-800 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white">
			<option value="all">All Devices</option>
			{#each data.devices as device}
				<option value={device.device_id}>{device.device_id} — {device.mithun_name}</option>
			{/each}
		</select>
		{#if search || deviceFilter !== 'all'}
			<button onclick={() => { search = ''; deviceFilter = 'all'; }} class="text-xs text-gray-500 hover:text-white transition">Clear</button>
		{/if}
		<span class="text-xs text-gray-600 ml-auto">{filtered.length} of {data.pings.length}</span>
	</div>

	<!-- Bulk delete bar -->
	{#if selected.size > 0}
		<form
			method="POST"
			action="?/deleteMany"
			use:enhance={deleteManyEnhance}
			class="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4"
			onsubmit={(e) => { if (!confirm(`Delete ${selected.size} ping${selected.size === 1 ? '' : 's'}?`)) e.preventDefault(); }}
		>
			{#each [...selected] as id}
				<input type="hidden" name="ids" value={id} />
			{/each}
			<span class="text-red-400 text-sm font-medium">{selected.size} ping{selected.size === 1 ? '' : 's'} selected</span>
			<button type="submit" class="ml-auto flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
				</svg>
				Delete Selected
			</button>
			<button type="button" onclick={() => selected = new Set()} class="text-gray-500 hover:text-white text-sm transition">Cancel</button>
		</form>
	{/if}

	<div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
		<table class="w-full text-sm">
			<thead class="bg-gray-800 text-gray-400">
				<tr>
					<th class="px-4 py-3 w-10">
						<input
							type="checkbox"
							checked={allSelected}
							onchange={toggleAll}
							class="rounded border-gray-600 bg-gray-700 accent-green-500 cursor-pointer"
						/>
					</th>
					<th class="text-left px-4 py-3">#</th>
					<th class="text-left px-4 py-3">Device ID</th>
					<th class="text-left px-4 py-3">Mithun</th>
					<th class="text-left px-4 py-3">Latitude</th>
					<th class="text-left px-4 py-3">Longitude</th>
					<th class="text-left px-4 py-3">Maps</th>
					<th class="text-left px-4 py-3">Time</th>
					<th class="text-left px-4 py-3">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-800">
				{#each filtered as ping (ping.id)}
					<tr class="hover:bg-gray-800/50 transition group {selected.has(ping.id) ? 'bg-red-500/5' : ''}">
						<td class="px-4 py-3 w-10">
							<input
								type="checkbox"
								checked={selected.has(ping.id)}
								onchange={() => toggleRow(ping.id)}
								class="rounded border-gray-600 bg-gray-700 accent-green-500 cursor-pointer"
							/>
						</td>
						<td class="px-4 py-3 text-gray-500">{ping.id}</td>
						<td class="px-4 py-3 font-mono font-bold text-green-400">{ping.device_id}</td>
						<td class="px-4 py-3">{ping.mithun_name ?? '—'}</td>
						<td class="px-4 py-3 font-mono">{ping.lat}</td>
						<td class="px-4 py-3 font-mono">{ping.lng}</td>
						<td class="px-4 py-3">
							<a
								href="https://www.google.com/maps?q={ping.lat},{ping.lng}"
								target="_blank"
								class="text-blue-400 hover:text-blue-300 text-xs underline"
							>
								View on Maps
							</a>
						</td>
						<td class="px-4 py-3 text-gray-400">{ping.ts}</td>
						<td class="px-4 py-3">
							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="id" value={ping.id} />
								<button
									type="submit"
									onclick={(e) => { if (!confirm('Delete this ping?')) e.preventDefault(); }}
									class="text-xs px-3 py-1.5 rounded-lg border border-red-800 text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100"
								>
									Delete
								</button>
							</form>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="9" class="px-6 py-12 text-center text-gray-500">
							No pings yet. Waiting for devices to send data.
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

</div>
