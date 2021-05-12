'use strict';

import { get_username } from './cognitoclient.js';
import { PATH_GAME, QUERY_PARAMS_GAME_ID } from './constants.js';
import { start_new_game } from './moves-rest-client.js';

const onload = async () => {
	const user_id = get_username();
	console.log('[user_id: %o]', user_id);

	//document.querySelector('#username').textContent = user_id;

	// TODO: populate select#friend with an <option>friend</option>

	document.querySelector('#newgame').addEventListener('submit', async (e) => {
		e.preventDefault();

		const color = document.querySelector('[name=color]').value;
		const opponent = document.querySelector('[name=opponent]').value;
		const friend = document.querySelector('[name=friend]').value;
		console.log('[color: %o, opponent: %o, friend: %o]',
			color, opponent, friend);

		const white = color === 'white' ? 'human' : opponent === 'cpu' ? 'cpu' : 'human';
		const black = color === 'black' ? 'human' : opponent === 'cpu' ? 'cpu' : 'human';
		console.log('[white: %o, black: %o]', white, black);

		const game_id = await start_new_game(user_id, white, black)
		console.log('[game_id: %o]', game_id);

		window.open(`audio.html?${QUERY_PARAMS_GAME_ID}=${game_id}`, '_blank');
		window.location.assign(`${PATH_GAME}?${QUERY_PARAMS_GAME_ID}=${game_id}`);
	});
};

const main = () => {
	document.addEventListener('DOMContentLoaded', onload);
};

main();
