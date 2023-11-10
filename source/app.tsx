import React, {FC, useState, useEffect} from 'react';
import {Text} from 'ink';
import * as http from 'http';
import {IncomingMessage} from 'http';

type Props = {
	name: string | undefined;
};

interface StreamComponentProps {
	stream: NodeJS.ReadableStream;
}

export default function App({name = 'Stranger'}: Props) {
	return (
		<Text>
			Hello, <Text color="green">{name}</Text>
		</Text>
	);
}

const StreamComponent: FC<StreamComponentProps> = ({stream}) => {
	const [data, setData] = useState('');

	useEffect(() => {
		stream.on('data', chunk => {
			setData(currentData => currentData + chunk);
		});
		stream.on('error', error => {
			console.error('Stream error:', error);
		});

		stream.on('end', () => {
			console.log('Stream ended');
		});

		return () => {
			stream.removeAllListeners();
		};
	}, [stream]);

	return <Text>{data}</Text>;
};

function getYourStream(): Promise<IncomingMessage> {
	const postData = JSON.stringify({
		model: 'zephyr',
		prompt: 'Why is the sky blue?',
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

	return new Promise((resolve, reject) => {
		const req = http.request(options, res => {
			if (res.statusCode < 200 || res.statusCode >= 300) {
				reject(new Error(`Status Code: ${res.statusCode}`));
			} else {
				resolve(res);
			}
		});

		req.on('error', e => {
			reject(e);
		});

		req.write(postData);
		req.end();
	});
}
