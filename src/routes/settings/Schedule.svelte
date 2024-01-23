<style>
:global(.collapse .badge, .collapsing .badge) { border-radius: 0 !important }
</style>

<script>
import { Badge, Card, CardHeader, CardTitle, Collapse, Input, Label, ListGroup, ListGroupItem } from '@sveltestrap/sveltestrap'
import { _store } from '$data/_store'
import Settings from '$data/Settings'
import Linput from '$cmp/Linput.svelte'
import TimeBadge from '$cmp/TimeBadge.svelte'
import Muted from '$cmp/Muted.svelte'

/** you got to sleep 8 hours a day and find some time to eat, right? */
const MAX_ALLOWED_HOURS = 24 - 8
const settings = _store.settings
let isOpen = false
</script>

<Card>
	<CardHeader>
		<CardTitle>⌚ Current work schedule</CardTitle>
	</CardHeader>
	<ListGroup flush>
		<ListGroupItem>
			<Label>👁️ Show/hide average hours for:</Label>
			{#each Settings.AVG_OPTIONS as { n: value, color, badge, restLabel }}
					<Linput type="switch" bind:group={$settings.schedule.show} {value}>
						<svelte:fragment slot="label"><span class={`text-${color}`}>{badge}</span> {restLabel}</svelte:fragment>
					</Linput>
			{/each}
		</ListGroupItem>

		<ListGroupItem>
			<Label>🎨 Colorize boxes according to:</Label>
			{#each Settings.AVG_OPTIONS as { n: value, color, badge, restLabel }}
				<Linput type="radio" bind:group={$settings.schedule.colorize} {value}>
					<svelte:fragment slot="label"><span class={`text-${color}`}>{badge}</span> {restLabel}</svelte:fragment>
				</Linput>
			{/each}
		</ListGroupItem>

		<ListGroupItem>
			<Linput type="range" min="8" max={MAX_ALLOWED_HOURS} step="0.5" bind:value={$settings.schedule.maxDailyHours}>
				<svelte:fragment slot="label">
					📈 Maximum hours per day: <Badge pill color="info">{$settings.schedule.maxDailyHours}h</Badge>
				</svelte:fragment>
				<svelte:fragment slot="help">Averages over this amount will display a <i>very bad™</i> status.</svelte:fragment>
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

		<ListGroupItem>
			<Linput type="time" step={60*60*1000} bind:value={$settings.schedule.endOfDay}>
				<svelte:fragment slot="label">At what time do you "stop planning" your day?</svelte:fragment>
				<svelte:fragment slot="help">After this time we won't consider today in the amount of days when calculating your averages.</svelte:fragment>
			</Linput>
		</ListGroupItem>
	</ListGroup>
</Card>
