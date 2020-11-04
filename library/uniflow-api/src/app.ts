import * as express from 'express';
import * as convict from 'convict'
import { ParamsConfig } from './config';
import { DatabaseLoader, ServerLoader } from './loaders';
import { Server as HttpServer } from 'http';
import { Connection } from 'typeorm';
import { AppConfig } from './config/params-config';
import { Service } from 'typedi';

@Service()
export default class App {
	private server: HttpServer;

	constructor(
		private paramsConfig: ParamsConfig,
		private databaseLoader: DatabaseLoader,
		private serverLoader: ServerLoader
	) {}

	public getParams(): convict.Config<AppConfig> {
		return this.paramsConfig.getConfig();
	}

	public getApp(): express.Application {
		return this.serverLoader.getApp();
	}

	public getConnection(): Connection {
		return this.databaseLoader.getConnection();
	}

	public getServer(): HttpServer {
		return this.server;
	}

	public async start(): Promise<void> {
		await this.databaseLoader.load();
		await this.serverLoader.load()
		
		return new Promise((resolve) => {
			const PORT = this.paramsConfig.getConfig().get('port');
			const app = this.serverLoader.getApp()
			app.on('error', (err: any) => {
				console.log(err);
				process.exit(1);
			})
			this.server = app.listen(PORT, resolve);
		})
	}

	public async close(): Promise<void> {
		this.server.close();
		this.databaseLoader.getConnection().close();
	}
}