<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const totalPages = $derived(Math.ceil(data.total / data.limit));

	let addingRow = $state(false);
	let editingRid = $state<number | null>(null);
	let selected = $state<Set<number>>(new Set());
	let sidebarOpen = $state(false);

	// columns editable on insert (exclude auto-increment integer pk)
	const insertCols = $derived(
		data.columnInfo.filter((c) => !(c.pk === 1 && c.type.toUpperCase() === 'INTEGER'))
	);

	const allRids = $derived(data.rows.map((r) => Number(r._rid)));
	const allSelected = $derived(allRids.length > 0 && allRids.every((id) => selected.has(id)));
	const someSelected = $derived(selected.size > 0);

	function toggleAll() {
		if (allSelected) {
			selected = new Set();
		} else {
			selected = new Set(allRids);
		}
	}

	function toggleRow(rid: number) {
		const next = new Set(selected);
		next.has(rid) ? next.delete(rid) : next.add(rid);
		selected = next;
	}

	function typeStyle(type: string) {
		const t = (type ?? '').toUpperCase();
		if (t.includes('INT'))   return 'text-blue-400 bg-blue-400/10';
		if (t.includes('TEXT') || t.includes('CHAR')) return 'text-green-400 bg-green-400/10';
		if (t.includes('REAL') || t.includes('FLOAT') || t.includes('DOUBLE')) return 'text-yellow-400 bg-yellow-400/10';
		if (t.includes('BLOB')) return 'text-purple-400 bg-purple-400/10';
		return 'text-gray-400 bg-gray-400/10';
	}

	function crudEnhance() {
		return ({ result, update }: { result: { type: string }; update: () => void }) => {
			if (result.type === 'success') {
				editingRid = null;
				addingRow = false;
				selected = new Set();
			}
			update();
		};
	}
</script>

