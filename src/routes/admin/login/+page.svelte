<script lang="ts">
	let username = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		const res = await fetch('/admin/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		const data = await res.json();
		loading = false;

		if (data.success) {
			window.location.href = '/admin/dashboard';
		} else {
			error = data.message || 'Invalid credentials';
		}
	}
</script>

<div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
	<div class="w-full max-w-md">

		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-white">Kapato Admin</h1>
			<p class="text-gray-400 mt-2">Sign in to your dashboard</p>
		</div>

		<form onsubmit={handleLogin} class="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800 space-y-5">

			{#if error}
				<div class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
					{error}
				</div>
			{/if}

			<div class="space-y-1">
				<label for="username" class="text-sm text-gray-400">Username</label>
				<input
					id="username"
					type="text"
					bind:value={username}
					placeholder="admin"
					required
					class="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-green-500 transition"
				/>
			</div>

			<div class="space-y-1">
				<label for="password" class="text-sm text-gray-400">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="••••••••"
					required
					class="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:outline-none focus:border-green-500 transition"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
			>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>

		</form>
	</div>
</div>
