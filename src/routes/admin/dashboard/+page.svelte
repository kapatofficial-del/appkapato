<script lang="ts">
	let { data } = $props();
</script>

<div class="p-4 sm:p-8 space-y-6">

	<div>
		<h2 class="text-2xl font-bold text-white">Dashboard</h2>
		<p class="text-gray-500 text-sm mt-1">Overview of your tracking system</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
		<div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
			<p class="text-gray-500 text-xs uppercase tracking-wide">Clients</p>
			<p class="text-3xl font-bold text-white mt-1">{data.totalClients}</p>
			<p class="text-xs text-gray-600 mt-1">{data.activeClients} active</p>
		</div>
		<div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
			<p class="text-gray-500 text-xs uppercase tracking-wide">Devices</p>
			<p class="text-3xl font-bold text-white mt-1">{data.totalDevices}</p>
			<p class="text-xs text-gray-600 mt-1">{data.activeDevices} active · {data.unassigned} unassigned</p>
		</div>
		<div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
			<p class="text-gray-500 text-xs uppercase tracking-wide">Total Pings</p>
			<p class="text-3xl font-bold text-white mt-1">{data.totalPings.toLocaleString()}</p>
			<p class="text-xs text-gray-600 mt-1">all time</p>
		</div>
		<div class="bg-gray-900 border border-gray-800 rounded-xl p-5">
			<p class="text-gray-500 text-xs uppercase tracking-wide">Today's Pings</p>
			<p class="text-3xl font-bold text-green-400 mt-1">{data.todayPings.toLocaleString()}</p>
			<p class="text-xs text-gray-600 mt-1">since midnight</p>
		</div>
	</div>

	<!-- Recent pings + Quick links -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

		<!-- Recent pings -->
		<div class="bg-gray-900 border border-gray-800 rounded-xl">
			<div class="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
				<p class="text-sm font-semibold text-white">Recent Pings</p>
				<a href="/admin/locations" class="text-xs text-gray-500 hover:text-white transition">View all →</a>
			</div>
			{#if data.recentPings.length > 0}
				<div class="overflow-x-auto rounded-b-xl">
					<table class="w-full text-xs whitespace-nowrap">
						<tbody class="divide-y divide-gray-800">
							{#each data.recentPings as ping}
								<tr class="hover:bg-gray-800/50 transition">
									<td class="px-5 py-3 font-mono font-bold text-green-400">{ping.device_id}</td>
									<td class="px-5 py-3 text-gray-300">{ping.mithun_name ?? '—'}</td>
									<td class="px-5 py-3 font-mono text-gray-500">{ping.lat}, {ping.lng}</td>
									<td class="px-5 py-3 text-gray-600">{ping.ts}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="px-5 py-8 text-center text-gray-600 text-sm">No pings yet.</p>
			{/if}
		</div>

		<!-- Quick links -->
		<div class="grid grid-cols-2 gap-4 content-start">
			<a href="/admin/clients" class="bg-gray-900 border border-gray-800 hover:border-green-600/50 rounded-xl p-5 transition">
				<p class="text-green-400 font-semibold text-sm">Clients →</p>
				<p class="text-gray-500 text-xs mt-1">Manage client accounts</p>
			</a>
			<a href="/admin/devices" class="bg-gray-900 border border-gray-800 hover:border-blue-600/50 rounded-xl p-5 transition">
				<p class="text-blue-400 font-semibold text-sm">Devices →</p>
				<p class="text-gray-500 text-xs mt-1">GPS tracking devices</p>
			</a>
			<a href="/admin/locations" class="bg-gray-900 border border-gray-800 hover:border-yellow-600/50 rounded-xl p-5 transition">
				<p class="text-yellow-400 font-semibold text-sm">Location Pings →</p>
				<p class="text-gray-500 text-xs mt-1">Incoming GPS pings</p>
			</a>
			<a href="/admin/db" class="bg-gray-900 border border-gray-800 hover:border-purple-600/50 rounded-xl p-5 transition">
				<p class="text-purple-400 font-semibold text-sm">Database →</p>
				<p class="text-gray-500 text-xs mt-1">Browse tables & SQL</p>
			</a>
		</div>

	</div>

</div>
