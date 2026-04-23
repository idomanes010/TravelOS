import dotenv from "dotenv";

dotenv.config({ quiet: true });

class AppConfig {
    public readonly environment = process.env.ENVIRONMENT;
    public readonly isDevelopment = process.env.ENVIRONMENT === "development";
    public readonly isProduction = process.env.ENVIRONMENT === "production";
    public readonly port = Number(process.env.PORT);
    public readonly mysqlHost = process.env.MYSQL_HOST;
    public readonly mysqlUser = process.env.MYSQL_USER;
    public readonly mysqlPassword = process.env.MYSQL_PASSWORD;
    public readonly mysqlDatabase = process.env.MYSQL_DATABASE;
    public readonly jwtSecret = process.env.JWT_SECRET!;
    public readonly hashSalt = process.env.HASH_SALT!;
    public readonly imagesLocation = process.env.IMAGES_LOCATION!;
    public readonly chatGptKey = process.env.CHAT_GPT_API_KEY!;
    public readonly mcpServerUrl = process.env.MCP_SERVER_URL!;
}

export const appConfig = new AppConfig();
