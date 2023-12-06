<script>
	import { FormGroup, FormText, Input, InputGroup, InputGroupText, Label } from 'sveltestrap'

	export let value  = ''
	export let label  = ''
	export let prefix = ''
	export let suffix = ''
	export let help   = ''
	export let id     = 'input-' + (Math.random() * 1_000_000)

	export let plainText = false
	export let fullWidth = false
	export let size      = ''

	//FIXME use class:fullWidth and etc instead of that mess
	let classes = `${$$props.class || ''} ${(fullWidth ? '' : 'w-auto')}`
	if (size == 'sm' || size == 'lg') {
		classes += ` form-control-${size}`
	}
</script>

<FormGroup>
	{#if label}<Label for={id} disabled={$$props.disabled}>{label}</Label>{/if}
	<InputGroup>
		{#if prefix}<InputGroupText>{prefix}</InputGroupText>{/if}
		{#if plainText} <!-- https://github.com/bestguy/sveltestrap/issues/582 -->
			<input on:input on:change bind:value={value} {...$$restProps} {id} class={`form-control-plaintext ${classes}`} readonly/>
		{:else}
			<Input on:input on:change bind:value={value} {...$$restProps} {id} class={classes}/>
		{/if}
		{#if suffix}<InputGroupText>{suffix}</InputGroupText>{/if}
	</InputGroup>
	{#if $$slots.help}
		<FormText disabled={$$props.disabled}><slot name="help"/></FormText>
	{:else if help}
		<FormText disabled={$$props.disabled}>{help}</FormText>
	{/if}
</FormGroup>
