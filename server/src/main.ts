/// <reference path="../../typings/tsd.d.ts" />

'use strict';

require('es6-shim');

import * as path from 'path';
import * as util from 'util';
import * as http from 'http';
import { EventEmitter } from 'events';

import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as socketIO from 'socket.io';

import { Action, actionsToBeSent as authorizedActions } from '../../client/src/actions';

var app = express();

var PORT = process.env.VIRTUAL_PORT || 3000;
// var PORT = process.env.VIRTUAL_PORT;

app.use(compression());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '..', '..', 'client')));
app.use('/img', express.static(path.join(__dirname, '..', '..', 'img')));

export interface Request {
    index: number;
    action: Action;
}

export function BinServer(): void {
	EventEmitter.call(this);

	var server = http.createServer(app);
	var io = socketIO(server);

	io.on('connection', (socket: any) => {
		// This is just a bridge to make the data go from 6bin client to 6brain
		socket.on('request', (data: Request) => {
			if (authorizedActions.has(data.action.type)) {
				console.log(data.action.type, 'is valid, => 6brain');
				this.emit('msg', data);
			}
			else
				console.log(data.action.type, 'is not valid');

		});

		function respondToClient(response: any) {
			console.log('responding from main.ts');
			socket.emit('response', Object.assign({}, {index: response.index}, {isSuccessful: true}));
		}

		socket.on('disconnect', () => {
			this.removeListener('response', respondToClient);
		});

		this.on('response', respondToClient);
	});

	this.start = function(port: number){
		server.listen(port, function () {
		    console.log('Server running on', [
		        'http://localhost:',
		        port
		    ].join(''));
		});
	};

	this.stop = function(){
		server.close();
	};
}

process.on('uncaughtException', function(e: Error){
    console.error('uncaught', e, e.stack);
    process.exit();
});

util.inherits(BinServer, EventEmitter);
