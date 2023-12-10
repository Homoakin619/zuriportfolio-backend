import Joi from 'joi';

const userComplaint = {
    body: Joi.object().keys({
        product_id: Joi.string().required(),
        complaint: Joi.string().required(),
    }),
};

export const complaintValidation = {
    userComplaint,
};
