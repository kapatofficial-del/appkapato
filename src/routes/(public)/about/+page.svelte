<script lang="ts">
	import founderImg from '$lib/assets/founder.png';

	const coreValues = [
		{ icon: 'lightbulb', label: 'Innovation with Purpose' },
		{ icon: 'diversity_3', label: 'Community & Cultural Respect' },
		{ icon: 'eco', label: 'Sustainable Rural Development' },
		{ icon: 'favorite', label: 'Animal Welfare & Ethical Practices' },
		{ icon: 'trending_up', label: 'Technology for Inclusive Growth' }
	];

	const timeline = [
		{
			year: 'Education',
			icon: 'school',
			title: 'B.V.Sc & A.H.',
			description: 'College of Veterinary Science, Khanapara, Guwahati, Assam'
		},
		{
			year: 'Higher Studies',
			icon: 'menu_book',
			title: 'M.V.Sc',
			description: 'West Bengal University of Animal and Fishery Sciences'
		},
		{
			year: '2017',
			icon: 'local_hospital',
			title: 'Founded KM VETS',
			description: 'Established a small animal veterinary hospital in Arunachal Pradesh — now grown to 3 branches'
		},
		{
			year: 'Present',
			icon: 'rocket_launch',
			title: 'Founded Kapato',
			description: 'Launched Kapato Private Limited to combine technology, veterinary science, and traditional knowledge'
		}
	];
</script>

<svelte:head>
	<title>About Us — Kapato</title>
</svelte:head>

<!-- Hero Banner -->
<section class="relative bg-secondary-dark overflow-hidden pt-24 pb-14 sm:pt-32 sm:pb-20">
	<div class="absolute inset-0">
		<div class="absolute top-0 right-0 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-primary/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
		<div class="absolute bottom-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-secondary-light/10 rounded-full -translate-x-1/3 translate-y-1/3 blur-3xl"></div>
	</div>
	<div class="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
		<span class="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5 text-xs sm:text-sm text-white/80 mb-5 sm:mb-6">
			<span class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"></span>
			Our Story
		</span>
		<h1 class="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white leading-tight mb-4 sm:mb-6">
			About <span class="text-primary">Kapato</span>
		</h1>
		<p class="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed px-2">
			Born from a childhood memory, driven by purpose — discover the story behind Kapato and the visionary founder who built it.
		</p>
	</div>
</section>

