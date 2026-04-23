import express, { NextFunction, Request, Response, Router } from "express";
import { gptService } from "../4-services/gpt-service";
import { securityMiddleware } from "../6-middleware/security-middleware";
import { StatusCode } from "../3-models/enums ";

class GptController {
    public readonly router: Router = express.Router();

    public constructor() {
        this.router.post("/api/ai", securityMiddleware.verifyToken, securityMiddleware.preventXss, this.askAI);
        this.router.post("/api/ai/mcp", securityMiddleware.verifyToken, securityMiddleware.preventXss, this.askMcp);
    }

    private askAI = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const prompt = request.body.prompt;
            if (!prompt || typeof prompt !== "string") {
                response.status(StatusCode.BadRequest).json({ message: "Prompt is required." });
                return;
            }

            const answer = await gptService.getCompletion(prompt);
            response.status(StatusCode.OK).send(answer);
        }
        catch (err: any) {
            next(err);
        }
    };

    private askMcp = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const question =
                typeof request.body.question === "string"
                    ? request.body.question
                    : typeof request.body.prompt === "string"
                        ? request.body.prompt
                        : "What is the average vacation price?";

            const answer = await gptService.getMcpResult(question);
            response.status(StatusCode.OK).send(answer);
        }
        catch (err: any) {
            next(err);
        }
    };
}

export const gptController = new GptController();
