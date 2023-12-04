import { _store, get } from '$data/_store'
import API from '$lib/API'
import { d2s, id2s, week } from '$lib/date'
import { endOfDay, endOfMonth, formatISO, intervalToDuration, parseISO, setDate, startOfDay, startOfMonth } from 'date-fns'
import TimeSummary from '../../data/TimeSummary.js'

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
	const eow = week.end()
	const eom = endOfMonth(today)
	const sof = today.getDate() <= 14 ? setDate(today, 1) : setDate(today, 15)
	const eof = today.getDate() <= 14 ? setDate(today, 15) : eom //TODO why isn't the first fortnight ending on the 14th?
	const { data: weekly } = await API.get(user.baseURL + 'time-entries', { //FIXME error handling
		params: {
			start: formatISO(startOfDay(week.start())),
			end  : formatISO(endOfDay(eow)),
		},
	})
	const { data: fortnightly } = await API.get(user.baseURL + 'time-entries', { //FIXME error handling
		params: {
			start: formatISO(startOfDay(sof)),
			end  : formatISO(endOfDay(eof)),
		},
	})
	const { data: monthly } = await API.get(user.baseURL + 'time-entries', { //FIXME error handling
		params: {
			start: formatISO(startOfMonth(today)),
			end  : formatISO(endOfDay(eom)),
		},
	})

	return {
		weekly     : weekly.reduce(sumDurations, new TimeSummary(eow)),
		fortnightly: fortnightly.reduce(sumDurations, new TimeSummary(eof)),
		monthly    : monthly.reduce(sumDurations, new TimeSummary(eom)),
	}
}