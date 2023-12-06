import Model from './Model'

export default class Settings extends Model {

	hideMoney  = true
	currency   = 'USD'
	hourlyRate = 1
	exchange   = {
		rate: 1,
		fee : 0,
	}
}
