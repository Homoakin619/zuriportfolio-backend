import Joi from 'joi';

const createOrder = {
    body: Joi.object().keys({
        redirect_url: Joi.string().required()
            .uri({ scheme: ['http', 'https'] }) // Allow only 'http' and 'https' schemes
            .trim()
            .replace(/ /g, '%20'),
        payment_method: Joi.string().required().valid('paystack', 'flutterwave'),
    }),
};

const confirmOrder = {
    body: Joi.object().keys({
        tx_ref: Joi.string().required(),
        status: Joi.string().required()
            .valid('completed', 'success', "pending", "failed" ),
    }),
}

export const orderValidation = {
    createOrder,
    confirmOrder,
};
