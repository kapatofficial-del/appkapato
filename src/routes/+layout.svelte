<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Kapato - Professional Veterinary Services</title>
</svelte:head>

<div class="bg-background-light text-text-light font-sans transition-colors duration-200">
	<Navbar />
	{@render children()}
	<Footer />
</div>
