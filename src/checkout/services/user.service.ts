import { User } from '../models';

async function findUserById(userId: string) {
	const user = await User.findByPk(userId);
	return user;
}

export const userService = {
	findUserById,
};
