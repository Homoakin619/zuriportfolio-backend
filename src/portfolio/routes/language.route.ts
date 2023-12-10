import express from 'express';
import languageController from '../controllers/language.controller';
import {
  postLanguageSchema,
  validateSchema,
} from '../middlewares/language.zod';

export const languageRouter = express.Router();

/**
 * @swagger
 * /api/v1/languages:
 *   post:
 *     summary: Create a new language for user
 *     description: Adds a language as one of the user languages
 *     tags: [Language]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: Body of request takes a userId (uuid) and languages (array of strings) in the body
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               format: uuid
 *               example: "0c8c29f7-5baf-4d81-97ba-eaa992a8801b"
 *             languages:
 *               type: array
 *               items:
 *                type: string
 *               example: ["Python", "Javascript"]
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
languageRouter.post(
  '/',
  validateSchema(postLanguageSchema),
  languageController.addLanguage
);

/**
 * @swagger
 * /api/v1/languages/{userId}:
 *   get:
 *     summary: Get all languages owned by the user
 *     description: Get all the languages the requesting user owns
 *     tags: [Language]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Id of requesting user
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 0c8c29f7-5baf-4d81-97ba-eaa992a8801b
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
languageRouter.get('/:userId', languageController.getUserLanguages);

/**
 * @swagger
 * /api/v1/languages/{userId}:
 *   delete:
 *     summary: delete all languages owned by the user
 *     description: delete all the languages the requesting user owns
 *     tags: [Language]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Id of requesting user
 *         schema:
 *           type: string
 *           format: uuid
 *           example: 0c8c29f7-5baf-4d81-97ba-eaa992a8801b
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
languageRouter.delete('/:userId', languageController.deleteAllUserLanguages);

/**
 * @swagger
 * /api/v1/languages:
 *   get:
 *     summary: Get all languages that can be chosen
 *     description: Get all the languages that will be shown on the frontend dropdown
 *     tags: [Language]
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
languageRouter.get('/', languageController.getProgrammingLanguages);

/**
 * @swagger
 * /api/v1/programmingLanguage:
 *   post:
 *     summary: Add programming Languages
 *     description: Admin role to add programming languages that can be selected
 *     tags: [Language]
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const programmingLanguageRouter = express.Router()
programmingLanguageRouter.post('/', languageController.addProgrammingLanguages);

