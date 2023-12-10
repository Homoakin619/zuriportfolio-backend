import httpStatus from 'http-status';
import Asyncly from '../utils/Asyncly';
import { cartsService, userService, } from '../services';
import ApiError from '../utils/ApiError';
import { ProductImage } from '../models/product_image.model';
import { createResponseBody } from '../utils/helper';
import { OrderItem } from '../models';
import { Complaint } from '../models/complaint.model';
import { complaintService } from '../services/complaint.service';
import axios from 'axios';
import config from '../config';
import { logger } from '../config/logger';




const createComplaint = Asyncly(async (req, res) => {
const endpointURL = `${config.messaging_url}/user/complaint-confirmation`	
	const { product_id, complaint } = req.body;
	const user_id = req.user?.id;
	if (!user_id) {
		res.status(httpStatus.BAD_REQUEST)
			.json(createResponseBody(
				{status: 401, success: false, 
					message: 'user unauthorized' }));
		return;
	}
    const orderItem = await OrderItem.findOne({ where: { product_id, customer_id: user_id } });
    if (!orderItem) {
        return res.status(httpStatus.FORBIDDEN).json({status: 403, success: false, message: 'You are not authorized to perform this action'}).end();
    }
	const customer = await userService.findUserById(user_id);

	const savedComplaint = await complaintService.createComplaint({user_id, product_id, complaint_text: complaint, status: 'pending'});
	if (!savedComplaint) {
		return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.json(
				{status: httpStatus.INTERNAL_SERVER_ERROR,success: false, 
					message: 'complaint not saved. Please try again' })
		
	}
	try {
		await axios.post(endpointURL, 
			{
				recipient:customer?.email, name:customer?.first_name, tracking_number: savedComplaint.id
			})
		
	} catch (error) {
		logger.error('Error sending the message:', error);
	}
	res.status(httpStatus.CREATED).json({
			success: true,
			status: httpStatus.CREATED,
			message: 'complaint has been sent',
            data: savedComplaint
		})
	})



export const complaintController = {
	createComplaint,
};
