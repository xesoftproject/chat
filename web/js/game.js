'use strict';

const STEP = .06;
const STEP_DURATION = 1000;

import { register } from './moves-rest-client.js';
import { get_query_param } from './commons.js'
import { QUERY_PARAMS_GAME_ID } from './constants.js';
import { get_username } from './cognitoclient.js';
import { HOSTNAME } from './configuration.js';


// page requirement: ?game_id=xxx
let GAME_ID;
try {
	GAME_ID = get_query_param(QUERY_PARAMS_GAME_ID);
}
catch (error) {
	window.alert('no GAME_ID!');
	throw error;
}


/**
 * @param {string} from
 * @returns {Element}
 */
const lookup = (from) => {
	return document.querySelector(`[square="${from}"]`);
};


/**
 * @param {string} from
 * @param {string} to
 * @returns {{delta_x: number, delta_y: number}}
 */
const movement = (from, to) => {
	const from_x = from.charCodeAt(0);
	const from_y = parseInt(from.substr(1, 1));
	const to_x = to.charCodeAt(0);
	const to_y = parseInt(to.substr(1, 1));

	return {
		delta_x: to_x - from_x,
		delta_y: to_y - from_y
	};
};


/**
 * @param {Element} piece
 * @param {number} delta_x
 * @param {number} delta_y
 * @param {string} to
 */
const apply_move = async (piece, delta_x, delta_y, to) => {
	console.debug('piece: %o, delta_x: %o, delta_y: %o, to: %o',
		piece, delta_x, delta_y, to);
	if (!piece) {
		console.error('no piece!');
		return;
	}

	// the table is rotated of 90°
	const x = piece.object3D.position.x + (delta_y * STEP);
	const y = piece.object3D.position.y
	const z = piece.object3D.position.z + (delta_x * STEP);

	piece.setAttribute('animation',
		`property: position; dur: ${STEP_DURATION}; to: ${x} ${y} ${z}`);

	await new Promise(resolve => {
		piece.addEventListener('animationcomplete', resolve)
	});

	const captured = lookup(to);
	if (captured) {
		console.info('captured: %o', captured);
		captured.remove();
	}

	piece.setAttribute('square', to);
};

/**
 * @param {Element} piece
 * @param {number} delta_x
 * @param {number} delta_y
 * @returns {boolean}
 */
const is_castling = (piece, delta_x, delta_y) => {
	const id = piece.getAttribute('id');

	// only the king can make the castling
	if (id !== 'whiteking' && id !== 'blackking')
		return false;

	// it's the only king move of lenght 2 - and horizontally
	return (delta_x === 2 || delta_x === -2) && delta_y === 0;
};


/**
 * @param {string} chr
 * @returns {string}
 */
const succ_chr = (chr, delta = 1) => {
	return String.fromCharCode(chr.charCodeAt(0) + delta);
};


/**
 * create a "fake" move of the correct rook to handle the castling
 * 
 * @param {Element} piece
 * @param {number} delta_x
 * @returns {{ rook_piece: Element, rook_from: string, rook_to: string }}
 */
const castling = (piece, delta_x) => {
	const color = piece.getAttribute('id').substr(0, 5); // white | black
	const side = delta_x === 2 ? 'h' : 'a'; // a | h

	// rooks ids are whiterooka, whiterookh, blackrooka, blackrookh
	const rook_piece = document.getElementById(`${color}rook${side}`);
	const rook_from = rook_piece.getAttribute('square');

	// the rook goes on the square the king crossed
	const king_square = piece.getAttribute('square'); // after the move!
	const king_square_x = parseInt(king_square.substr(1, 1));
	const king_square_y = king_square.substr(0, 1);
	const rook_to_y = succ_chr(king_square_y, delta_x === 2 ? -1 : 1);

	const rook_to = `${rook_to_y}${king_square_x}`;

	return {
		rook_piece,
		rook_from,
		rook_to
	};
};
/**
 * @param {Element} piece
 * @param {number} delta_x
 * @param {number} delta_y
 * @param {string} to
 * @returns {Promise<any>}
 */
const maybe_castling = async (piece, delta_x, delta_y) => {
	if (!is_castling(piece, delta_x, delta_y))
		return;

	console.info('arrocco');

	const { rook_piece, rook_from, rook_to } = castling(piece, delta_x);
	console.debug('rook_piece: %o, rook_from: %o, rook_to: %o',
		rook_piece, rook_from, rook_to);

	const { delta_x: rook_delta_x, delta_y: rook_delta_y } = movement(rook_from, rook_to);
	console.debug('rook_delta_x: %o, rook_delta_y: %o', rook_delta_x, rook_delta_y);

	await apply_move(rook_piece, rook_delta_x, rook_delta_y, rook_to);
};


const b64encode = (blob) => {
	const reader = new FileReader();
	reader.readAsDataURL(blob);
	return new Promise(resolve => {
		reader.onloadend = () => {
			resolve(reader.result.split(',', 2)[1]);
		};
	});
};

const onload = async () => {
	const user_id = get_username();
	console.debug('I_AM', user_id, 'GAME_ID', GAME_ID);

	const fn = async () => {
		const ws = new WebSocket(`wss://${HOSTNAME}:8443/moves/16000`);

		ws.onmessage = (event) => {
			const status = JSON.parse(event.data);
			console.log(status);
			const msg = status.error ? status.error : status.success ? status.success : '';
			document.querySelector('#overlay .debug').textContent += msg + '\n';
		};

		ws.onerror = console.error.bind(console)

		const microphone = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: true
			}
		});


		RecordRTC(microphone, {
			type: 'audio',
			mimeType: 'audio/wav;codecs=pcm',
			recorderType: StereoAudioRecorder,
			timeSlice: 1000,
			ondataavailable: async (data) => {
				console.log('recorded stuff');
				ws.send(JSON.stringify({
					'user_id': user_id,
					'game_id': GAME_ID,
					'data': await b64encode(data)
				}));
			},
			desiredSampRate: 16000,
			numberOfAudioChannels: 1
		}).startRecording();

		console.log('output loop')

		for await (const { move, table, winner } of register(GAME_ID)) {
			console.info('move: %o, winner: %o', move, winner);

			{
				const rows = table.split('\n');
				// decorate rows with numbers
				for (let i=8; i>=1; i-=1) {
					rows[8-i] = `${i} ${rows[8-i]}`;
				}
				// append letters
				rows.push('  A B C D E F G H');

				document.querySelector('#overlay .table').textContent = rows.join('\n');
			}

			if (!move)
				continue;

			const from = move.substr(0, 2);
			const to = move.substr(2, 2);

			console.debug('from: %o, to: %o', from, to);

			const piece = lookup(from);
			console.debug('piece: %o', piece);

			const { delta_x, delta_y } = movement(from, to);
			console.debug('delta_x: %o, delta_y: %o', delta_x, delta_y);

			await apply_move(piece, delta_x, delta_y, to);

			await maybe_castling(piece, delta_x, delta_y);
		}
	};

	const scene = document.querySelector('a-scene');
	if (scene.hasLoaded)
		await fn();
	else
		scene.addEventListener('loaded', fn);
};


const main = () => {
	document.addEventListener('DOMContentLoaded', onload);
};


main();
