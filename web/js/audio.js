import { update, register } from './moves-rest-client.js';
import { get_query_param } from './commons.js';
import { QUERY_PARAMS_GAME_ID } from './constants.js';
import { get_username } from './cognitoclient.js';

// page requirement: ?game_id=xxx
let GAME_ID;
try {
	GAME_ID = get_query_param(QUERY_PARAMS_GAME_ID);
}
catch (error) {
	window.alert('no GAME_ID!');
	throw error;
}

const onload = async () => {
	document.querySelector('h3').textContent = GAME_ID;

	for await (const { table } of register(GAME_ID)) {
		document.querySelector('pre').textContent = table;
	}

	document.querySelector('#move').addEventListener('click', async () => {
		const move = document.querySelector('[type=text]').value;

		try {
			await update(get_username(), game_id, move);
		}
		catch (e) {
			window.alert(e);
		}
	});
};

const main = () => {
	document.addEventListener('DOMContentLoaded', onload);
};

main();
