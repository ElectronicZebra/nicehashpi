/*
this is a quick coinbase api wrapper.
*/
import CryptoJS from "crypto-js";

import request from "request-promise-native"
import qs from 'qs'

const getAuthHeader = (apiSecret, time, method, path, body) => {
	const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, apiSecret);

	hmac.update(time + method + path + '');

	/*hmac.update(time);
	//hmac.update("\0");
	hmac.update(method);
	hmac.update(path);
	if (body) {
		hmac.update(typeof body == 'object' ? JSON.stringify(body) : body);
	}*/

	return hmac.finalize().toString(CryptoJS.enc.Hex);
};


class Api {

	constructor({ apiHost, apiKey, apiSecret }) {
		this.host = apiHost;
		this.key = apiKey;
		this.secret = apiSecret;
	}

	/*
	 * getTime() {
		return request({
			uri: this.host + '/api/v2/time',
			json: true
		})
			.then(res => {
				this.localTimeDiff = res.serverTime - (+new Date());
				this.time = res.serverTime;
				return res;
			});
	} */

	apiCall(method, path, { query, body, time } = {}) {
		/*if (this.localTimeDiff === null) {
			return Promise.reject(new Error('Get server time first .getTime()'));
		} */

		// query in path
		var [pathOnly, pathQuery] = path.split('?');
		if (pathQuery) query = { ...qs.parse(pathQuery), ...query };

		/*

		const nonce = createNonce();
		const timestamp = (time || (+new Date() + this.localTimeDiff)).toString(); */

		const timestamp = (time || Math.floor(+new Date() / 1000));

		const options = {
			uri: this.host + pathOnly,
			method: method,
			headers: {
				'CB-ACCESS-KEY': this.key,
				'CB-ACCESS-SIGN': getAuthHeader(this.secret, timestamp, method, path, body),
				'CB-ACCESS-TIMESTAMP': timestamp,
			},
			qs: query,
			body,
			json: true
		}

		return request(options);
	}

	get(path, options) {
		return this.apiCall('GET', path, options)
	}

	post(path, options) {
		return this.apiCall('POST', path, options)
	}

	put(path, options) {
		return this.apiCall('PUT', path, options)
	}

	delete(path, options) {
		return this.apiCall('DELETE', path, options)
	}

}

export default Api
