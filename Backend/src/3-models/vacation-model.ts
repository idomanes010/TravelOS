import Joi from "joi";
import { UploadedFile } from "express-fileupload";
import { ValidationError } from "./client-errors";

export class VacationModel {
    public vacationId?: number;
    public destination?: string;
    public description?: string;
    public startDate?: string;
    public endDate?: string;
    public price?: number;
    public imageName?: string;
    public image?: UploadedFile;
    public imageUrl?: string;

    public constructor(vacation?: VacationModel) {

        if (!vacation) return;

        this.vacationId = vacation.vacationId;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.imageName = vacation.imageName;
        this.image = vacation.image;
        this.imageUrl = vacation.imageUrl;
    }

    private static schema = Joi.object({
        vacationId: Joi.number().optional().positive().integer(),
        destination: Joi.string().required().min(2).max(50),
        description: Joi.string().required().min(2).max(500),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        price: Joi.number().required().positive(),
        imageName: Joi.string().optional().min(2).max(255),
        image: Joi.object().optional(),
        imageUrl: Joi.string().optional().uri(),
    });

    public validate(): void {
        const result = VacationModel.schema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}