import axios from 'axios'

export default axios.create({
	baseURL: 'https://api.clockify.me/api/v1/', //FIXME
	headers: {
		'X-Api-Key': window.localStorage.API_KEY
	}
})
