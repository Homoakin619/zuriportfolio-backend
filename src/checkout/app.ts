import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import createError from 'http-errors';
import httpStatus from 'http-status';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';

import config from './config';
import morgan from './config/morgan';
import { errorConverter, errorHandler } from './middlewares/error';
import { authLimiter } from './middlewares/rateLimiter';
import apiRouter from './routes';
import ApiError from './utils/ApiError';
import { swaggerSpec } from './swagger';

const app = express();
// INITIALIZE MIDDLEWARES
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Logger
if (config.env !== 'test') {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}
// gzip compression
app.use(compression());
// enable cors
app.use(cors());
app.options('*', cors());
// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/checkout/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.json(swaggerSpec);
});
app.get('/api/v1/checkout/docs.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.json(swaggerSpec);
});
// set security HTTP headers
app.use(helmet());
// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
	app.use('/auth', authLimiter);
}
app.get('/', (req, res) => {
	res.send('Welcome to Checkout Cart API. Visit /docs for API documentation');
});

app.get('/dev', (req, res) => {
	res.send('Welcome to Developer Cart API. Visit /docs for API documentation');
});
// APP ROUTER
app.use('/api/v1/checkout', apiRouter);

// ERROR HANDLERS
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
// convert error to ApiError, if needed
app.use('/api/v1/checkout',errorConverter);
// handle error
app.use('/api/v1/checkout',errorHandler);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500).end();
} as ErrorRequestHandler);

export default app;
