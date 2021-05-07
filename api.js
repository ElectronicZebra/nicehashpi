/*
this is a nichash api code.
*/
import CryptoJS from "crypto-js";
import request from "request-promise-native"
import qs from 'qs'

function createNonce() {
	var s = '', length = 32;
	do {
		s += Math.random().toString(36).substr(2);
	***REMOVED*** while (s.length < length);
	s = s.substr(0, length);
	return s;
***REMOVED***

const getAuthHeader = (apiKey, apiSecret, time, nonce, organizationId = '', request = {***REMOVED***) => {
	const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, apiSecret);

	hmac.update(apiKey);
	hmac.update("\0");
	hmac.update(time);
	hmac.update("\0");
	hmac.update(nonce);
	hmac.update("\0");
	hmac.update("\0");
	if (organizationId) hmac.update(organizationId);
	hmac.update("\0");
	hmac.update("\0");
	hmac.update(request.method);
	hmac.update("\0");
	hmac.update(request.path);
	hmac.update("\0");
	if (request.query) hmac.update(typeof request.query == 'object' ? qs.stringify(request.query) : request.query);
	if (request.body) {
		hmac.update("\0");
		hmac.update(typeof request.body == 'object' ? JSON.stringify(request.body) : request.body);
	***REMOVED***

	return apiKey + ':' + hmac.finalize().toString(CryptoJS.enc.Hex);
***REMOVED***;


class Api {

	constructor({ locale, apiHost, apiKey, apiSecret, orgId ***REMOVED***) {
		this.locale = locale || 'en';
		this.host = apiHost;
		this.key = apiKey;
		this.secret = apiSecret;
		this.org = orgId;
		this.localTimeDiff = null;
	***REMOVED***

	getTime() {
		return request({
			uri: this.host + '/api/v2/time',
			json: true
		***REMOVED***)
			.then(res => {
				this.localTimeDiff = res.serverTime - (+new Date());
				this.time = res.serverTime;
				return res;
			***REMOVED***);
	***REMOVED***

	apiCall(method, path, { query, body, time ***REMOVED*** = {***REMOVED***) {
		if (this.localTimeDiff === null) {
			return Promise.reject(new Error('Get server time first .getTime()'));
		***REMOVED***

		// query in path
		var [pathOnly, pathQuery] = path.split('?');
		if (pathQuery) query = { ...qs.parse(pathQuery), ...query ***REMOVED***;

		const nonce = createNonce();
		const timestamp = (time || (+new Date() + this.localTimeDiff)).toString();
		const options = {
			uri: this.host + pathOnly,
			method: method,
			headers: {
				'X-Request-Id': nonce,
				'X-User-Agent': 'NHNodeClient',
				'X-Time': timestamp,
				'X-Nonce': nonce,
				'X-User-Lang': this.locale,
				'X-Organization-Id': this.org,
				'X-Auth': getAuthHeader(this.key, this.secret, timestamp, nonce, this.org, {
					method,
					path: pathOnly,
					query,
					body,
				***REMOVED***)
			***REMOVED***,
			qs: query,
			body,
			json: true
		***REMOVED***

		return request(options);
	***REMOVED***

	get(path, options) {
		return this.apiCall('GET', path, options)
	***REMOVED***

	post(path, options) {
		return this.apiCall('POST', path, options)
	***REMOVED***

	put(path, options) {
		return this.apiCall('PUT', path, options)
	***REMOVED***

	delete(path, options) {
		return this.apiCall('DELETE', path, options)
	***REMOVED***

***REMOVED***

export default Api
