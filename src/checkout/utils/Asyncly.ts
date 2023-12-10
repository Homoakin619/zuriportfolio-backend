import { RequestHandler } from 'express';

function Asyncly(fn: RequestHandler) {
	const handler: RequestHandler = (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch((err) => next(err));
	};
	return handler;
}

export default Asyncly;
