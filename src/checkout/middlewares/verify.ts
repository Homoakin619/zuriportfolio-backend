import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import axios from 'axios';
import { logger } from '../config/logger';

const verifyToken: RequestHandler = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
	}
	// https://auth.akuya.tech/api/auth/api/authorize
	const token = authHeader.split(' ')[1];
	try {
				const response = await axios.post('https://zuri-auth.up.railway.app/api/auth/api/authorize', {
					token,
				});
	
		if (response.status === 200) {
			req.user = response.data.user;
			next();
		} else {
			return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
		}
	} catch (error) {
		return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
	}
};

export const jwtAuth = {
	verifyToken,
};
