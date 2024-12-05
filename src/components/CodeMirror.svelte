<script>
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { EditorState } from '@codemirror/state';
	import { EditorView, lineNumbers } from '@codemirror/view';
	import { minimalSetup } from 'codemirror';
	import { sql } from '@codemirror/lang-sql';
	import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
	import { tags } from '@lezer/highlight';
	import { queryStringStore } from '../store/store.ts';
	import { autocompletion } from '@codemirror/autocomplete';

	export let value;
	const dispatch = createEventDispatcher();
	let editor;
	let dom;

	const darkThemeHighlightStyle = HighlightStyle.define([
		{ tag: tags.keyword, color: '#ff79c6' },
		{ tag: tags.string, color: '#f1fa8c' },
		{ tag: tags.number, color: '#bd93f9' },
		{ tag: tags.comment, color: '#6272a4', fontStyle: 'italic' },
		{ tag: tags.operator, color: '#ffb86c' },
		{ tag: tags.function(tags.variableName), color: '#50fa7b' },
		{ tag: tags.typeName, color: '#8be9fd' },
		{ tag: tags.variableName, color: '#f8f8f2' },
	]);

	function emitChange(newValue) {
		dispatch('change', { detail: newValue });
	}

	onMount(() => {
		const state = EditorState.create({
			doc: value,
			extensions: [
				minimalSetup,
				lineNumbers(),
				EditorView.lineWrapping,
				autocompletion(),
				sql({
					upperCaseKeywords: true,
				}),
				EditorView.theme(
					{
						'&': { color: '#ffffff', backgroundColor: '#2a2e37' },
						'&.cm-cursor': { borderLeftColor: '#0e9' },
						'.cm-cursor': { borderLeftColor: '#0e9' },
						'.cm-content': { caretColor: '#fff' },
						'.cm-gutters': { backgroundColor: '#2a2e37', color: '#888' },
						'&.cm-focused .cm-selectionBackground, ::selection': {
							backgroundColor: '#3c53ec',
						},
						'.cm-line': { color: '#ffffff' },
					},
					{ dark: true },
				),
				syntaxHighlighting(darkThemeHighlightStyle),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						const newValue = update.state.doc.toString();
						emitChange(newValue);
						queryStringStore.set(newValue);
					}
				}),
				EditorView.domEventHandlers({
					blur: () => {
						emitChange(editor.state.doc.toString());
						queryStringStore.set(editor.state.doc.toString());
					},
				}),
			],
		});

		editor = new EditorView({
			state,
			parent: dom,
		});
	});

	// Watch for external changes to the value prop and update the editor content
	$: if (editor && value !== undefined) {
		const currentValue = editor.state.doc.toString();
		if (currentValue !== value) {
			editor.dispatch({
				changes: { from: 0, to: currentValue.length, insert: value },
			});
		}
	}

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<div class="codemirror" bind:this={dom}></div>

<style>
	.codemirror {
		height: 100%;
		overflow-x: auto;
		border: 1px solid #322f2f;
		border-radius: 4px;
		background-color: #2a2e37;
		color: #ffffff;
		resize: both;
		padding: 1rem;
	}

	.codemirror:focus-within {
		border: 1px solid rgb(99, 197, 230);
	}
</style>
