<script lang="ts">
	let { data } = $props();
</script>

<div class="min-h-screen bg-gray-950 text-white">

	<header class="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
		<div class="flex items-center gap-4">
			<a href="/admin/dashboard" class="text-gray-400 hover:text-white text-sm">← Dashboard</a>
			<h1 class="text-xl font-bold text-green-500">Location Pings</h1>
		</div>
		<span class="text-gray-500 text-sm">Last 100 pings</span>
	</header>

	<main class="p-8 max-w-6xl mx-auto">

		<div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
			<table class="w-full text-sm">
				<thead class="bg-gray-800 text-gray-400">
					<tr>
						<th class="text-left px-6 py-3">#</th>
						<th class="text-left px-6 py-3">Device ID</th>
						<th class="text-left px-6 py-3">Mithun</th>
						<th class="text-left px-6 py-3">Latitude</th>
						<th class="text-left px-6 py-3">Longitude</th>
						<th class="text-left px-6 py-3">Maps</th>
						<th class="text-left px-6 py-3">Time</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					{#each data.pings as ping}
						<tr class="hover:bg-gray-800/50 transition">
							<td class="px-6 py-4 text-gray-500">{ping.id}</td>
							<td class="px-6 py-4 font-mono font-bold text-green-400">{ping.device_id}</td>
							<td class="px-6 py-4">{ping.mithun_name ?? '—'}</td>
							<td class="px-6 py-4 font-mono">{ping.lat}</td>
							<td class="px-6 py-4 font-mono">{ping.lng}</td>
							<td class="px-6 py-4">
								<a
									href="https://www.google.com/maps?q={ping.lat},{ping.lng}"
									target="_blank"
									class="text-blue-400 hover:text-blue-300 text-xs underline"
								>
									View on Maps
								</a>
							</td>
							<td class="px-6 py-4 text-gray-400">{ping.ts}</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7" class="px-6 py-12 text-center text-gray-500">
								No pings yet. Waiting for devices to send data.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

	</main>
</div>
