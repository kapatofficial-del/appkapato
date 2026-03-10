<script lang="ts">
	import mithunImg from '$lib/assets/mithun.png';
	import logo from '$lib/assets/logo.png';

	interface Service {
		icon: string;
		title: string;
		description: string;
		accent: string;
		iconBg: string;
	}

	const services: Service[] = [
		{
			icon: 'satellite_alt',
			title: 'GPS Animal Monitoring',
			description: 'Real-time tracking solutions to monitor herd health and location, reducing loss and improving management efficiency.',
			accent: 'from-blue-500 to-cyan-500',
			iconBg: 'bg-blue-500/10 text-blue-600'
		},
		{
			icon: 'local_shipping',
			title: 'Mobile Vet Clinics',
			description: 'Fully equipped mobile units providing vaccinations, check-ups, and emergency care in underserved rural locations.',
			accent: 'from-primary to-orange-400',
			iconBg: 'bg-primary/10 text-primary'
		},
		{
			icon: 'pets',
			title: 'Sterilization Programs',
			description: 'Ethical animal birth control for street dogs and cats in collaboration with local government bodies.',
			accent: 'from-teal-500 to-emerald-500',
			iconBg: 'bg-teal-500/10 text-teal-600'
		},
		{
			icon: 'agriculture',
			title: 'Farmer Training',
			description: 'Specialized programs for piggery, goatery, poultry, fishery, and Mithun management.',
			accent: 'from-green-500 to-lime-500',
			iconBg: 'bg-green-500/10 text-green-600'
		},
		{
			icon: 'health_and_safety',
			title: 'Pet Parent Workshops',
			description: 'Workshops covering first aid, nutrition, behavior, and grooming for pet owners.',
			accent: 'from-purple-500 to-pink-500',
			iconBg: 'bg-purple-500/10 text-purple-600'
		},
		{
			icon: 'policy',
			title: 'Insurance Facilitation',
			description: 'Livestock insurance support and tie-ups with insurance companies to protect assets.',
			accent: 'from-indigo-500 to-blue-500',
			iconBg: 'bg-indigo-500/10 text-indigo-600'
		}
	];

	const features = [
		{ icon: 'gps_fixed', title: 'Technology Driven', stat: '24/7', statLabel: 'Tracking' },
		{ icon: 'medical_services', title: 'Mobile Clinics', stat: '100+', statLabel: 'Areas' },
		{ icon: 'school', title: 'Education', stat: '500+', statLabel: 'Trained' }
	];
</script>

<!-- Hero Section -->
<section class="relative min-h-[75vh] sm:min-h-screen flex items-end sm:items-center overflow-hidden">
	<!-- Background image -->
	<div class="absolute inset-0">
		<img
			src={mithunImg}
			alt="Mithun cattle in a green field representing livestock management"
			class="w-full h-full object-cover" style="object-position: center 30%;"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 sm:bg-none"></div>
		<div class="absolute inset-0 hidden sm:block bg-gradient-to-r from-black/80 via-black/60 to-black/30"></div>
		<div class="absolute inset-0 hidden sm:block bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
	</div>

	<div class="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pb-8 pt-24 sm:py-32">
		<!-- Mobile: bottom-aligned compact layout -->
		<!-- Desktop: left-aligned with stats -->
		<div class="max-w-3xl">
			<div class="animate-fade-in-up">
				<span class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-sm text-white/90 mb-4 sm:mb-8">
					<span class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse"></span>
					Trusted Veterinary Partner
				</span>
			</div>

			<h1 class="text-3xl sm:text-5xl md:text-7xl font-display font-extrabold tracking-tight text-white mb-3 sm:mb-8 leading-[1.1] animate-fade-in-up-delay-1">
				Empowering<span class="text-primary"> Animal</span><br />
				Health <span class="text-primary">Everywhere</span>
			</h1>

			<p class="max-w-xl text-sm sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-12 leading-relaxed animate-fade-in-up-delay-2">
				Advanced veterinary care, GPS monitoring, and comprehensive programs for a sustainable livestock future.
			</p>

			<div class="flex gap-3 sm:gap-4 animate-fade-in-up-delay-3">
				<a
					href="#services"
					class="group bg-primary hover:bg-primary-dark text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
				>
					Our Services
					<span class="material-icons text-lg sm:text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
				</a>
				<a
					href="/about"
					class="glass text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg transition-all duration-300 hover:bg-white/15 hover:-translate-y-1 flex items-center justify-center"
				>
					About Us
				</a>
			</div>
		</div>

		<!-- Quick stats - inline on mobile, grid on desktop -->
		<div class="mt-8 sm:mt-20 flex sm:grid sm:grid-cols-4 gap-2 sm:gap-6 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide animate-fade-in-up-delay-3">
			{#each [
				{ value: '500+', label: 'Farmers Trained', icon: 'groups' },
				{ value: '100+', label: 'Areas Served', icon: 'map' },
				{ value: '24/7', label: 'Support', icon: 'support_agent' },
				{ value: '10+', label: 'Programs', icon: 'assignment' }
			] as stat}
				<div class="snap-start flex-shrink-0 w-32 sm:w-auto glass rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-5 text-center hover:bg-white/15 transition-all duration-300">
					<p class="text-xl sm:text-3xl md:text-4xl font-display font-extrabold text-white">{stat.value}</p>
					<p class="text-[10px] sm:text-sm text-gray-400 mt-0.5">{stat.label}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Scroll indicator - desktop only -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-down hidden sm:block">
		<div class="w-8 h-12 rounded-full border-2 border-white/30 flex justify-center pt-2">
			<div class="w-1.5 h-3 bg-white/50 rounded-full"></div>
		</div>
	</div>
