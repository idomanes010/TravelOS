import express, { NextFunction, Request, Response, Router } from "express";
import { VacationModel } from "../3-models/vacation-model";
import { adminService } from "../4-services/admin-service";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { StatusCode } from "../3-models/enums ";

class AdminController {
    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/admin/add", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, securityMiddleware.preventXss, this.addVacation);
        this.router.put("/api/admin/update/:id", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, securityMiddleware.preventXss, this.updateVacation);
        this.router.delete("/api/admin/delete/:id", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, this.deleteVacation);
        this.router.get("/api/admin/report", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, this.getVacationReport);
        this.router.get("/api/admin/report/csv", securityMiddleware.verifyToken, securityMiddleware.verifyAdmin, this.getReportCsv);
    }

    private addVacation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const image = req.files?.image;
            const vacation = new VacationModel({ ...req.body, image });
            const dbVacation = await adminService.addVacation(vacation);
            res.status(StatusCode.Created).json(dbVacation);
        }
        catch (err: any) {
            next(err);
        }
    };

    private updateVacation = async (request: Request, response: Response, next: NextFunction) => {
        try {
            request.body.image = request.files?.image;
            request.body.vacationId = Number(request.params.id);
            const vacation = new VacationModel(request.body);
            const dbVacation = await adminService.updateVacation(vacation);
            response.json(dbVacation);
        }
        catch (err: any) {
            next(err);
        }
    };

    private deleteVacation = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const vacationId = Number(request.params.id);
            await adminService.deleteVacation(vacationId);
            response.sendStatus(StatusCode.NoContent);
        }
        catch (err: any) {
            next(err);
        }
    };

    private getVacationReport = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const report = await adminService.getVacationReport();
            response.status(StatusCode.OK).json(report);
        }
        catch (err: any) {
            next(err);
        }
    };

    private getReportCsv = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const csvData = await adminService.getVacationsReportCsv();
            response.setHeader("Content-Type", "text/csv");
            response.setHeader("Content-Disposition", "attachment; filename=vacations-report.csv");
            response.status(StatusCode.OK).send(csvData);
        }
        catch (err: any) {
            next(err);
        }
    }
}

export const adminController = new AdminController();
