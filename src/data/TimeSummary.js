export default class TimeSummary {
	/** @type number */ billable = 0
	/** @type number */ nonBillable = 0
	/** @type Date */ start
	/** @type Date */ end

	constructor(start, end) {
		this.start = start
		this.end = end
	}
}
