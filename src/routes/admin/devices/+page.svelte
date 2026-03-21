<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<div class="p-8 max-w-4xl mx-auto space-y-8">

	<div>
		<h2 class="text-2xl font-bold text-white">Devices</h2>
		<p class="text-gray-500 text-sm mt-1">Add or manage GPS tracking devices</p>
	</div>

	<!-- Add Device Form -->
	<div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
		<h3 class="text-base font-semibold mb-4">Add New Device</h3>

		{#if form?.error}
			<div class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
				{form.error}
			</div>
		{/if}

		<form method="POST" action="?/create" use:enhance class="flex gap-3 flex-wrap">
			<input
				name="device_id"
				placeholder="Device ID (e.g. KPT001)"
				required
				class="bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-green-500 flex-1 min-w-40"
			/>
			<input
				name="mithun_name"
				placeholder="Mithun Name (e.g. Raja)"
				required
				class="bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-green-500 flex-1 min-w-40"
			/>
			<button
				type="submit"
				class="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2.5 rounded-lg transition"
			>
				Add Device
			</button>
		</form>
	</div>

	<!-- Devices List -->
	<div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
		<table class="w-full text-sm">
			<thead class="bg-gray-800 text-gray-400">
				<tr>
					<th class="text-left px-6 py-3">Device ID</th>
					<th class="text-left px-6 py-3">Mithun Name</th>
					<th class="text-left px-6 py-3">Status</th>
					<th class="text-left px-6 py-3">Created</th>
					<th class="text-left px-6 py-3">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-800">
				{#each data.devices as device}
					<tr class="hover:bg-gray-800/50 transition">
						<td class="px-6 py-4 font-mono font-bold">{device.device_id}</td>
						<td class="px-6 py-4">{device.mithun_name}</td>
						<td class="px-6 py-4">
							<span class="px-2 py-1 rounded-full text-xs font-medium {device.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}">
								{device.active ? 'Active' : 'Inactive'}
							</span>
						</td>
						<td class="px-6 py-4 text-gray-400">{device.created_at}</td>
						<td class="px-6 py-4 flex gap-2">
							<form method="POST" action="?/toggle" use:enhance>
								<input type="hidden" name="device_id" value={device.device_id} />
								<input type="hidden" name="active" value={device.active} />
								<button type="submit" class="text-xs px-3 py-1 rounded-lg border border-gray-700 hover:border-gray-500 transition">
									{device.active ? 'Deactivate' : 'Activate'}
								</button>
							</form>
							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="device_id" value={device.device_id} />
								<button type="submit" class="text-xs px-3 py-1 rounded-lg border border-red-800 text-red-400 hover:bg-red-500/10 transition">
									Delete
								</button>
							</form>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5" class="px-6 py-8 text-center text-gray-500">No devices yet. Add your first device above.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

</div>
