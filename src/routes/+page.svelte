<script>
	import TargetCard from './TargetCard.svelte'
	import Page from '$data/models/Page.js'

	Page.init('My targets', 'targets')

	/** @type {{weekly:TimeSummary, fortnightly:TimeSummary, monthly:TimeSummary}} */
	export let data
</script>

<TargetCard title="This week" {...data.weekly}/>
<TargetCard title="This fortnight" {...data.fortnightly}/>
<TargetCard title="This month" {...data.monthly}/>
