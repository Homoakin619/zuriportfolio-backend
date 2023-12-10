import httpStatus from 'http-status';
import express from 'express';
import ApiError from '../utils/ApiError';
import { Role } from '../config/roles';

declare global {
	namespace Express {
		interface Request {
			user?: { id: string };
		}
	}
}

type VerifyCallback = (
	req: express.Request,
	resolve: (value: unknown) => void,
	reject: (reason?: any) => void,
	minimumRole?: Role,
) => any;

const verifyCallback: VerifyCallback = (req, resolve, reject, minimumRole) => {
	const user = req.user;

	// if (minimumRole) {
	// 	const hasRequiredRights = user && user.role >= minimumRole;
	// 	if (!hasRequiredRights && req.params.userId !== user?.id) {
	// 		return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
	// 	}
	// }

	resolve('');
};

export const auth =
	(minimumRole?: Role) =>
	async (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction,
	) => {
		return new Promise((resolve, reject) => {
			verifyCallback(req, resolve, reject, minimumRole)(req, res, next);
		})
			.then(() => next())
			.catch((err) => next(err));
	};
