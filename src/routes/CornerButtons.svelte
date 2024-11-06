<script>
import { Button, FormText, Input, InputGroup, InputGroupText, Popover } from '@sveltestrap/sveltestrap'
import { idGenerator } from '$lib'

export let target, daysOff, daysSick
const idGen = idGenerator()

</script>
<Button color="transparent" id={idGen('days-sick')}>
	🤒&nbsp;&nbsp;{#if $daysSick}<b>{$daysSick}</b>{:else}∅{/if}
</Button>
<Popover target={idGen('days-sick')} placement="right" title="🤒 Sick / paid leave?">
	<InputGroup>
		<Input class="w-auto" bind:value={$daysSick} type="number" min="0" max="31" />
		<InputGroupText>sick days</InputGroupText>
	</InputGroup>
	<FormText>Discounted from the work days. Should be reset when a new period starts.</FormText>
</Popover>

<Button color="transparent" id={idGen('days-off')}>
	🏖&nbsp;&nbsp;{#if $daysOff}<b>{$daysOff}</b>{:else}∅{/if}
</Button>
<Popover target={idGen('days-off')} placement="right" title="🏖 Holidays / vacations?">
	<InputGroup>
		<Input class="w-auto" bind:value={$daysOff} type="number" min="0" max="31" />
		<InputGroupText>days off</InputGroupText>
	</InputGroup>
	<FormText>Discounted from pending work hours; must be reduced once each day off gets spent.</FormText>
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
