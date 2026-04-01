<script lang="ts">
	import './admin.css';
	import { page } from '$app/stores';

	let { children } = $props();
	let mobileOpen = $state(false);

	const isLogin = $derived($page.url.pathname === '/admin/login');

	async function logout() {
		await fetch('/admin/logout', { method: 'POST' });
		window.location.href = '/admin/login';
	}

	const nav = [
		{
			href: '/admin/dashboard',
			label: 'Dashboard',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
		},
		{
			href: '/admin/clients',
			label: 'Clients',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
		},
		{
			href: '/admin/devices',
			label: 'Devices',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/></svg>`
		},
		{
			href: '/admin/locations',
			label: 'Location Pings',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
		},
		{
			href: '/admin/db',
			label: 'Database',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12"/><path stroke-linecap="round" stroke-linejoin="round" d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/></svg>`
		}
	];

	function isActive(href: string) {
		return $page.url.pathname.startsWith(href);
	}
</script>

{#if isLogin}
	{@render children()}
{:else}
	<div class="flex h-screen bg-gray-950 text-white overflow-hidden">

		<!-- Mobile overlay -->
		{#if mobileOpen}
			<button
				class="fixed inset-0 bg-black/60 z-20 lg:hidden"
				onclick={() => mobileOpen = false}
				aria-label="Close menu"
			></button>
		{/if}

		<!-- Sidebar -->
		<aside class="
			fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800
			flex flex-col z-30 transition-transform duration-200
			{mobileOpen ? 'translate-x-0' : '-translate-x-full'}
			lg:translate-x-0
		">
			<!-- Logo -->
			<div class="px-6 py-5 border-b border-gray-800">
				<p class="text-green-500 font-bold text-xl tracking-tight">Kapato</p>
				<p class="text-gray-600 text-xs mt-0.5">Admin Panel</p>
			</div>

			<!-- Nav -->
			<nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
				{#each nav as item}
					<a
						href={item.href}
						onclick={() => mobileOpen = false}
						class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
							{isActive(item.href)
								? 'bg-green-600/15 text-green-400 font-medium'
								: 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
					>
						{@html item.icon}
						{item.label}
					</a>
				{/each}
			</nav>

			<!-- Logout -->
			<div class="px-3 py-4 border-t border-gray-800">
				<button
					onclick={logout}
					class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
					</svg>
					Logout
				</button>
			</div>
		</aside>

		<!-- Main -->
		<div class="flex-1 flex flex-col min-h-screen lg:ml-64 min-w-0">

			<!-- Top bar (mobile) -->
			<header class="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-4 lg:hidden">
				<button
					onclick={() => mobileOpen = !mobileOpen}
					class="text-gray-400 hover:text-white transition p-1"
					aria-label="Toggle menu"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
					</svg>
				</button>
				<p class="text-green-500 font-bold">Kapato Admin</p>
			</header>

			<!-- Page content -->
			<main class="flex-1 overflow-y-auto min-w-0">
				{@render children()}
			</main>

		</div>
	</div>
{/if}