<div class="flex h-full text-white relative">

	<!-- Mobile sidebar overlay -->
	{#if sidebarOpen}
		<button
			class="fixed inset-0 bg-black/60 z-20 lg:hidden"
			onclick={() => sidebarOpen = false}
			aria-label="Close sidebar"
		></button>
	{/if}

	<!-- Tables sidebar -->
	<aside class="
		fixed top-0 left-0 h-full w-52 bg-gray-900 border-r border-gray-800 flex-shrink-0 overflow-y-auto p-4 z-30 transition-transform duration-200
		{sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
		lg:relative lg:translate-x-0 lg:z-auto
	">
		<p class="text-xs text-gray-500 uppercase tracking-widest mb-3">Tables</p>
		{#each data.tables as table}
			<a
				href="/admin/db?table={table}"
				onclick={() => { addingRow = false; editingRid = null; sidebarOpen = false; }}
				class="block px-3 py-2 rounded-lg text-sm mb-1 transition
					{data.selected === table
						? 'bg-green-600/20 text-green-400 font-semibold'
						: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
			>
				{table}
			</a>
		{:else}
			<p class="text-gray-600 text-sm">No tables found</p>
		{/each}
	</aside>

	<!-- Main -->
	<div class="flex-1 overflow-y-auto p-4 sm:p-6 min-w-0">

		<!-- Header -->
		<div class="flex flex-wrap items-center justify-between gap-2 mb-5">
			<!-- Mobile: Tables toggle -->
			<button
				onclick={() => sidebarOpen = true}
				class="lg:hidden flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
				</svg>
				Tables
			</button>
		</div>
		<div class="flex flex-wrap items-center justify-between gap-2 mb-5">
			<div>
				<h2 class="text-xl font-bold">Database</h2>
				{#if data.selected}
					<p class="text-gray-500 text-xs mt-0.5">{data.selected} · {data.total} records</p>
				{/if}
			</div>
			<div class="flex flex-wrap items-center gap-2">
				{#if data.selected}
					<button
						onclick={() => { addingRow = !addingRow; editingRid = null; }}
						class="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded-lg transition"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
						</svg>
						Add Row
					</button>
				{/if}
				<a
					href="/admin/db/export-schema"
					download
					class="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg transition"
					title="Export all table schemas as .sql file"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
					</svg>
					Export Schema
				</a>
				<a
					href="/admin/db/query"
					class="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg transition"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
					</svg>
					SQL Runner
				</a>
			</div>
		</div>

		<!-- Bulk delete bar -->
		{#if someSelected}
			<form
				method="POST"
				action="?/deleteMany"
				use:enhance={crudEnhance}
				class="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4"
				onsubmit={(e) => { if (!confirm(`Delete ${selected.size} selected row${selected.size === 1 ? '' : 's'}?`)) e.preventDefault(); }}
			>
				<input type="hidden" name="__table__" value={data.selected} />
				{#each [...selected] as rid}
					<input type="hidden" name="__rowids__" value={rid} />
				{/each}
				<span class="text-red-400 text-sm font-medium">{selected.size} row{selected.size === 1 ? '' : 's'} selected</span>
				<button type="submit" class="ml-auto flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
					</svg>
					Delete Selected
				</button>
				<button type="button" onclick={() => selected = new Set()} class="text-gray-500 hover:text-white text-sm transition">Cancel</button>
			</form>
		{/if}

		<!-- Error from action -->
		{#if form?.error}
			<div class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4 font-mono">
				{form.error}
			</div>
		{/if}

		{#if data.selected}

			<!-- Add Row Form -->
			{#if addingRow}
				<div class="bg-gray-900 border border-green-600/30 rounded-xl p-5 mb-5">
					<p class="text-sm font-semibold text-green-400 mb-4">New Row</p>
					<form method="POST" action="?/insert" use:enhance={crudEnhance} class="space-y-3">
						<input type="hidden" name="__table__" value={data.selected} />
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{#each insertCols as col}
								<div>
									<label class="text-xs text-gray-500 mb-1 block">
										{col.name}
										<span class="ml-1 px-1.5 py-0.5 rounded text-xs font-mono {typeStyle(col.type)}">{col.type || 'ANY'}</span>
										{#if col.notnull}<span class="text-red-400 ml-1">*</span>{/if}
									</label>
									<input
										name={col.name}
										placeholder={col.dflt_value ?? col.name}
										class="w-full bg-gray-800 border border-gray-700 focus:border-green-500 focus:outline-none rounded-lg px-3 py-2 text-sm text-white"
									/>
								</div>
							{/each}
						</div>
						<div class="flex gap-2 pt-1">
							<button type="submit" class="bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">Insert</button>
							<button type="button" onclick={() => addingRow = false} class="text-gray-500 hover:text-white text-sm px-4 py-2 transition">Cancel</button>
						</div>
					</form>
				</div>
			{/if}

			<!-- Hidden forms for update/delete per row (outside table, referenced via form= attribute) -->
			{#each data.rows as row}
				<form id="del-{row._rid}" method="POST" action="?/delete" use:enhance={crudEnhance} class="hidden">
					<input type="hidden" name="__table__" value={data.selected} />
					<input type="hidden" name="__rowid__" value={row._rid} />
				</form>
				<form id="upd-{row._rid}" method="POST" action="?/update" use:enhance={crudEnhance} class="hidden">
					<input type="hidden" name="__table__" value={data.selected} />
					<input type="hidden" name="__rowid__" value={row._rid} />
				</form>
			{/each}

			<!-- Table -->
			{#if data.rows.length > 0}
				<div class="overflow-x-auto rounded-xl border border-gray-800">
					<table class="w-full text-sm whitespace-nowrap">
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
								{#each data.columnInfo as col}
									<th class="text-left px-4 py-3 font-medium">
										<span>{col.name}</span>
										<span class="ml-1.5 px-1.5 py-0.5 rounded text-xs font-mono {typeStyle(col.type)}">{col.type || 'ANY'}</span>
										{#if col.pk}<span class="ml-1 text-yellow-400 text-xs">PK</span>{/if}
									</th>
								{/each}
								<th class="text-left px-4 py-3 font-medium">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-800">
							{#each data.rows as row}
								<tr class="hover:bg-gray-800/30 transition group {selected.has(Number(row._rid)) ? 'bg-red-500/5' : ''}">
									<td class="px-4 py-2.5 w-10">
										<input
											type="checkbox"
											checked={selected.has(Number(row._rid))}
											onchange={() => toggleRow(Number(row._rid))}
											class="rounded border-gray-600 bg-gray-700 accent-green-500 cursor-pointer"
										/>
									</td>
									{#each data.columnInfo as col}
										<td class="px-4 py-2.5 max-w-xs">
											{#if editingRid === row._rid}
												<input
													name={col.name}
													value={row[col.name] ?? ''}
													form="upd-{row._rid}"
													class="w-full bg-gray-800 border border-gray-600 focus:border-green-500 focus:outline-none rounded px-2 py-1 text-sm text-white min-w-20"
												/>
											{:else if row[col.name] === null || row[col.name] === undefined}
												<span class="text-gray-600 italic text-xs">null</span>
											{:else}
												<span class="text-gray-300 truncate block max-w-xs">{row[col.name]}</span>
											{/if}
										</td>
									{/each}
									<td class="px-4 py-2.5">
										{#if editingRid === row._rid}
											<div class="flex gap-1">
												<button
													type="submit"
													form="upd-{row._rid}"
													class="text-xs px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white transition"
												>Save</button>
												<button
													type="button"
													onclick={() => editingRid = null}
													class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white transition"
												>Cancel</button>
											</div>
										{:else}
											<div class="flex gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition">
												<button
													type="button"
													onclick={() => { editingRid = Number(row._rid); addingRow = false; }}
													class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition"
												>Edit</button>
												<button
													type="submit"
													form="del-{row._rid}"
													onclick={(e) => { if (!confirm('Delete this row?')) e.preventDefault(); }}
													class="text-xs px-3 py-1.5 rounded-lg border border-red-800 text-red-400 hover:bg-red-500/10 transition"
												>Delete</button>
											</div>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="flex items-center gap-3 mt-3 text-sm text-gray-400">
						{#if data.page > 1}
							<a href="/admin/db?table={data.selected}&page={data.page - 1}" class="hover:text-white transition">← Prev</a>
						{/if}
						<span>Page {data.page} of {totalPages} · {data.total} records</span>
						{#if data.page < totalPages}
							<a href="/admin/db?table={data.selected}&page={data.page + 1}" class="hover:text-white transition">Next →</a>
						{/if}
					</div>
				{/if}

			{:else}
				<p class="text-gray-600 text-sm py-16 text-center">No records in this table</p>
			{/if}

		{:else}
			<p class="text-gray-600 text-sm py-16 text-center">Select a table from the sidebar</p>
		{/if}

	</div>
</div>
