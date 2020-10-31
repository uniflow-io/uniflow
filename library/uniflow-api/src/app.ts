import 'reflect-metadata';
import * as express from 'express';
import { env } from './config';
import { database, server } from './loaders';
import { Server as HttpServer } from 'http';
import { Connection } from 'typeorm';

export default class App {
	private _app: express.Application;
	private _connection: Connection;
	private _server: HttpServer;

	public app(): express.Application {
		return this._app;
	}

	public connection(): Connection {
		return this._connection;
	}

	public server(): HttpServer {
		return this._server;
	}

	public async start(): Promise<void> {
		this._connection = await database();
		
		return new Promise((resolve) => {
			const PORT = env.get('port');
			this._app = server(express(), express.static('./public'));
			this._app.on('error', (err: any) => {
				console.log(err);
				process.exit(1);
			})
			this._server = this._app.listen(PORT, resolve);
		})
	}

	public async close(): Promise<void> {
		this._server.close();
		this._connection.close();
	}
}