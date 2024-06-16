<script>
import { FormGroup, FormText, Input, InputGroup, InputGroupText, Label } from '@sveltestrap/sveltestrap'

export let checked = false
export let value   = ''
export let group   = null

export let type   = 'text'
export let label  = ''
export let prefix = ''
export let suffix = ''
export let help   = ''
export let id     = 'input-' + (Math.random() * 1_000_000)

export let plainText = false
export let fullWidth = false
export let size      = ''

const isCheckOrRadio = ['checkbox', 'radio', 'switch'].includes(type)
//can't use class:w-auto because we still use Input in one scenario
let classes = `${$$props.class || ''} ${(fullWidth || isCheckOrRadio? '' : 'w-auto')}`
if (size == 'sm' || size == 'lg') {
	classes += ` form-control-${size}`
}

//https://github.com/sveltejs/svelte/issues/2308#issuecomment-878154680
function onCheck({ target: { checked }}) {
	if (group) {
		group = type == 'radio' ? value :
			(checked ? [...group, value] :
				group.filter(item => item !== value))
	}
}
</script>

<!--
 Urg... I had to reinvent Input, since Sveltestrap can't use HTML in labels nor plain-text fields, causes repeated IDs, and bind:group is broken in Svelte itself:
 - https://github.com/bestguy/sveltestrap/issues/583
 - https://github.com/bestguy/sveltestrap/issues/582
 - https://github.com/bestguy/sveltestrap/issues/66#issuecomment-1848219072
-->
{#if isCheckOrRadio}
	<div class="form-check" class:form-switch={type == 'switch'}>
		{#if type == 'radio'}
			<input on:change={onCheck} checked={group == value} type="radio" {...$$restProps} {id} class={`form-check-input ${classes}`}/>
		{:else}
			{@const role = (type == 'switch'? 'switch' : false)}
			{#if group}
				<input on:change={onCheck} checked={group.includes(value)} type="checkbox" {role} {...$$restProps} {id} class={`form-check-input ${classes}`} />
			{:else}
				<input bind:checked type="checkbox" {role} {...$$restProps} {id} class={`form-check-input ${classes}`} />
			{/if}
		{/if}

		{#if $$slots.label || label}
			<label for={id} disabled={$$props.disabled} class="form-check-label">
				{#if $$slots.label}<slot name="label"/>{:else}{label}{/if}

				{#if $$slots.help || help}
					<FormText disabled={$$props.disabled}>
						{#if $$slots.help}<slot name="help"/>{:else}{help}{/if}
					</FormText>
				{/if}
			</label>
		{/if}
	</div>

{:else}

	<FormGroup>
		{#if ($$slots.label || label)}
			<Label for={id} disabled={$$props.disabled}>
				{#if $$slots.label}<slot name="label"/>{:else}{label}:{/if}
			</Label>
		{/if}
		<InputGroup class={type == 'select'? 'd-block' : ''}><!-- d-block so it won't force-wide special snowflakes -->
			{#if prefix}<InputGroupText>{prefix}</InputGroupText>{/if}
			{#if plainText} <!-- https://github.com/bestguy/sveltestrap/issues/582 -->
				<input on:change on:input bind:value {...$$restProps} {...{ type }} {id} class={`form-control-plaintext ${classes}`} readonly/>
			{:else}
				<Input on:change on:input bind:value {...$$restProps} {type} {id} class={classes}>
					<slot/><!-- this is actually only used for type=select -->
				</Input>
			{/if}
			{#if suffix}<InputGroupText>{suffix}</InputGroupText>{/if}
		</InputGroup>

		{#if $$slots.help || help}
			<FormText disabled={$$props.disabled}>
				{#if $$slots.help}<slot name="help"/>{:else}{help}{/if}
			</FormText>
		{/if}

	</FormGroup>
{/if}
