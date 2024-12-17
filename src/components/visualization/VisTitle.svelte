<script lang="ts">
	export let title: string;
	export let subtitle = '';
</script>

<div class="vis-title">
	<h2 class="text-2xl font-bold">{title}</h2>
	{#if subtitle}
		<p class="subtitle">{subtitle}</p>
	{/if}
	<slot />
</div>

<style>
	.vis-title {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: .5rem;
	}

	h2 {
		color: #f8fafc;
		font-weight: 600;
	}

	.subtitle {
		color: #94a3b8;
		font-size: 0.9rem;
		line-height: 1.4;
	}
</style> 