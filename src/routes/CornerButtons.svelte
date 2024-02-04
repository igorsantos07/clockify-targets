<script>
import { Button, FormText, Input, InputGroup, InputGroupText, Popover } from '@sveltestrap/sveltestrap'
import { idGenerator } from '$lib'

export let target, daysOff
const idGen = idGenerator()

</script>
<Button color="transparent" id={idGen('days-off')}>
	🏖&nbsp;&nbsp;{#if $daysOff}<b>{$daysOff}</b>{:else}∅{/if}
</Button>
<Popover target={idGen('days-off')} placement="right" title="🏖 Holidays / vacations?">
	<InputGroup>
		<Input class="w-auto" bind:value={$daysOff} type="number" min="0" max="31" />
		<InputGroupText>days off</InputGroupText>
	</InputGroup>
	<FormText>Must be reduced once each day off gets spent.</FormText>
</Popover>

<Button color="transparent" id={idGen('target')}>
	🎯&nbsp;&nbsp;{$target}h
</Button>
<Popover target={idGen('target')} placement="right" title="🎯 Your target">
	<InputGroup>
		<Input class="w-auto" bind:value={$target} type="number" min="0" max="250"/>
		<InputGroupText>hours</InputGroupText>
	</InputGroup>
</Popover>
