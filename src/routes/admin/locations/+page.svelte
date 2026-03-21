<script lang="ts">
	let { data } = $props();
</script>

<div class="p-8">

	<div class="mb-6 flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-white">Location Pings</h2>
			<p class="text-gray-500 text-sm mt-1">Last 100 incoming pings from devices</p>
		</div>
	</div>

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

</div>
