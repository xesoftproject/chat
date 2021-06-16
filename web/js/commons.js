/**
 * return the query parameters as a multi valued map
 * 
 * @param {Location} location
 * @returns {{string, [string]}}
 */
const queryparams = (location = window.location) => {
	if (!location.search)
		return {};

	const ret = {};

	const search = location.search.substr(1);
	for (const [k, v] of search.split('&').map(kv => kv.split('=', 2))) {
		if (k in ret)
			ret[k].push(v);
		else
			ret[k] = [v];
	}

	return ret;
};

/**
 * @param {string} key the key
 * @returns {string} the value
 * @throws {Error} when key not found, or multiple ones
 */
const get_query_param = (key, location = window.location) => {
	const dict = queryparams(location);
	if (!(key in dict))
		throw new Error(`[key: ${key}]`);

	const values = dict[key];
	if (values.length !== 1)
		throw new Error(`[values: ${values}]`);

	return decodeURIComponent(values[0]);
};

/**
 * "sleep" async function
 * @param {number} ms - duration
 * @returns {Promise<null>} nothing
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const _messages_datas = [];
const _messages_resolves = [];
const _messages_on_message = (event) => {
	if (_messages_resolves.length) {
		_messages_resolves.shift()(event.data);
		return;
	}

	_messages_datas.push(event.data);
};

/**
 * convert a websocket to an async generator
 * @param {WebSocket} ws
 */
const messages = async function*(ws) {
	if (ws.readyState !== WebSocket.OPEN)
		await new Promise((resolve, reject) => {
			ws.addEventListener('close', reject);
			ws.addEventListener('open', resolve);
			ws.addEventListener('error', reject);
		});

	ws.addEventListener('message', _messages_on_message);

	const receive = () => {
		if (_messages_datas.length)
			return Promise.resolve(_messages_datas.shift());

		return new Promise(resolve => {
			_messages_resolves.push(resolve);
		});
	};

	while (ws.readyState === WebSocket.OPEN) {
		yield await receive();
	}
};
const force_next_message = (data) => {
	const event = { data };
	_messages_on_message(event);
};


const json_parse = async function*(agen) {
	for await (const el of agen) {
		yield JSON.parse(el);
	}
};


export { queryparams, get_query_param, sleep, messages, json_parse, force_next_message };
