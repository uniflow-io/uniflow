import 'reflect-metadata'
import { default as Container } from '../container'
import * as Config from '@oclif/config';
import { Command, flags } from '@oclif/command'
import { LeadSubscriberInterface } from '../service/lead-subscriber/interfaces';

export default class LeadsSyncCommand extends Command {
	static description = 'Sync leads'

	static examples = [
		`$ uniflow-api leads-sync`,
	]

	static flags = {
		help: flags.help({ char: 'h' }),
	}

	private leadSubscriber: LeadSubscriberInterface

	constructor(argv: string[], config: Config.IConfig) {
		super(argv, config)

		this.leadSubscriber = new Container().get('LeadSubscriberInterface')
	}

	async run() {
		(async () => {
			try {
				await this.leadSubscriber.sync()
				this.log('Leads were succefully synced')
			} catch (error) {
				this.error(`There was an error: ${error.message}`)
			}
		})()
	}
}
