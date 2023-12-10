import Joi from 'joi';

const guestCartSummary = {
    body: Joi.object().keys({
        product_ids: Joi.array().items(Joi.string()).required()
    }),
};

export const cartValidation = {
    guestCartSummary,
};