</section>

<!-- Quick Features Strip -->
<section class="bg-secondary py-0 relative z-10">
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-3">
			{#each features as feature, i}
				<div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 py-5 sm:py-6 px-3 sm:px-8 text-center sm:text-left {i < 2 ? 'border-r border-white/10' : ''}">
					<div class="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
						<span class="material-icons text-primary text-xl sm:text-2xl">{feature.icon}</span>
					</div>
					<div>
						<p class="text-white font-bold text-xs sm:text-sm">{feature.title}</p>
						<p class="text-white/60 text-[10px] sm:text-xs">
							<span class="font-bold text-primary">{feature.stat}</span> {feature.statLabel}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- About Section -->
<section class="py-16 sm:py-24 bg-white relative overflow-hidden" id="about">
	<div class="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 hidden sm:block"></div>

	<div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
		<div class="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
			<!-- Left: Text -->
			<div>
				<span class="inline-block text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">Who We Are</span>
				<h2 class="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-secondary leading-tight mb-4 sm:mb-6">
					Comprehensive Veterinary <span class="text-primary">Solutions</span>
				</h2>
				<p class="text-gray-500 leading-relaxed text-sm sm:text-base mb-6 sm:mb-8">
					Kapato provides end-to-end support for livestock owners and pet parents alike, blending technology with on-the-ground expertise. From rural mobile clinics to GPS tracking, we're redefining veterinary care in Northeast India.
				</p>
				<div class="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
					{#each [
						{ icon: 'gps_fixed', text: 'GPS Tracking' },
						{ icon: 'medical_services', text: 'Mobile Clinics' },
						{ icon: 'school', text: 'Farmer Training' },
						{ icon: 'pets', text: 'Pet Care' }
					] as item}
						<div class="flex items-center gap-2.5 bg-background-light rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
							<span class="material-icons text-primary text-lg sm:text-xl">{item.icon}</span>
							<span class="text-secondary font-semibold text-xs sm:text-sm">{item.text}</span>
						</div>
					{/each}
				</div>
				<a
					href="/about"
					class="inline-flex items-center gap-2 text-primary font-bold text-sm sm:text-base hover:gap-3 transition-all duration-300"
				>
					Learn more about us
					<span class="material-icons text-lg">arrow_forward</span>
				</a>
			</div>

			<!-- Right: Logo + decorative -->
			<div class="relative hidden lg:flex justify-center">
				<div class="relative">
					<div class="absolute -inset-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl blur-2xl"></div>
					<div class="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-10 flex items-center justify-center">
						<img src={logo} alt="Kapato" class="w-56 h-auto" />
					</div>
					<div class="absolute -bottom-3 -right-3 bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg">
						Est. 2023
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Services Section -->
<section class="py-16 sm:py-24 bg-background-light relative" id="services">
	<div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
		<div class="text-center mb-10 sm:mb-16">
			<span class="inline-block text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">What We Offer</span>
			<h2 class="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-secondary leading-tight">
				Our Core <span class="text-primary">Services</span>
			</h2>
			<p class="mt-3 sm:mt-4 max-w-xl mx-auto text-gray-500 leading-relaxed text-sm sm:text-base">
				From GPS tracking to mobile clinics, we offer a full spectrum of veterinary and livestock management services.
			</p>
		</div>

		<!-- Mobile: 2-column compact grid / Desktop: 3-column -->
		<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
			{#each services as service}
				<div class="group bg-white rounded-xl sm:rounded-2xl overflow-hidden card-hover border border-gray-100 hover:border-transparent relative">
					<!-- Gradient top bar -->
					<div class="h-1 sm:h-1.5 bg-gradient-to-r {service.accent}"></div>

					<div class="p-4 sm:p-7">
						<div class="w-10 h-10 sm:w-13 sm:h-13 {service.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform duration-300">
							<span class="material-icons text-xl sm:text-2xl">{service.icon}</span>
						</div>
						<h3 class="text-sm sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2.5 group-hover:text-secondary transition-colors leading-snug">{service.title}</h3>
						<p class="text-gray-500 leading-relaxed text-xs sm:text-sm hidden sm:block">{service.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="relative overflow-hidden" id="contact">
	<div class="bg-gradient-to-br from-secondary via-secondary-dark to-secondary py-16 sm:py-24 animate-gradient">
		<div class="absolute inset-0">
			<div class="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
			<div class="absolute bottom-10 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
		</div>

		<div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
			<!-- Mobile: stacked centered / Desktop: side by side -->
			<div class="text-center lg:text-left lg:flex lg:items-center lg:gap-12">
				<div class="flex-1 mb-8 lg:mb-0">
					<h2 class="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-tight mb-3 sm:mb-6">
						Ready to modernize your <span class="text-primary">livestock management?</span>
					</h2>
					<p class="text-sm sm:text-xl text-gray-300 max-w-xl leading-relaxed mx-auto lg:mx-0">
						Join hundreds of farmers and pet owners who trust Kapato for their veterinary needs.
					</p>
				</div>

				<div class="w-full max-w-xs mx-auto lg:mx-0">
					<div class="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-center">
						<div class="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
							<span class="material-icons text-primary text-2xl sm:text-3xl">support_agent</span>
						</div>
						<p class="text-[10px] sm:text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Trusted Support</p>
						<p class="text-3xl sm:text-4xl font-display font-extrabold text-secondary mb-4 sm:mb-6">24/7</p>
						<a
							href="/"
							class="w-full flex items-center justify-center gap-2 px-5 py-3 sm:py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-full shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-sm sm:text-base"
						>
							Get Started
							<span class="material-icons text-lg sm:text-xl">arrow_forward</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
