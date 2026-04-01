<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let editing = $state(false);
</script>

<div class="p-4 sm:p-8 space-y-6">

	<!-- Back + Header -->
	<div>
		<a href="/admin/clients" class="text-gray-500 hover:text-white text-sm transition flex items-center gap-1.5 mb-4">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
			</svg>
			Back to Clients
		</a>
		<div class="flex flex-wrap items-start justify-between gap-2">
			<div>
				<h2 class="text-2xl font-bold text-white">{data.client.name}</h2>
				<p class="text-gray-500 text-sm mt-1">{data.client.email}</p>
			</div>
			<div class="flex items-center gap-2">
				<span class="px-2.5 py-1 rounded-full text-xs font-medium {data.client.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}">
					{data.client.active ? 'Active' : 'Inactive'}
				</span>
				<form method="POST" action="?/toggle" use:enhance>
					<button type="submit" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition">
						{data.client.active ? 'Deactivate' : 'Activate'}
					</button>
				</form>
				<button
					onclick={() => editing = !editing}
					class="text-xs px-3 py-1.5 rounded-lg border {editing ? 'border-blue-600 text-blue-400' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'} transition"
				>
					{editing ? 'Cancel Edit' : 'Edit'}
				</button>
			</div>
		</div>
	</div>

	<!-- Error -->
	{#if form?.error}
		<div class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
			{form.error}
		</div>
	{/if}

	<!-- Client Info / Edit Form -->
	<div class="bg-gray-900 border {editing ? 'border-blue-600/30' : 'border-gray-800'} rounded-xl p-6 transition">
		{#if editing}
			<p class="text-sm font-semibold text-blue-400 mb-5">Edit Client</p>
			<form method="POST" action="?/update" use:enhance={() => ({ result, update }) => { if (result.type === 'success') editing = false; update(); }} class="space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="name">Name <span class="text-red-400">*</span></label>
						<input id="name" name="name" value={data.client.name} required class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="email">Email <span class="text-red-400">*</span></label>
						<input id="email" name="email" type="email" value={data.client.email} required class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="password">Password <span class="text-red-400">*</span></label>
						<input id="password" name="password" value={data.client.password} required class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="phone">Phone</label>
						<input id="phone" name="phone" value={data.client.phone ?? ''} class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div class="sm:col-span-2">
						<label class="text-xs text-gray-500 mb-1 block" for="address">Address</label>
						<input id="address" name="address" value={data.client.address ?? ''} class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
				</div>
				<div class="flex gap-2 pt-1">
					<button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">Save Changes</button>
					<button type="button" onclick={() => editing = false} class="text-gray-500 hover:text-white text-sm px-4 py-2 transition">Cancel</button>
				</div>
			</form>
		{:else}
			<p class="text-xs text-gray-500 uppercase tracking-widest mb-4">Client Info</p>
			<dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
				<div>
					<dt class="text-gray-500 mb-1">Name</dt>
					<dd class="text-white font-medium">{data.client.name}</dd>
				</div>
				<div>
					<dt class="text-gray-500 mb-1">Email</dt>
					<dd class="text-white">{data.client.email}</dd>
				</div>
				<div>
					<dt class="text-gray-500 mb-1">Phone</dt>
					<dd class="text-white">{data.client.phone ?? '—'}</dd>
				</div>
				<div>
					<dt class="text-gray-500 mb-1">Member Since</dt>
					<dd class="text-gray-400">{data.client.created_at}</dd>
				</div>
				<div class="sm:col-span-2">
					<dt class="text-gray-500 mb-1">Address</dt>
					<dd class="text-white">{data.client.address ?? '—'}</dd>
				</div>
			</dl>
		{/if}
	</div>

	<!-- Assigned Devices -->
	<div>
		<div class="flex items-center justify-between mb-3">
			<p class="text-sm font-semibold text-white">Assigned Devices <span class="ml-2 text-gray-500 font-normal">({data.devices.length})</span></p>
		</div>

		<div class="bg-gray-900 border border-gray-800 rounded-xl">
			<div class="overflow-x-auto rounded-xl">
			<table class="w-full text-sm whitespace-nowrap">
				<thead class="bg-gray-800 text-gray-400">
					<tr>
						<th class="text-left px-6 py-3">Device ID</th>
						<th class="text-left px-6 py-3">Mithun Name</th>
						<th class="text-left px-6 py-3">Status</th>
						<th class="text-left px-6 py-3">Added</th>
						<th class="text-left px-6 py-3">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-800">
					{#each data.devices as device (device.id)}
						<tr class="hover:bg-gray-800/50 transition">
							<td class="px-6 py-4 font-mono font-bold text-green-400">{device.device_id}</td>
							<td class="px-6 py-4 font-medium">{device.mithun_name}</td>
							<td class="px-6 py-4">
								<span class="px-2 py-1 rounded-full text-xs font-medium {device.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}">
									{device.active ? 'Active' : 'Inactive'}
								</span>
							</td>
							<td class="px-6 py-4 text-gray-400 text-xs">{device.created_at}</td>
							<td class="px-6 py-4">
								<form method="POST" action="?/unassignDevice" use:enhance>
									<input type="hidden" name="device_id" value={device.id} />
									<button
										type="submit"
										onclick={(e) => { if (!confirm(`Unassign ${device.device_id} from this client?`)) e.preventDefault(); }}
										class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-red-700 hover:text-red-400 transition"
									>
										Unassign
									</button>
								</form>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-6 py-8 text-center text-gray-500">No devices assigned to this client.</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		</div>

		<!-- Assign a device -->
		{#if data.unassigned.length > 0}
			<form method="POST" action="?/assignDevice" use:enhance class="flex flex-wrap items-center gap-2 mt-3">
				<select
					name="device_id"
					class="bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white flex-1"
				>
					<option value="">Select an unassigned device…</option>
					{#each data.unassigned as device}
						<option value={device.id}>{device.device_id} — {device.mithun_name}</option>
					{/each}
				</select>
				<button type="submit" class="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition whitespace-nowrap">
					Assign Device
				</button>
			</form>
		{/if}
	</div>

</div>
