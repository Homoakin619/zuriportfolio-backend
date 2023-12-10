// const pick = (object, keys) => {
// 	return keys.reduce((obj, key) => {
// 		if (object && Object.prototype.hasOwnProperty.call(object, key)) {
// 			// eslint-disable-next-line no-param-reassign
// 			obj[key] = object[key];
// 		}
// 		return obj;
// 	}, {});
// };

// export default pick;

export default function pick(object: Record<string, any>, keys: string[]) {
	return keys.reduce(
		(obj, key) => {
			if (object && object.hasOwnProperty(key)) {
				obj[key] = object[key];
			}
			return obj;
		},
		{} as Record<string, any>,
	);
}
