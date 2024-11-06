import Days from '$data/Days.js'
import { intPersistance } from '$data/_store.js'

export default class Period {

	/** @type Days */ days
	/** @type SvelteStore<number> Hours to be worked */ target
	/** @type SvelteStore<number> */ daysOff

	static get WORK_HOURS_A_DAY() { return 8 } //why no JS class constants, god

	constructor(title, start, end) {
		this.days     = new Days(start, end)
		this.daysOff  = intPersistance(`${title}'s days off`, 0)
		this.daysSick = intPersistance(`${title}'s sick days`, 0)

		this.target = intPersistance(`${title}'s target`, Period.WORK_HOURS_A_DAY * this.days.weekdays)
	}

}
