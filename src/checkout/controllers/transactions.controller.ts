import httpStatus from 'http-status';
import Asyncly from '../utils/Asyncly';
import {transactionsService} from '../services/transactions.service'
import { validateUUID } from '../validation/uuidValidation';
import { createResponseBody } from '../utils/helper';

const getAllTransactions = Asyncly(async (req, res) => {
	const userId = req.user?.id;
	if (!userId) {
		return res.status(httpStatus.UNAUTHORIZED).json({message: "AccessDenied: Kindly Authenticate to continue"})
	}

	const transactions = await transactionsService.getAllTransactions(userId as string);
	if (transactions.status == 200) {
		return res.status(httpStatus.OK).json({
			status: httpStatus.Ok,
			success: true,
			message: "transactions fetched successfully", 
			data: transactions.result
		});
	}
	return res
			.status(httpStatus.INTERNAL_SERVER_ERROR)
			.json({ message: 'Error fetching user transactions:' });
});


const getOrderTransactions = Asyncly(async(req,res) => {
	const userId = req.user?.id
	if (!userId) {
		return res.status(httpStatus.UNAUTHORIZED).json({message: "AccessDenied: Kindly Authenticate to continue"})
	}
	const transactions = await transactionsService.getOrderTransactions(userId)
	return {transactions: transactions, message: "Transaction fetched successfully"}
})


const getSingleTransaction = Asyncly(async (req, res) => {
	const { transactionId } = req.params;

	const transaction =
		await transactionsService.getSingleTransaction(transactionId);

	if (!transaction) {
		return res.status(httpStatus.NOT_FOUND).json({
			statusCode: httpStatus.NOT_FOUND,
			success: false,
			message: 'Transaction not found',
		});
	}

	res.status(httpStatus.OK).json({
		statusCode: httpStatus.OK,
		success: true,
		message: 'Transaction retrieved successfully',
		data: transaction,
	});
});

const confirmTransaction = Asyncly(async (req, res) => {
	const {txn_ref,payment_gateway} = req.body;
	if(!txn_ref || !payment_gateway) return res.status(400).json(createResponseBody({data: null,message: "txn_ref and payment_gateway are required",status:400,success: false}))
	let transactionStatus;
	if (payment_gateway == "paystack") {
		 transactionStatus = await transactionsService.confirmPaystackTransaction(txn_ref);
	}else {
		 transactionStatus = await transactionsService.confirmFlutterwaveTransaction(txn_ref);
	}
	return res.status(200).json(createResponseBody({message: "Successfully fetched status", success: transactionStatus.status , data: transactionStatus.data}))
})

export const transactionsController = {
	getAllTransactions,
	getSingleTransaction,
	getOrderTransactions,
	confirmTransaction
};
