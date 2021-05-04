'use strict';

// TODO move almost everything inside moves-rest-client

import { HOSTNAME } from './configuration.js';

const onload = async () => {
	const ws = new WebSocket(`wss://${HOSTNAME}:8443/micdrop/16000`);

	ws.onmessage = (event) => {
		const text = JSON.parse(event.data)['text'];
		console.log(text);
		document.querySelector('pre').textContent += text + '\n';
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
		ondataavailable: ws.send.bind(ws),
		desiredSampRate: 16000,
		numberOfAudioChannels: 1
	}).startRecording();
};

const main = () => {
	document.addEventListener('DOMContentLoaded', onload);
};

main();
