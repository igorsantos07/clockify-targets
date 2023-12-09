<script>
import { Card, CardHeader, CardTitle, Input, Label, ListGroup, ListGroupItem } from 'sveltestrap'
import { _store } from '$data/_store.js'

const settings = _store.settings

const AVG_OPTIONS = {
	7: '➐ days a week',
	6: '➏ days, Monday to Saturday',
	5: '➎ days, Monday to Friday',
}

if (typeof $settings.schedule == 'undefined') {
	$settings.schedule = new Settings().schedule
}
</script>

<Card>
	<CardHeader>
		<CardTitle>⌚ Usual work schedule</CardTitle>
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
	</ListGroup>
</Card>