<!-- Founder Section -->
<section class="py-16 sm:py-24 bg-white relative overflow-hidden">
	<div class="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 hidden sm:block"></div>

	<div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
		<div class="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
			<!-- Founder Image -->
			<div class="relative flex justify-center">
				<div class="relative w-full max-w-xs sm:max-w-sm">
					<!-- Decorative ring -->
					<div class="absolute -inset-3 sm:-inset-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl sm:rounded-3xl blur-xl"></div>
					<!-- Image frame -->
					<div class="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white">
						<img
							src={founderImg}
							alt="Dr. Yab Mate — Founder of Kapato"
							class="w-full object-cover"
						/>
					</div>
					<!-- Name badge -->
					<div class="absolute -bottom-4 sm:-bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-xl sm:rounded-2xl shadow-xl px-5 sm:px-6 py-3 sm:py-4 text-center whitespace-nowrap border border-gray-100">
						<p class="font-display font-bold text-secondary text-base sm:text-lg">Dr. Yab Mate</p>
						<p class="text-primary text-xs sm:text-sm font-semibold">Founder & Director, Kapato</p>
					</div>
				</div>
			</div>

			<!-- Founder Bio -->
			<div class="mt-8 lg:mt-0">
				<span class="inline-block text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">About the Founder</span>
				<h2 class="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-secondary leading-tight mb-4 sm:mb-6">
					Dr. Yab <span class="text-primary">Mate</span>
				</h2>
				<div class="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
					<p>
						Dr. Yab Mate is a veterinarian, entrepreneur, and innovator from <strong class="text-secondary">Arunachal Pradesh, India</strong>. She is the Founder and Director of Kapato Private Limited and a passionate advocate for animal welfare, livestock innovation, and rural empowerment.
					</p>
					<p>
						She completed her <strong class="text-secondary">B.V.Sc & A.H.</strong> from College of Veterinary Science, Khanapara, Guwahati, and her <strong class="text-secondary">M.V.Sc</strong> from West Bengal University of Animal and Fishery Sciences.
					</p>
					<p>
						She actively participates in national and international veterinary conferences under the <strong class="text-secondary">World Small Animal Veterinary Association</strong> and Asian veterinary platforms, and has attended advanced workshops in India and abroad, including <strong class="text-secondary">South Korea</strong>.
					</p>
				</div>

				<!-- Highlight chips -->
				<div class="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8">
					{#each ['Veterinarian', 'Entrepreneur', 'Innovator', 'Animal Welfare Advocate', 'Rural Empowerment'] as tag}
						<span class="bg-secondary/5 border border-secondary/10 text-secondary text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
							{tag}
						</span>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Journey Timeline -->
<section class="py-16 sm:py-24 bg-background-light">
	<div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
		<div class="text-center mb-10 sm:mb-16">
			<span class="inline-block text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">Her Journey</span>
			<h2 class="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-secondary">
				Milestones That <span class="text-primary">Matter</span>
			</h2>
		</div>

		<div class="relative">
			<!-- Vertical line - left on mobile, center on desktop -->
			<div class="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent"></div>

			<div class="space-y-8 sm:space-y-12">
				{#each timeline as item, i}
					<!-- Desktop: alternating layout -->
					<div class="relative hidden md:flex items-center gap-8 {i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}">
						<div class="w-5/12">
							<div class="bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
								<div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
									<span class="material-icons text-primary group-hover:text-white">{item.icon}</span>
								</div>
								<span class="text-xs font-bold text-primary uppercase tracking-widest">{item.year}</span>
								<h3 class="text-xl font-bold text-secondary mt-1 mb-2">{item.title}</h3>
								<p class="text-gray-500 leading-relaxed">{item.description}</p>
							</div>
						</div>
						<div class="w-2/12 flex justify-center">
							<div class="w-5 h-5 bg-primary rounded-full border-4 border-white shadow-lg ring-2 ring-primary/30"></div>
						</div>
						<div class="w-5/12"></div>
					</div>

					<!-- Mobile: left-aligned timeline -->
					<div class="relative flex md:hidden gap-5">
						<!-- Dot on the line -->
						<div class="flex-shrink-0 w-12 flex justify-center pt-1">
							<div class="w-3.5 h-3.5 bg-primary rounded-full border-[3px] border-white shadow-md ring-2 ring-primary/30"></div>
						</div>
						<!-- Card -->
						<div class="flex-1 bg-white rounded-xl p-5 shadow-md border border-gray-100">
							<div class="flex items-center gap-3 mb-3">
								<div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
									<span class="material-icons text-primary text-xl">{item.icon}</span>
								</div>
								<div>
									<span class="text-[10px] font-bold text-primary uppercase tracking-widest">{item.year}</span>
									<h3 class="text-base font-bold text-secondary leading-snug">{item.title}</h3>
								</div>
							</div>
							<p class="text-gray-500 text-sm leading-relaxed">{item.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- The Vision Behind Kapato -->
<section class="py-16 sm:py-24 bg-white relative overflow-hidden">
	<div class="absolute inset-0">
		<div class="absolute right-0 top-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl hidden sm:block"></div>
	</div>

	<div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
		<div class="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
			<div>
				<span class="inline-block text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">The Name & The Vision</span>
				<h2 class="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-secondary leading-tight mb-4 sm:mb-6">
					"Kapato" means <span class="text-primary">Search</span>
				</h2>
				<div class="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
					<p>
						Growing up in a farming family, Dr. Mate witnessed her father and other farmers struggle to locate their <strong class="text-secondary">Mithun</strong> — a sacred and culturally significant animal in Arunachal Pradesh. Mithun is not only an essential part of rituals, marriages, and traditions but also a vital source of livelihood, especially in the Tani belt of the state.
					</p>
					<p>
						Finding Mithun in dense forests and difficult terrains is physically exhausting and time-consuming. Many farmers spend days searching for their animals, facing financial and emotional stress.
					</p>
					<p>
						These childhood experiences inspired Dr. Mate to build <strong class="text-secondary">Kapato Private Limited</strong> — combining technology, veterinary science, and traditional knowledge to support farmers and livestock owners.
					</p>
				</div>
			</div>

			<!-- Quote card -->
			<div class="relative">
				<div class="bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl sm:rounded-3xl p-7 sm:p-10 text-white relative overflow-hidden">
					<div class="absolute top-0 right-0 w-28 sm:w-40 h-28 sm:h-40 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
					<div class="absolute bottom-0 left-0 w-20 sm:w-32 h-20 sm:h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
					<div class="relative">
						<span class="material-icons text-4xl sm:text-5xl text-primary/60 mb-3 sm:mb-4">format_quote</span>
						<blockquote class="text-base sm:text-xl font-display font-semibold leading-relaxed text-white mb-5 sm:mb-6">
							"To combine technology, veterinary science, and traditional knowledge — to help farmers find their Mithun, protect their livelihood, and honour their culture."
						</blockquote>
						<div class="flex items-center gap-3 pt-4 sm:pt-6 border-t border-white/10">
							<img src={founderImg} alt="Dr. Yab Mate" class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-primary" />
							<div>
								<p class="font-bold text-white text-sm sm:text-base">Dr. Yab Mate</p>
								<p class="text-xs sm:text-sm text-gray-400">Founder, Kapato</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Mission & Vision -->
<section class="py-16 sm:py-24 bg-background-light">
	<div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
			<!-- Mission -->
			<div class="group bg-white rounded-2xl sm:rounded-3xl p-7 sm:p-10 shadow-md border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
				<div class="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/10 transition-colors"></div>
				<div class="relative">
					<div class="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary transition-all duration-300">
						<span class="material-icons text-2xl sm:text-3xl text-primary group-hover:text-white transition-colors duration-300">flag</span>
					</div>
					<span class="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest">Our Mission</span>
					<h3 class="text-xl sm:text-2xl font-display font-extrabold text-secondary mt-1.5 sm:mt-2 mb-3 sm:mb-4">What Drives Us</h3>
					<p class="text-gray-600 leading-relaxed text-sm sm:text-base">
						To empower rural and tribal communities through technology-driven livestock solutions, improving animal management, farmer livelihoods, and cultural sustainability.
					</p>
				</div>
			</div>

			<!-- Vision -->
			<div class="group bg-white rounded-2xl sm:rounded-3xl p-7 sm:p-10 shadow-md border border-gray-100 hover:shadow-xl hover:border-secondary/20 transition-all duration-300 relative overflow-hidden">
				<div class="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-secondary/5 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-secondary/10 transition-colors"></div>
				<div class="relative">
					<div class="w-12 h-12 sm:w-16 sm:h-16 bg-secondary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-secondary transition-all duration-300">
						<span class="material-icons text-2xl sm:text-3xl text-secondary group-hover:text-white transition-colors duration-300">visibility</span>
					</div>
					<span class="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-widest">Our Vision</span>
					<h3 class="text-xl sm:text-2xl font-display font-extrabold text-secondary mt-1.5 sm:mt-2 mb-3 sm:mb-4">Where We're Headed</h3>
					<p class="text-gray-600 leading-relaxed text-sm sm:text-base">
						To become a global leader in smart livestock tracking, animal health monitoring, and precision farming solutions, starting from the grassroots of Northeast India.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Core Values -->
<section class="py-16 sm:py-24 bg-secondary-dark relative overflow-hidden">
	<div class="absolute inset-0">
		<div class="absolute top-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
		<div class="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-secondary-light/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
	</div>

	<div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative">
		<div class="text-center mb-10 sm:mb-16">
			<span class="inline-block text-primary font-bold text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">What We Stand For</span>
			<h2 class="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white">
				Our Core <span class="text-primary">Values</span>
			</h2>
		</div>

		<!-- Mobile: scrolling horizontal cards -->
		<div class="flex sm:hidden gap-3 overflow-x-auto pb-4 -mx-5 px-5 snap-x snap-mandatory scrollbar-hide">
			{#each coreValues as value}
				<div class="snap-start flex-shrink-0 w-36 bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
					<div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
						<span class="material-icons text-xl text-primary">{value.icon}</span>
					</div>
					<p class="text-white font-semibold text-xs leading-snug">{value.label}</p>
				</div>
			{/each}
		</div>

		<!-- Desktop: grid -->
		<div class="hidden sm:grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
			{#each coreValues as value}
				<div class="group bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-primary/40 transition-all duration-300 hover:-translate-y-2">
					<div class="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-all duration-300">
						<span class="material-icons text-2xl text-primary group-hover:text-white transition-colors duration-300">{value.icon}</span>
					</div>
					<p class="text-white font-semibold text-sm leading-snug">{value.label}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="py-14 sm:py-20 bg-white">
	<div class="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
		<h2 class="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-secondary mb-3 sm:mb-4">
			Want to work with <span class="text-primary">Kapato?</span>
		</h2>
		<p class="text-gray-500 text-base sm:text-lg mb-6 sm:mb-8">
			Get in touch with us to learn more about our services, training programs, or partnership opportunities.
		</p>
		<a
			href="/#contact"
			class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1"
		>
			Contact Us
			<span class="material-icons">arrow_forward</span>
		</a>
	</div>
</section>
