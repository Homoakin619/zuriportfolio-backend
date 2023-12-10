import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import createError from 'http-errors';
import httpStatus from 'http-status';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';

//  CHECKOUT IMPORTS
import config from '../checkout/config';
import morgan from '../checkout/config/morgan';
import { errorConverter, errorHandler } from '../checkout/middlewares/error';
import { authLimiter } from '../checkout/middlewares/rateLimiter';
import apiRouter from '../checkout/routes';
import ApiError from '../checkout/utils/ApiError';
import { swaggerSpec } from '../checkout/swagger';

// PORTFOLIO IMPORTS
import { sayHelloController } from "../portfolio/controllers/greeting.controller";
import  {specs as swaggerOptions} from "../portfolio/swagger";
import { errorHandler as portfolioErrorHandler } from "../portfolio/middlewares/index";

// SHOP IMPORTS
import ProductRoute from '../shop/routes/product.route';
import App from '../shop/app';
import UserRoute from '../shop/routes/user.route';
import RevenueRoute from '../shop/routes/revenue.route';
import OrderRoute from '../shop/routes/order.route';
import DiscountRoute from '../shop/routes/discount.route';
import ShopRoute from '../shop/routes/shop.route';
import SalesRoute from '../shop/routes/sales.route';
import ActivitiesRoute from '../shop/routes/activity.route';
import { logger as customLogger } from '../checkout/config/logger';
import portfoliosRouter from '../portfolio/routes';


const app = express();
const appServer = new App(app);
appServer.initializedRoutes([
    new UserRoute(),
    new OrderRoute(),
    new ProductRoute(),
    new RevenueRoute(),
    new DiscountRoute(),
    new ShopRoute(),
    new SalesRoute(),
    new ActivitiesRoute(),
  ]);
  appServer.listen()
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


// PORTFOLIO SETTINGS
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

app.get('/dev', (req, res) => {
	res.send('Welcome to Developer Cart API. Visit /docs for API documentation');
});
app.get("/api", sayHelloController);


// set security HTTP headers
app.use(helmet());
// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
	app.use('/auth', authLimiter);
}

app.get('/', (req, res) => {
	res.send('Welcome to Checkout Cart API. Visit /docs for API documentation');
});

app.get('/portfolio-api', (req, res) => {
	res.send('Welcome to Developer Cart API. Visit /docs for API documentation');
});


// APP ROUTER
app.use('/api/v1/checkout', apiRouter);
app.use("/api/v1/portfolio", portfoliosRouter)

// ERROR HANDLERS
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
// convert error to ApiError, if needed
app.use('/api/v1/checkout',errorConverter);
// handle error
app.use('/api/v1/checkout',errorHandler);

app.use("/api/v1/portfolio",errorConverter);
app.use("/api/v1/portfolio",errorHandler);

app.use("/api/v1/shop",errorConverter);
app.use("/api/v1/shop",errorHandler);

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
