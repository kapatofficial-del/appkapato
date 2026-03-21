<script lang="ts">
	import loginImg from '$lib/assets/login.jpg';

	let username = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let showPassword = $state(false);

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

<div class="min-h-screen flex">

	<!-- Left: Image Panel -->
	<div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
		<img src={loginImg} alt="Mithun" class="absolute inset-0 w-full h-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
		<div class="absolute bottom-10 left-10 right-10">
			<p class="text-white text-3xl font-bold leading-snug">Kapato</p>
			<p class="text-gray-300 mt-2 text-sm">Mithun Tracking & Management System</p>
		</div>
	</div>

	<!-- Right: Login Form -->
	<div class="w-full lg:w-1/2 bg-gray-950 flex items-center justify-center px-8 py-12">
		<div class="w-full max-w-sm">

			<div class="mb-10">
				<h1 class="text-3xl font-bold text-white">Welcome back</h1>
				<p class="text-gray-500 mt-2 text-sm">Sign in to the admin dashboard</p>
			</div>

			<form onsubmit={handleLogin} class="space-y-5">

				{#if error}
					<div class="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
						{error}
					</div>
				{/if}

				<!-- Username -->
				<div class="space-y-1.5">
					<label for="username" class="text-sm text-gray-400">Username</label>
					<input
						id="username"
						type="text"
						bind:value={username}
						placeholder="admin"
						required
						autocomplete="username"
						class="w-full bg-gray-900 text-white rounded-xl px-4 py-3 border border-gray-800 focus:outline-none focus:border-green-500 transition placeholder-gray-600"
					/>
				</div>

				<!-- Password -->
				<div class="space-y-1.5">
					<label for="password" class="text-sm text-gray-400">Password</label>
					<div class="relative">
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder="••••••••"
							required
							autocomplete="current-password"
							class="w-full bg-gray-900 text-white rounded-xl px-4 py-3 pr-12 border border-gray-800 focus:outline-none focus:border-green-500 transition placeholder-gray-600"
						/>
						<button
							type="button"
							onclick={() => showPassword = !showPassword}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition p-1"
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{#if showPassword}
								<!-- Eye Off -->
								<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
								</svg>
							{:else}
								<!-- Eye -->
								<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							{/if}
						</button>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition mt-2"
				>
					{loading ? 'Signing in...' : 'Sign In'}
				</button>

			</form>
		</div>
	</div>

</div>
