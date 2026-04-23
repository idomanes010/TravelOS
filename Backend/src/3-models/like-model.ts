import Joi from "joi";

export class LikeModel {

    public userId: number;
    public vacationId: number;

    public constructor(like: LikeModel) {
        this.userId = like.userId!;
        this.vacationId = like.vacationId!;
    }

    private static schema = Joi.object({
        userId: Joi.number().required().positive().integer(),
        vacationId: Joi.number().required().positive().integer(),
    });

    public validate(): void {
        const result = LikeModel.schema.validate(this);
        if (result.error) throw new Error(result.error.message);
    }

}