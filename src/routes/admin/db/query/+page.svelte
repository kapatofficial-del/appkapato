<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
	let sql = $state(form?.sql ?? '');
</script>

<div class="p-8 max-w-5xl mx-auto space-y-6">

	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-white">Database</h2>
			<p class="text-gray-500 text-sm mt-1">SQL Runner</p>
		</div>
		<a
			href="/admin/db"
			class="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white text-sm px-4 py-2 rounded-lg transition"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<ellipse cx="12" cy="5" rx="9" ry="3"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12"/><path stroke-linecap="round" stroke-linejoin="round" d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
			</svg>
			Table Browser
		</a>
	</div>

	<form
		method="POST"
		action="?/run"
		use:enhance={() => ({ update }) => update({ reset: false })}
		class="space-y-3"
	>
		<div class="relative">
			<textarea
				name="sql"
				bind:value={sql}
				rows="10"
				placeholder="-- Examples:&#10;SELECT * FROM devices;&#10;&#10;CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT);&#10;&#10;INSERT INTO devices (device_id, mithun_name) VALUES ('KPT999', 'Raja');"
				spellcheck="false"
				onkeydown={(e) => {
					if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
						e.preventDefault();
						(e.currentTarget.closest('form') as HTMLFormElement)?.requestSubmit();
					}
				}}
				class="w-full bg-gray-900 border border-gray-700 focus:border-green-500 focus:outline-none rounded-xl px-4 py-3 font-mono text-sm text-white resize-y leading-relaxed"
			></textarea>
			<span class="absolute bottom-3 right-3 text-xs text-gray-600 pointer-events-none">Ctrl+Enter to run</span>
		</div>

		<div class="flex items-center gap-3">
			<button
				type="submit"
				class="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2.5 rounded-lg transition flex items-center gap-2"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M5 3l14 9-14 9V3z"/>
				</svg>
				Run Query
			</button>
			<button
				type="button"
				onclick={() => sql = ''}
				class="text-gray-500 hover:text-white text-sm transition"
			>
				Clear
			</button>
		</div>
	</form>

	<!-- Error -->
	{#if form?.error}
		<div class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 font-mono flex items-start gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
			</svg>
			{form.error}
		</div>
	{/if}

	<!-- DDL success -->
	{#if form && !form.error && form.ddl}
		<div class="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
			</svg>
			Statement executed successfully
		</div>
	{/if}

	<!-- DML success -->
	{#if form && !form.error && !form.ddl && form.rowsAffected !== null && form.rowsAffected !== undefined && (form.rows?.length ?? 0) === 0}
		<div class="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
			</svg>
			{form.rowsAffected} row{form.rowsAffected === 1 ? '' : 's'} affected
		</div>
	{/if}

	<!-- SELECT results -->
	{#if form?.rows && form.rows.length > 0}
		<div>
			<p class="text-gray-500 text-xs mb-2 font-mono">{form.rows.length} row{form.rows.length === 1 ? '' : 's'} returned</p>
			<div class="overflow-x-auto rounded-xl border border-gray-800">
				<table class="w-full text-sm whitespace-nowrap">
					<thead class="bg-gray-800 text-gray-400">
						<tr>
							{#each form.columns as col}
								<th class="text-left px-4 py-3 font-medium">{col}</th>
							{/each}
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-800">
						{#each form.rows as row}
							<tr class="hover:bg-gray-800/40 transition">
								{#each form.columns as col}
									<td class="px-4 py-3 max-w-xs truncate font-mono text-xs">
										{#if row[col] === null || row[col] === undefined}
											<span class="text-gray-600 italic">null</span>
										{:else}
											<span class="text-gray-300">{row[col]}</span>
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

</div>
