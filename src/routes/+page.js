import { _store, get } from '$data/_store'
import API from '$lib/API'
import { id2s, week } from '$lib/date'
import { endOfDay, endOfMonth, formatISO, setDate, startOfDay, startOfMonth } from 'date-fns'
import TimeSummary from '../data/TimeSummary.js'

/** @typedef TimeEntry
 * @property {boolean} billable
 * @property {TimeInterval} timeInterval
 */

/** @typedef TimeInterval
 * @property {string} start ISO
 * @property {string} end ISO
 * @property {string} duration ISO? e.g. PT2H35M45
 */

/**
 * @param {TimeSummary} totals
 * @param {TimeEntry} entry */
function sumDurations(totals, { billable, timeInterval }) { //named so it gets typed.....
	let seconds
	seconds = timeInterval.duration? //is the timer over?
		id2s(timeInterval.duration) :
		0 // d2s(intervalToDuration({ start: parseISO(timeInterval.start), end: new Date() })) //unfinished timer... ignore, since it will derail the current day's calculation
	totals[billable ? 'billable' : 'nonBillable'] += seconds
	return totals
}

export async function load({ params }) {
	/** @type User */
	const user = get(_store.user)
	const today = new Date()

	const sow = week.start()
	const eow = week.end()

	const som = startOfMonth(today)
	const eom = endOfMonth(today)

	const sof = startOfDay(today.getDate() <= 14 ? setDate(today, 1) : setDate(today, 15))
	const eof = today.getDate() <= 14 ? endOfDay(setDate(today, 14)) : eom

	const { data: weekly } = await API.get(user.baseURL + 'time-entries', { //FIXME error handling
		params: {
			start: formatISO(startOfDay(sow)),
			end  : formatISO(endOfDay(eow)),
		},
	})
	const { data: fortnightly } = await API.get(user.baseURL + 'time-entries', { //FIXME error handling
		params: {
			start: formatISO(startOfDay(sof)),
			end  : formatISO(eof),
		},
	})
	const { data: monthly } = await API.get(user.baseURL + 'time-entries', { //FIXME error handling
		params: {
			start: formatISO(som),
			end  : formatISO(endOfDay(eom)),
		},
	})

	return {
		weekly     : weekly.reduce(sumDurations, new TimeSummary(sow, eow)),
		fortnightly: fortnightly.reduce(sumDurations, new TimeSummary(sof, eof)),
		monthly    : monthly.reduce(sumDurations, new TimeSummary(som, eom)),
	}
}
