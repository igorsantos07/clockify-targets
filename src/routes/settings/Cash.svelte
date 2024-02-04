<script>
import { Card, CardHeader, CardTitle, Col, ListGroup, ListGroupItem, Row } from '@sveltestrap/sveltestrap'
import Settings from '$data/models/Settings'
import { _store } from '$data/_store'
import { writable } from 'svelte/store'
import { mfd2, moneyLong } from '$lib/fmt'
import Linput from '$cmp/Linput.svelte'

const settings = _store.settings

let rate = writable(mfd2($settings.exchange.rate))

function changeRate() {
	$settings.exchange.rate = parseFloat($rate) //saves the raw number...
	$rate                   = mfd2($rate) //...but displays the leading zero
}

$: disableEx = $settings.currency == 'USD'
$: actualRate = moneyLong($settings.exchange.rate * (1 - ($settings.exchange.fee / 100)))
</script>

<Card>
	<CardHeader>
		<CardTitle>💰 Cash</CardTitle>
	</CardHeader>
	<ListGroup flush>
		<ListGroupItem>
			<Linput label="Your hourly rate, in dollars" prefix="$" type="number" bind:value={$settings.hourlyRate}/>
		</ListGroupItem>

		<ListGroupItem>
			<Linput type="select" label="Your local currency" bind:value={$settings.currency} id="currency">
				{#each Object.entries(Settings.CURRENCIES) as [value, label]}
					<option {value}>{label}</option>
				{/each}
			</Linput>

			<Row>
				<Col sm="12" md="5">
					<Linput label="Exchange rate" disabled={disableEx}
					        prefix={disableEx? '' : `1 USD = ${$settings.currency}`} type="number"
					        bind:value={$rate} on:change={changeRate} step="0.01"
					        help="The market rate - you can get it from Google, for instance."/>
				</Col>
				<Col sm="12" md="5">
					<Linput label="Exchange fee" disabled={disableEx} suffix="%" type="number"
					        bind:value={$settings.exchange.fee} step="0.01"
					        help='Also known as "spread" - in finance, that is difference between the market rate and the rate you actually get.'/>
				</Col>
				{#key disableEx}
					<Col sm="12" md="2" class="mb-n3 {disableEx? 'invisible' : 'visible'}">
						<!-- n3 counteracts FormGroup's margin, since it's at the bottom of a Column, not a CardBody -->
						<Linput label="💱 Actual rate" value={actualRate} plainText sizing="lg" class="fw-bold"/>
					</Col>
				{/key}
			</Row>
		</ListGroupItem>
	</ListGroup>
</Card>
