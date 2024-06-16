<script>
import Cash from './Cash.svelte'
import Schedule from './Schedule.svelte'
import Interface from './Interface.svelte'
import Page from '$data/models/Page.js'

Page.init('Settings')
</script>

<Cash/>
<Schedule/>
<Interface/>
