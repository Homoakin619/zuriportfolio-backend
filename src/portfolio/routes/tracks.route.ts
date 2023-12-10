import express from "express";
import { getAllTracks, getTrackById, createUserTrack } from "../controllers/tracks.controller";

export const tracksRouter = express.Router();

/**
 * @swagger
 * /api/v1/tracks:
 *   get:
 *     summary: Get all the tracks
 *     description: Retrieve all tracks using a GET request.
 *     tags: [Tracks]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
tracksRouter.get("/", getAllTracks);

tracksRouter.get("/:id", getTrackById);

tracksRouter.post("/", createUserTrack);

