<script>
import { _store } from '$data/_store'
import Title from '$cmp/Title.svelte'
import Cash from './Cash.svelte'
import Schedule from './Schedule.svelte'

// export let data
// const { settings } = data
const settings = _store.settings
</script>

<Title page="Settings"/>

<Cash/>
<Schedule {settings}/>
