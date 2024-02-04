import { differenceInDays, eachWeekendOfInterval, isSunday } from 'date-fns'

export default class Days {

	/** @type number */ total
	/** @type number */ weekdays    = 0
	/** @type number */ weekendDays = 0
	/** @type number */ weekends    = 0
	/** @type number */ saturdays   = 0
	/** @type number */ sundays     = 0

	constructor(start, end, considerToday = true) {
		this.total = differenceInDays(end, start) + (considerToday ? 1 : 0)

		eachWeekendOfInterval({ start, end }).forEach(day => {
			++this.weekendDays
			++this[isSunday(day)? 'sundays' : 'saturdays']
		})
		this.weekdays = this.total - this.weekendDays
		this.weekends = this.weekendDays / 2

		return this
	}
}
