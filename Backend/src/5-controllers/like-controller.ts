import express, { Request, Response, NextFunction } from "express";
import { likeService, LikeService } from "../4-services/like-service";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { StatusCode } from "../3-models/enums ";
import { cyber } from "../2-utils/cyber";
import { LikeModel } from "../3-models/like-model";


export class LikeController {

    public readonly router = express.Router();

    public constructor() {
        this.router.post("/api/likes", securityMiddleware.verifyToken, this.addLike);
        this.router.delete("/api/likes/:vacationId", securityMiddleware.verifyToken, this.removeLike);
    }

    private addLike = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const token = cyber.extractToken(request);
            const userId = cyber.getTokenUserId(token!);
            const like = new LikeModel({
                userId,
                vacationId: Number(request.body.vacationId)
            } as LikeModel);
            like.validate();
            await likeService.addLike(like.userId, like.vacationId);
            response.sendStatus(StatusCode.Created);
        }
        catch (err: any) {
            next(err);
        }
    };

    private removeLike = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const token = cyber.extractToken(request);
            const userId = cyber.getTokenUserId(token!);
            const vacationId = Number(request.params.vacationId || request.body.vacationId);
            await likeService.removeLike(userId, vacationId);
            response.sendStatus(StatusCode.OK);
        }
        catch (err: any) {
            next(err);
        }
    };
}

export const likeController = new LikeController();