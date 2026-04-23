import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { mcpTools } from "./mcp-tools";

class McpRegister {

    public registerGetAverageVacationPriceTool(mcpServer: McpServer): void {
        const config = {
            description: "Get the average price of all vacations in the database."
        };
        mcpServer.registerTool(
            "getAverageVacationPrice",
            config,
            () => mcpTools.getAverageVacationPriceTool()
        );
    }

    public registerGetActiveVacationsCountTool(mcpServer: McpServer): void {
        const config = {
            description: "Get the number of currently active vacations (based on current date)."
        };
        mcpServer.registerTool(
            "getActiveVacationsCount",
            config,
            () => mcpTools.getActiveVacationsCountTool()
        );
    }

    public registerGetTopLikedVacationsTool(mcpServer: McpServer): void {
        const config = {
            description: "Get the most liked (most popular) vacations."
        };
        mcpServer.registerTool(
            "getTopLikedVacations",
            config,
            () => mcpTools.getTopLikedVacationsTool()
        );
    }

    public registerGetUpcomingVacationsTool(mcpServer: McpServer): void {
        const config = {
            description: "Get upcoming vacations sorted by start date."
        };
        mcpServer.registerTool(
            "getUpcomingVacations",
            config,
            () => mcpTools.getUpcomingVacationsTool()
        );
    }

    public registerGetVacationsByBudgetTool(mcpServer: McpServer): void {
        const config = {
            description: "Get vacations filtered by maximum price.",
            inputSchema: z.object({
                maxPrice: z.number()
            })
        };
        mcpServer.registerTool(
            "getVacationsByBudget",
            config,
            (input) => mcpTools.getVacationsByBudgetTool(input)
        );
    }

    public registerGetVacationsByDateRangeTool(mcpServer: McpServer): void {
        const config = {
            description: "Get vacations within a specific date range.",
            inputSchema: z.object({
                startDate: z.string(),
                endDate: z.string()
            })
        };
        mcpServer.registerTool(
            "getVacationsByDateRange",
            config,
            (input) => mcpTools.getVacationsByDateRangeTool(input)
        );
    }

}

export const mcpRegister = new McpRegister();
