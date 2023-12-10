const user = ['getTickets', 'useTickets'];
const admin = [...user, 'sendTickets', 'buyTickets'];
const supery = [...user, ...admin];

const allRoles = {
	user,
	admin,
	supery,
};

export enum Role {
	USER,
	ADMIN,
	SUPER_ADMIN_1,
	SUPER_ADMIN_2,
}

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
