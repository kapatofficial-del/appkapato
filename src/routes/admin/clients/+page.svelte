<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	type Client = {
		id: string;
		name: string;
		email: string;
		password: string;
		phone: string | null;
		address: string | null;
		active: number;
		created_at: string;
	};

	let editingClient = $state<Client | null>(null);
	let showAdd = $state(false);

	let search = $state('');
	let statusFilter = $state('all');

	const filtered = $derived(data.clients.filter((c: Client) => {
		const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
		const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? c.active : !c.active);
		return matchSearch && matchStatus;
	}));

	function startEdit(client: Client) {
		editingClient = { ...client };
		showAdd = false;
	}

	function cancelEdit() {
		editingClient = null;
	}

	function crudEnhance() {
		return ({ result, update }: { result: { type: string }; update: () => void }) => {
			if (result.type === 'success') {
				editingClient = null;
				showAdd = false;
			}
			update();
		};
	}
</script>

<div class="p-4 sm:p-8 space-y-6">

	<div class="flex flex-wrap items-center justify-between gap-2">
		<div>
			<h2 class="text-2xl font-bold text-white">Clients</h2>
			<p class="text-gray-500 text-sm mt-1">Manage client accounts and credentials</p>
		</div>
		{#if !showAdd && !editingClient}
			<button
				onclick={() => showAdd = true}
				class="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
				</svg>
				Add Client
			</button>
		{/if}
	</div>

	<!-- Error -->
	{#if form?.error}
		<div class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
			{form.error}
		</div>
	{/if}

	<!-- Add Client Form -->
	{#if showAdd}
		<div class="bg-gray-900 border border-green-600/30 rounded-xl p-6">
			<p class="text-sm font-semibold text-green-400 mb-5">New Client</p>
			<form method="POST" action="?/create" use:enhance={crudEnhance} class="space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label class="text-xs text-gray-500 mb-1 block">Name <span class="text-red-400">*</span></label>
						<input name="name" placeholder="Full name" required class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block">Email <span class="text-red-400">*</span></label>
						<input name="email" type="email" placeholder="email@example.com" required class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block">Password <span class="text-red-400">*</span></label>
						<input name="password" placeholder="Password" required class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block">Phone</label>
						<input name="phone" placeholder="+91 XXXXX XXXXX" class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div class="sm:col-span-2">
						<label class="text-xs text-gray-500 mb-1 block">Address</label>
						<input name="address" placeholder="Full address" class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
				</div>
				<div class="flex gap-2 pt-1">
					<button type="submit" class="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">Create Client</button>
					<button type="button" onclick={() => showAdd = false} class="text-gray-500 hover:text-white text-sm px-4 py-2 transition">Cancel</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Edit Client Form -->
	{#if editingClient}
		<div class="bg-gray-900 border border-blue-600/30 rounded-xl p-6">
			<p class="text-sm font-semibold text-blue-400 mb-5">Edit Client</p>
			<form method="POST" action="?/update" use:enhance={crudEnhance} class="space-y-4">
				<input type="hidden" name="id" value={editingClient.id} />
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label class="text-xs text-gray-500 mb-1 block">Name <span class="text-red-400">*</span></label>
						<input name="name" value={editingClient.name} required class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block">Email <span class="text-red-400">*</span></label>
						<input name="email" type="email" value={editingClient.email} required class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block">Password <span class="text-red-400">*</span></label>
						<input name="password" value={editingClient.password} required class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div>
						<label class="text-xs text-gray-500 mb-1 block">Phone</label>
						<input name="phone" value={editingClient.phone ?? ''} class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
					</div>
					<div class="sm:col-span-2">
						<label class="text-xs text-gray-500 mb-1 block">Address</label>
						<input name="address" value={editingClient.address ?? ''} class="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white" />
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
	<div class="flex flex-wrap items-center gap-2">
		<div class="relative flex-1 max-w-sm">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
			</svg>
			<input bind:value={search} placeholder="Search name or email…" class="w-full bg-gray-900 border border-gray-800 focus:border-green-500 focus:outline-none rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600" />
		</div>
		<select bind:value={statusFilter} class="bg-gray-900 border border-gray-800 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white">
			<option value="all">All Status</option>
			<option value="active">Active</option>
			<option value="inactive">Inactive</option>
		</select>
		{#if search || statusFilter !== 'all'}
			<button onclick={() => { search = ''; statusFilter = 'all'; }} class="text-xs text-gray-500 hover:text-white transition">Clear</button>
		{/if}
		<span class="text-xs text-gray-600 ml-auto">{filtered.length} of {data.clients.length}</span>
	</div>

	<!-- Clients Table -->
	<div class="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
		<table class="w-full text-sm whitespace-nowrap">
			<thead class="bg-gray-800 text-gray-400">
				<tr>
					<th class="text-left px-6 py-3">Name</th>
					<th class="text-left px-6 py-3">Email</th>
					<th class="text-left px-6 py-3">Phone</th>
					<th class="text-left px-6 py-3">Status</th>
					<th class="text-left px-6 py-3">Created</th>
					<th class="text-left px-6 py-3">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-800">
				{#each filtered as client (client.id)}
					<tr class="hover:bg-gray-800/50 transition {editingClient?.id === client.id ? 'bg-blue-500/5' : ''}">
						<td class="px-6 py-4 font-medium">{client.name}</td>
						<td class="px-6 py-4 text-gray-300">{client.email}</td>
						<td class="px-6 py-4 text-gray-400">{client.phone ?? '—'}</td>
						<td class="px-6 py-4">
							<span class="px-2 py-1 rounded-full text-xs font-medium {client.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}">
								{client.active ? 'Active' : 'Inactive'}
							</span>
						</td>
						<td class="px-6 py-4 text-gray-400 text-xs">{client.created_at}</td>
						<td class="px-6 py-4">
							<div class="flex gap-2">
								<a
									href="/admin/clients/{client.id}"
									class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition"
								>
									View
								</a>
								<button
									type="button"
									onclick={() => startEdit(client)}
									class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition"
								>
									Edit
								</button>
								<form method="POST" action="?/toggle" use:enhance={crudEnhance}>
									<input type="hidden" name="id" value={client.id} />
									<input type="hidden" name="active" value={client.active} />
									<button type="submit" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white transition">
										{client.active ? 'Deactivate' : 'Activate'}
									</button>
								</form>
								<form method="POST" action="?/delete" use:enhance={crudEnhance}>
									<input type="hidden" name="id" value={client.id} />
									<button
										type="submit"
										onclick={(e) => { if (!confirm(`Delete ${client.name}?`)) e.preventDefault(); }}
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
						<td colspan="6" class="px-6 py-12 text-center text-gray-500">No clients yet. Add your first client above.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<p class="text-xs text-gray-600">{data.clients.length} client{data.clients.length === 1 ? '' : 's'} total</p>

</div>
