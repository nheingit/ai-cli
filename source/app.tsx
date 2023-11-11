import React, {FC, useState, useEffect} from 'react';
import {Text, Box} from 'ink';
import * as http from 'http';

type Props = {
	name: string | undefined;
};

interface StreamComponentProps {
	prompt: string;
}

interface ResponseObject {
	model: string;
	created_at: string;
	response: string;
	done: boolean;
	context?: number[];
	total_duration?: number;
	load_duration?: number;
	sample_count?: number;
	sample_duration?: number;
	prompt_eval_count?: number;
	prompt_eval_duration?: number;
	eval_count?: number;
	eval_duration?: number;
}

export default function App({name = 'Stranger'}: Props) {
	return (
		<Text>
			Hello, <Text color="green">{name}</Text>
		</Text>
	);
}

export const StreamComponent: FC<StreamComponentProps> = ({prompt}) => {
	const [data, setData] = useState<string>('');

	useEffect(() => {
		getYourStream(prompt, incomingStream => {
			let buffer = '';
			incomingStream.on('data', chunk => {
				buffer += chunk.toString();
				let boundary = buffer.indexOf('\n');

				while (boundary !== -1) {
					const piece = buffer.substring(0, boundary);
					buffer = buffer.substring(boundary + 1);
					boundary = buffer.indexOf('\n');

					try {
						const responseObject: ResponseObject = JSON.parse(piece);
						setData(currentData => currentData + responseObject.response);
					} catch (e) {
						console.error('Error parsing JSON:', e);
					}
				}
			});

			incomingStream.on('error', error => {
				console.error('Stream error:', error);
			});

			incomingStream.on('end', () => {
				console.log('Stream ended');
			});
		});
	}, [prompt]);

	return (
		<Box flexDirection="column">
			<Text>{data}</Text>
		</Box>
	);
};

export function getYourStream(
	prompt: string,
	callback: (stream: http.IncomingMessage) => void,
): void {
	const postData = JSON.stringify({
		model: 'zephyr',
		prompt,
	});

	const options: http.RequestOptions = {
		hostname: 'localhost',
		port: 11434,
		path: '/api/generate',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData),
		},
	};

	const req = http.request(options, res => {
		// Check if the response is empty
		if (res.statusCode === 204 || res.headers['content-length'] === '0') {
			console.error('Empty response from the server');
			return;
		}

		callback(res); // Process the stream only if there is content
	});

	req.on('error', e => {
		console.error('HTTP request error:', e);
	});

	req.write(postData);
	req.end();
}
