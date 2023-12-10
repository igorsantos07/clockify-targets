<style>
:global(.collapse .badge, .collapsing .badge) { border-radius: 0 !important }
</style>

<script>
import { Badge, Card, CardHeader, CardTitle, Collapse, Input, Label, ListGroup, ListGroupItem } from 'sveltestrap'
import { _store } from '$data/_store.js'
import Linput from '$cmp/Linput.svelte'
import TimeBadge from '$cmp/TimeBadge.svelte'
import Muted from '$cmp/Muted.svelte'

const settings = _store.settings

const AVG_OPTIONS = {
	7: '➐ days a week',
	6: '➏ days, Monday to Saturday',
	5: '➎ days, Monday to Friday',
}

if (typeof $settings.schedule.maxDailyHours == 'undefined') {
	$settings.schedule.maxDailyHours = new Settings().schedule.maxDailyHours
}

let isOpen = false
</script>

<Card>
	<CardHeader>
		<CardTitle>⌚ Current work schedule</CardTitle>
	</CardHeader>
	<ListGroup flush>
		<ListGroupItem>
			<Label>👁️ Show/hide average hours for:</Label>
			{#each Object.entries(AVG_OPTIONS) as [value, label]}
				<Input type="switch" bind:checked={$settings.schedule.show[value]} value={value} label={label}/>
				<!--				<input type="checkbox" bind:group={show} value={`c-${value}`} label={`c-${label}`}/>-->
			{/each}
		</ListGroupItem>

		<ListGroupItem>
			<Label>🎨 Colorize boxes according to:</Label>
			{#each Object.entries(AVG_OPTIONS) as [value, label]}
				<Input type="radio" bind:group={$settings.schedule.colorize} {value} {label} id={`color-${value}`}/><!-- ID avoids clashing with switches above, see https://github.com/bestguy/sveltestrap/issues/66#issuecomment-1848219072 -->
			{/each}
		</ListGroupItem>

		<ListGroupItem>
			<Linput type="range" min="8" max="20" step="0.5" bind:value={$settings.schedule.maxDailyHours}>
				<svelte:fragment slot="label">
					📈 Maximum hours per day: <Badge pill color="info">{$settings.schedule.maxDailyHours}h</Badge>
				</svelte:fragment>
				<svelte:fragment slot="help">Any average over this amount will show a <i>very bad</i> status.</svelte:fragment>
			</Linput>

			<Muted>
				<Input type="switch" bind:checked={isOpen} label="Show the complete scale of time badges"/>
				<Collapse {isOpen}>
					{#each [...Array(Math.floor($settings.schedule.maxDailyHours)+2).keys()] as hour}
						{#if hour > $settings.schedule.maxDailyHours/4}
							<TimeBadge seconds={60*60*hour} class="p-0 px-2 col-4 offset-4"/>
						{/if}
					{/each}
				</Collapse>
			</Muted>
		</ListGroupItem>
	</ListGroup>
</Card>
