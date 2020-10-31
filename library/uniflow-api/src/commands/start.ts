import 'reflect-metadata';
import { Command, flags } from '@oclif/command';
import * as open from 'open';

import { env } from '../config';
import App from "../app";

let processExistCode = 0;

export class Start extends Command {
	static description = 'Starts uniflow api.';

	static examples = [
		`$ uniflow-api start`,
		`$ uniflow-api start -o`,
	];

	static flags = {
		help: flags.help({ char: 'h' }),
		open: flags.boolean({
			char: 'o',
			description: 'opens the UI automatically in browser',
		}),
	};

	/**
	 * Opens the UI in browser
	 */
	static openBrowser() {
    const url = `http://localhost:${env.get('port')}`;

		open(url, { wait: true })
			.catch((error: Error) => {
				console.log(`\nWas not able to open URL in browser. Please open manually by visiting:\n${url}\n`);
			});
	}

	/**
	 * Stoppes uniflow in a graceful way.
	 */
	static async stopProcess() {
		console.log(`\nStopping uniflow...`);

		setTimeout(() => {
			// In case that something goes wrong with shutdown we
			// kill after max. 30 seconds no matter what
			process.exit(processExistCode);
		}, 30000);

		process.exit(processExistCode);
	}

	async run() {
		// Make sure that uniflow shuts down gracefully if possible
		process.on('SIGTERM', Start.stopProcess);
		process.on('SIGINT', Start.stopProcess);

		const { flags } = this.parse(Start);

		// Wrap that the process does not close but we can still use async
		(async () => {
			try {
				const app = new App()
				await app.start();

				const url = `http://localhost:${env.get('port')}`;
				this.log(`\nUniflow api v${require('../../package.json').version} is ready on:\n${url}`);

				// Allow to open uniflow editor by pressing "o"
				if (Boolean(process.stdout.isTTY) && process.stdin.setRawMode) {
					process.stdin.setRawMode(true);
					process.stdin.resume();
					process.stdin.setEncoding('utf8');
					let inputText = '';

					if (flags.open) {
						Start.openBrowser();
					}
					this.log(`\nPress "o" to open in Browser.`);
					process.stdin.on("data", (key: string) => {
						if (key === 'o') {
							Start.openBrowser();
							inputText = '';
						} else if (key.charCodeAt(0) === 3) {
							// Ctrl + c got pressed
							Start.stopProcess();
						} else {
							// When anything else got pressed, record it and send it on enter into the child process
							if (key.charCodeAt(0) === 13) {
								// send to child process and print in terminal
								process.stdout.write('\n');
								inputText = '';
							} else {
								// record it and write into terminal
								inputText += key;
								process.stdout.write(key);
							}
						}
					});
				}
			} catch (error) {
				this.error(`There was an error: ${error.message}`);

				processExistCode = 1;
				// @ts-ignore
				process.emit('SIGINT');
			}
		})();
	}
}
