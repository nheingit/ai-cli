#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App, {StreamComponent} from './app.js';

const cli = meow(
	`
    Usage
      $ ai <name>

    Examples
      $ ai Jane
      Hello, Jane
    `,
	{
		importMeta: import.meta,
	},
);

const command = cli.input[0];
const question = cli.input.slice(1).join(' ');

const MainComponent = () => {
	if (command === 'ask' && question) {
		return <StreamComponent prompt={question} />;
	} else {
		// Default behavior or some error handling
		return <App name={command} />;
	}
};

render(<MainComponent />);

// const cli = meow(
// 	`
// 	Usage
// 	  $ ai
//
// 	Options
// 		--name  Your name
//
// 	Examples
// 	  $ ai --name=Jane
// 	  Hello, Jane
// `,
// 	{
// 		importMeta: import.meta,
// 		flags: {
// 			name: {
// 				type: 'string',
// 			},
// 		},
// 	},
// );
//
// render(<App name={cli.flags.name} />);
