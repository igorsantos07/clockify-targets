import { _store, get } from '$data/_store'
import API from '$lib/API'
import { d2s, id2s, week } from '$lib/date'
import { endOfMonth, formatISO, intervalToDuration, parseISO, setDate, startOfMonth } from 'date-fns'
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
	if (timeInterval.duration) {
		seconds = id2s(timeInterval.duration)
	} else {
		//unfinished timer
		const duration = intervalToDuration({ start: parseISO(timeInterval.start), end: new Date() })
		console.log(duration)
		seconds = d2s(duration)
	}
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
	const eof = today.getDate() <= 14 ? setDate(today, 14) : eom
	const { data: weekly } = await API.get(user.baseURL + 'time-entries', { //FIXME error handling
		params: {
			start: formatISO(week.start()),
			end  : formatISO(eow),
		},
	})
	const { data: fortnightly } = await API.get(user.baseURL + 'time-entries', { //FIXME error handling
		params: {
			start: formatISO(sof),
			end  : formatISO(eof),
		},
	})
	const { data: monthly } = await API.get(user.baseURL + 'time-entries', { //FIXME error handling
		params: {
			start: formatISO(startOfMonth(today)),
			end  : formatISO(eom),
		},
	})

	return {
		weekly     : weekly.reduce(sumDurations, new TimeSummary(eow)),
		fortnightly: fortnightly.reduce(sumDurations, new TimeSummary(eof)),
		monthly    : monthly.reduce(sumDurations, new TimeSummary(eom)),
	}
}
