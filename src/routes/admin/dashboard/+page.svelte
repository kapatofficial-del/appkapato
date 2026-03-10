<script lang="ts">
	async function logout() {
		await fetch('/admin/logout', { method: 'POST' });
		window.location.href = '/admin/login';
	}
</script>

<div class="min-h-screen bg-gray-950 text-white">

	<header class="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
		<h1 class="text-xl font-bold text-green-500">Kapato Admin</h1>
		<button
			onclick={logout}
			class="text-sm text-gray-400 hover:text-white transition"
		>
			Logout
		</button>
	</header>

	<main class="p-8">
		<h2 class="text-2xl font-semibold mb-6">Dashboard</h2>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
			<div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
				<p class="text-gray-400 text-sm">Total Animals</p>
				<p class="text-3xl font-bold mt-1">0</p>
			</div>
			<div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
				<p class="text-gray-400 text-sm">Active Trackers</p>
				<p class="text-3xl font-bold mt-1">0</p>
			</div>
			<div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
				<p class="text-gray-400 text-sm">Alerts</p>
				<p class="text-3xl font-bold mt-1">0</p>
			</div>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<a href="/admin/devices" class="bg-gray-900 border border-gray-800 hover:border-green-600 rounded-xl p-6 transition">
				<p class="text-green-500 font-semibold">Manage Devices →</p>
				<p class="text-gray-400 text-sm mt-1">Add or manage GPS tracking devices</p>
			</a>
			<a href="/admin/locations" class="bg-gray-900 border border-gray-800 hover:border-blue-600 rounded-xl p-6 transition">
				<p class="text-blue-400 font-semibold">Location Pings →</p>
				<p class="text-gray-400 text-sm mt-1">View incoming GPS pings from devices</p>
			</a>
		</div>
	</main>

</div>
