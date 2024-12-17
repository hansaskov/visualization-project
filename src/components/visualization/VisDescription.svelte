<script lang="ts">
	export let text = '';
</script>

<div class="vis-description">
	{#if text}
		<p>{text}</p>
	{/if}
	<slot />
</div>

<style>
	.vis-description {
		color: #cbd5e1;
		line-height: 1.6;
		font-size: 0.95rem;
	}
</style> 