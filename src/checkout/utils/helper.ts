const calculateFinalPrice = (price: number, discount_price: number) => {
	if (discount_price !== null) {
		return discount_price;
	}
	return price;
};

export default calculateFinalPrice;


export function getDate(dateString: string) {
	const months = [
		'January','February','March','April','May',
		'June','July','August','September','October'
		,'November','December'
	  ]
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	return `${day} ${months[month]} ${year}`;
}

export type ResponseType = {
	status?: number,
	success?: boolean,
	message?: string,
	data?: any
}


export const createResponseBody = (data:ResponseType) => {
	return {
		status: data.status || 200,
		success: data.success || true,
		message: data.message,
		data: data.data}
  }