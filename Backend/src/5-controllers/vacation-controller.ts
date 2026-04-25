import express, { NextFunction, Request, Response, Router } from "express";
import { vacationService } from "../4-services/vacation-service";
import { VacationModel } from "../3-models/vacation-model";
import { StatusCode } from "../3-models/enums ";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { cyber } from "../2-utils/cyber";


class VacationController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/vacations", securityMiddleware.verifyToken, this.getAllVacations);
        this.router.get("/api/vacations/images/:imageName", this.getImage);
        this.router.get("/api/vacations/:vacationId", securityMiddleware.verifyToken, this.getVacationById);
    }

    private getAllVacations = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const token = cyber.extractToken(request);
            const userId = cyber.getTokenUserId(token!);

            const page = typeof request.query.page === "string"
                ? Number(request.query.page)
                : 1;
            const filter = typeof request.query.filter === "string" ? request.query.filter : "all";

            const vacations = await vacationService.getAllVacations(userId, page, filter);

            response.status(StatusCode.OK).json(vacations);
        }
        catch (err: any) {
            next(err);
        }
    }

    private async getVacationById(request: Request, response: Response) {
        const vacationId = +request.params.vacationId;
        const vacation = await vacationService.getVacationById(vacationId);
        response.json(vacation);
    }

    private getImage = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const imageName = request.params.imageName.toString();
            const filePath = vacationService.getImagePath(imageName);
            response.sendFile(filePath);
        }
        catch (err: any) {
            next(err);
        }
    };
}

export const vacationController = new VacationController();
