<script lang="ts">
	import logo from '$lib/assets/logo.png';

	let mobileMenuOpen = $state(false);
	let scrolled = $state(false);

	function handleScroll() {
		scrolled = window.scrollY > 20;
	}

	const links = [
		{ label: 'Home', href: '/' },
		{ label: 'About', href: '/about' }
	];
</script>

<svelte:window onscroll={handleScroll} />

<nav
	class="fixed top-0 w-full z-50 transition-all duration-300 {scrolled
		? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
		: 'bg-transparent'}"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16 sm:h-20 items-center">
			<a href="/" class="flex items-center gap-2 sm:gap-3 group">
				<img src={logo} alt="Kapato Logo" class="h-9 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
				<span class="font-display font-bold text-xl sm:text-2xl tracking-tight transition-colors duration-300 {scrolled ? 'text-secondary' : 'text-white'}">
					KAPATO
				</span>
			</a>

			<div class="hidden md:flex items-center space-x-1">
				{#each links as link}
					<a
						href={link.href}
						class="relative px-4 py-2 font-medium text-sm transition-colors duration-300 rounded-lg
							{scrolled ? 'text-gray-600 hover:text-primary hover:bg-primary/5' : 'text-white/80 hover:text-white hover:bg-white/10'}"
					>
						{link.label}
					</a>
				{/each}
				<div class="w-px h-6 mx-3 {scrolled ? 'bg-gray-200' : 'bg-white/20'}"></div>
				<a
					href="/#contact"
					class="bg-primary text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-primary-dark transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
				>
					Contact Us
				</a>
			</div>

			<button
				class="md:hidden p-2 -mr-2 rounded-lg transition-colors duration-300 {scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle menu"
			>
				<span class="material-icons text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden bg-white border-t border-gray-100 shadow-2xl animate-fade-in-up" style="animation-duration: 0.2s;">
			<div class="px-5 py-5 space-y-1">
				{#each links as link}
					<a
						href={link.href}
						class="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:text-primary hover:bg-primary/5 font-medium rounded-xl transition-all text-[15px]"
						onclick={() => (mobileMenuOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				<div class="pt-3 pb-1">
					<a
						href="/#contact"
						class="block bg-primary text-white px-5 py-3.5 rounded-xl font-semibold text-center hover:bg-primary-dark transition-all shadow-md text-[15px]"
						onclick={() => (mobileMenuOpen = false)}
					>
						Contact Us
					</a>
				</div>
			</div>
		</div>
	{/if}
</nav>
