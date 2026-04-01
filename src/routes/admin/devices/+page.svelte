<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	type Device = {
		id: number;
		device_id: string;
		mithun_name: string;
		client_id: string | null;
		client_name: string | null;
		active: number;
		created_at: string;
	};

	let editingDevice = $state<Device | null>(null);
	let showAdd = $state(false);

	let search = $state('');
	let statusFilter = $state('all');
	let clientFilter = $state('all');

	const filtered = $derived(data.devices.filter((d: Device) => {
		const matchSearch = !search || d.device_id.toLowerCase().includes(search.toLowerCase()) || d.mithun_name.toLowerCase().includes(search.toLowerCase());
		const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? d.active : !d.active);
		const matchClient = clientFilter === 'all' || (clientFilter === 'unassigned' ? !d.client_id : d.client_id === clientFilter);
		return matchSearch && matchStatus && matchClient;
	}));

	function startEdit(device: Device) {
		editingDevice = { ...device };
		showAdd = false;
	}

	function cancelEdit() {
		editingDevice = null;
	}

	function crudEnhance() {
		return ({ result, update }: { result: { type: string }; update: () => void }) => {
			if (result.type === 'success') {
				editingDevice = null;
				showAdd = false;
			}
			update();
		};
	}
</script>

<div class="p-4 sm:p-8 space-y-6">

	<div class="flex flex-wrap items-center justify-between gap-2">
		<div>
			<h2 class="text-2xl font-bold text-white">Devices</h2>
			<p class="text-gray-500 text-sm mt-1">Manage GPS tracking devices assigned to Mithun</p>
		</div>
		{#if !showAdd && !editingDevice}
			<button
				onclick={() => showAdd = true}
				class="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
				</svg>
				Add Device
			</button>
		{/if}
	</div>

	<!-- Error -->
	{#if form?.error}
		<div class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
			{form.error}
		</div>
	{/if}

	<!-- Add Device Form -->
	{#if showAdd}
		<div class="bg-gray-900 border border-green-600/30 rounded-xl p-6">
			<p class="text-sm font-semibold text-green-400 mb-5">New Device</p>
			<form method="POST" action="?/create" use:enhance={crudEnhance} class="space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="add-device-id">
							Device ID <span class="text-red-400">*</span>
						</label>
						<input
							id="add-device-id"
							name="device_id"
							value={data.nextId}
							required
							class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white font-mono"
						/>
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="add-mithun-name">
							Mithun Name <span class="text-red-400">*</span>
						</label>
						<input
							id="add-mithun-name"
							name="mithun_name"
							placeholder="e.g. Raja"
							required
							class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white"
						/>
					</div>
					<div class="sm:col-span-2">
						<label class="text-xs text-gray-500 mb-1 block" for="add-client">
							Assign to Client <span class="text-gray-600">(optional)</span>
						</label>
						<select
							id="add-client"
							name="client_id"
							class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white"
						>
							<option value="">— Unassigned —</option>
							{#each data.clients as client}
								<option value={client.id}>{client.name}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="flex gap-2 pt-1">
					<button type="submit" class="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">Add Device</button>
					<button type="button" onclick={() => showAdd = false} class="text-gray-500 hover:text-white text-sm px-4 py-2 transition">Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Edit Device Form -->
	{#if editingDevice}
		<div class="bg-gray-900 border border-blue-600/30 rounded-xl p-6">
			<p class="text-sm font-semibold text-blue-400 mb-5">Edit Device</p>
			<form method="POST" action="?/update" use:enhance={crudEnhance} class="space-y-4">
				<input type="hidden" name="id" value={editingDevice.id} />
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="edit-device-id">
							Device ID <span class="text-red-400">*</span>
						</label>
						<input
							id="edit-device-id"
							name="device_id"
							value={editingDevice.device_id}
							required
							class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white font-mono"
						/>
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block" for="edit-mithun-name">
							Mithun Name <span class="text-red-400">*</span>
						</label>
						<input
							id="edit-mithun-name"
							name="mithun_name"
							value={editingDevice.mithun_name}
							required
							class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white"
						/>
					</div>
					<div class="sm:col-span-2">
						<label class="text-xs text-gray-500 mb-1 block" for="edit-client">
							Assign to Client <span class="text-gray-600">(optional)</span>
						</label>
						<select
							id="edit-client"
							name="client_id"
							class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white"
						>
							<option value="">— Unassigned —</option>
							{#each data.clients as client}
								<option value={client.id} selected={editingDevice.client_id === client.id}>{client.name}</option>
							{/each}
						</select>
					</div>
				</div>
				<div class="flex gap-2 pt-1">
					<button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">Save Changes</button>
					<button type="button" onclick={cancelEdit} class="text-gray-500 hover:text-white text-sm px-4 py-2 transition">Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Filters -->
	<div class="flex items-center gap-2 flex-wrap">
		<div class="relative flex-1 min-w-0">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
			</svg>
			<input bind:value={search} placeholder="Search device ID or Mithun name…" class="w-full bg-gray-900 border border-gray-800 focus:border-green-500 focus:outline-none rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600" />
		</div>
		<select bind:value={clientFilter} class="bg-gray-900 border border-gray-800 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white">
			<option value="all">All Clients</option>
			<option value="unassigned">Unassigned</option>
			{#each data.clients as client}
				<option value={client.id}>{client.name}</option>
			{/each}
		</select>
		<select bind:value={statusFilter} class="bg-gray-900 border border-gray-800 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white">
			<option value="all">All Status</option>
			<option value="active">Active</option>
			<option value="inactive">Inactive</option>
		</select>
		{#if search || statusFilter !== 'all' || clientFilter !== 'all'}
			<button onclick={() => { search = ''; statusFilter = 'all'; clientFilter = 'all'; }} class="text-xs text-gray-500 hover:text-white transition">Clear</button>
		{/if}
		<span class="text-xs text-gray-600 ml-auto">{filtered.length} of {data.devices.length}</span>
	</div>

	<!-- Devices Table -->
	<div class="bg-gray-900 border border-gray-800 rounded-xl">
	<div class="overflow-x-auto rounded-xl">
		<table class="w-full text-sm whitespace-nowrap">
			<thead class="bg-gray-800 text-gray-400">
				<tr>
					<th class="text-left px-6 py-3">Device ID</th>
					<th class="text-left px-6 py-3">Mithun Name</th>
					<th class="text-left px-6 py-3">Client</th>
					<th class="text-left px-6 py-3">Status</th>
					<th class="text-left px-6 py-3">Created</th>
					<th class="text-left px-6 py-3">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-800">
				{#each filtered as device (device.id)}
					<tr class="hover:bg-gray-800/50 transition {editingDevice?.id === device.id ? 'bg-blue-500/5' : ''}">
						<td class="px-6 py-4 font-mono font-bold text-green-400">{device.device_id}</td>
						<td class="px-6 py-4 font-medium">{device.mithun_name}</td>
						<td class="px-6 py-4">
							{#if device.client_name}
								<span class="text-gray-300">{device.client_name}</span>
							{:else}
								<span class="text-gray-600 italic text-xs">Unassigned</span>
							{/if}
						</td>
						<td class="px-6 py-4">
							<span class="px-2 py-1 rounded-full text-xs font-medium {device.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}">
								{device.active ? 'Active' : 'Inactive'}
							</span>
						</td>
						<td class="px-6 py-4 text-gray-400 text-xs">{device.created_at}</td>
						<td class="px-6 py-4">
							<div class="flex gap-2">
								<a
									href="/admin/devices/{device.id}"
									class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition"
								>
									View
								</a>
								<button
									type="button"
									onclick={() => startEdit(device)}
									class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition"
								>
									Edit
								</button>
								<form method="POST" action="?/toggle" use:enhance={crudEnhance}>
									<input type="hidden" name="id" value={device.id} />
									<input type="hidden" name="active" value={device.active} />
									<button type="submit" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition">
										{device.active ? 'Deactivate' : 'Activate'}
									</button>
								</form>
								<form method="POST" action="?/delete" use:enhance={crudEnhance}>
									<input type="hidden" name="id" value={device.id} />
									<button
										type="submit"
										onclick={(e) => { if (!confirm(`Delete device ${device.device_id}?`)) e.preventDefault(); }}
										class="text-xs px-3 py-1.5 rounded-lg border border-red-800 text-red-400 hover:bg-red-500/10 transition"
									>
										Delete
									</button>
								</form>
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="px-6 py-12 text-center text-gray-500">No devices yet. Add your first device above.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	</div>

	<p class="text-xs text-gray-600">{data.devices.length} device{data.devices.length === 1 ? '' : 's'} total</p>

</div>
