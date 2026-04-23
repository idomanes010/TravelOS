import cors from "cors";
import express, { Request } from "express";
import expressRateLimit from "express-rate-limit";
import { appConfig } from "./2-utils/app-config";
import { vacationController } from "./5-controllers/vacation-controller";
import { errorsMiddleware } from "./6-middleware/errors-middleware";
import { userController } from "./5-controllers/user-controller";
import { likeController } from "./5-controllers/like-controller";
import path from "path";
import helmet from "helmet";
import { fileSaver } from "uploaded-file-saver";
import { adminController } from "./5-controllers/admin-controller";
import { gptController } from "./5-controllers/gpt-controller";
import { vacationMcpServer } from "./4-services/mcp/mcp-server";
import { statelessHandler } from "express-mcp-handler";
import fileUpload from "express-fileupload";

class App {

    public start(): void {
        try {
            const server = express();
            server.use(expressRateLimit({
                windowMs: 1000,
                limit: 20,
                skip: (request: Request) => request.path.startsWith("/api/vacations/images/")
            }));
            server.use(cors());
            server.use(helmet({
                crossOriginResourcePolicy: false
            }));
            server.use(express.json());
            server.use(express.urlencoded({ extended: true }));
            server.use(fileUpload());

            const imageLocation = path.join(__dirname, "1-assets", "images");
            fileSaver.config(imageLocation);

            const mcpHandler = statelessHandler(() => vacationMcpServer.createMcpServer() as any, {
                onError: (error: Error) => {
                    console.error("[MCP][stateless]", error.message);
                }
            } as any);
            server.post("/sse", mcpHandler);
            server.post("/mcp", mcpHandler);

            server.use(vacationController.router);
            server.use(userController.router);
            server.use(likeController.router);
            server.use(adminController.router);
            server.use(gptController.router);

            server.use(errorsMiddleware.routeNotFound);
            server.use(errorsMiddleware.catchAll);

            server.listen(appConfig.port, () =>
                console.log("Listening on http://localhost:" + appConfig.port)
            );

        } catch (err: any) {
            console.error(err);
        }
    }
}

const app = new App();
app.start();




































// class App {

//     public start(): void {
//         try {
//             const server = express();
//             server.use(cors());
//             server.use(express.json());

//             const imageLocation = path.join(__dirname, "1-assets", "images");
//             fileSaver.config(imageLocation); // tell the library were to save images

//             const mcpServer = vacationMcpServer.createMcpServer();
//             const factory = () => mcpServer as any;
//             const { getHandler, postHandler } = sseHandlers(factory, {});
//             server.get("/sse", getHandler);
//             server.post("/messages", postHandler);

//             server.use(vacationController.router);
//             server.use(userController.router);
//             server.use(likeController.router);
//             server.use(adminController.router);
//             server.use(gptController.router);

//             server.use(errorsMiddleware.routeNotFound);
//             server.use(errorsMiddleware.catchAll);
//             server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
//         }
//         catch (err: any) {
//             console.error(err);
//         }
//     }
// }

// const app = new App();
// app.start();