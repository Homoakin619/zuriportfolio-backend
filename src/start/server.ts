require('dotenv').config();
import app from "./app"
import config from "../checkout/config"
import http from 'http';
import { logger } from '../checkout/config/logger';
import debug from 'debug';
import { sequelizeInstance } from '../checkout/models';
import { amqpWrapper } from '../checkout/utils/amqpWrapper';
import { OrderCompletedListener } from '../checkout/events/listeners/order-completed.listener';
import { connectionSource } from "../portfolio/database/data-source";
import prisma from "../shop/config/prisma"

export const server = http.createServer(app);

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error: unknown) => {
	logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
	logger.info('SIGTERM received');
	if (server) {
		server.close();
		process.exit(0)
	}
});

process.on('SIGINT', () => {
	console.log('Received SIGINT. Closing server...');
	server.close(() => {
	  console.log('Server closed. Exiting process.');
	  process.exit(0);
	});
  });

var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

server.on('error', onError);
server.on('listening', onListening);

// Normalize a port into a number, string, or false.
function normalizePort(val: string) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

function onError(error: any) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
	process.on('exit', () => {
		prisma.$disconnect();
	  });
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			logger.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			logger.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
	debug('Listening on ' + bind);
}

async function startServer() {
	// database sync
	await sequelizeInstance.sync();
	
	connectionSource
  	.initialize()
	.then(async () => {
		logger.info("Portfolio Database Connected");
  })
  .catch((error) => console.log(error));
    try {
        await amqpWrapper.connectQueue(config.amqp.url)
        process.on('SIGINT', () => {
            amqpWrapper.connection.close()
            amqpWrapper.channel.close()
        })
        process.on('SIGTERM', () => {
            amqpWrapper.connection.close()
            amqpWrapper.channel.close()
			process.exit(0)
        })

        new OrderCompletedListener(amqpWrapper.channel).listen()
    } catch (error) {
        logger.error(error)
    }

	server.listen(config.port, () => {
		logger.info(`Listening to port ${config.port}`);
	});
}
startServer()