import Days from '$data/Days.js'
import { intPersistance } from '$data/_store.js'

export default class Period {

	/** @type Days */ days
	/** @type SvelteStore<number> Hours to be worked */ target
	/** @type SvelteStore<number> */ daysOff

	constructor(title, start, end) {
		this.days    = new Days(start, end)

		this.target  = intPersistance(`${title}'s target`, 8 * this.days.weekdays) //8 hours a day is the norm... right?
		this.daysOff = intPersistance(`${title}'s days off`, 0)
	}

}
