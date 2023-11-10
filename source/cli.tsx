#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

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

const name = cli.input[0];

render(<App name={name} />);

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
