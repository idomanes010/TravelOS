import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { mcpHelper } from "../../2-utils/mcp-helper";
import { mcpService } from "./mcp-service";

class McpTools {

    public async getAverageVacationPriceTool(): Promise<CallToolResult> {
        console.log("starting getAverageVacationPriceTool");
        const result = await mcpService.getAverageVacationPrice();
        return mcpHelper.getToolResult({
            message: `Average vacation price is ${result.averagePrice} USD`,
            data: result
        });
    }

    public async getActiveVacationsCountTool(): Promise<CallToolResult> {
        console.log("starting getActiveVacationsCountTool");
        const result = await mcpService.getActiveVacationsCount();
        return mcpHelper.getToolResult({
            message: `There are currently ${result.activeCount} active vacations 🏖️`,
            data: result
        });
    }

    public async getTopLikedVacationsTool(): Promise<CallToolResult> {
        console.log("starting getTopLikedVacationsTool");
        const result = await mcpService.getTopLikedVacations();
        return mcpHelper.getToolResult({
            message: `Here are the most popular vacations right now`,
            data: result
        });
    }

    public async getUpcomingVacationsTool(): Promise<CallToolResult> {
        console.log("starting getUpcomingVacationsTool");
        const result = await mcpService.getUpcomingVacations();
        return mcpHelper.getToolResult({
            message: `Here are the next upcoming vacations ✈️`,
            data: result
        });
    }

    public async getVacationsByBudgetTool(input: { maxPrice: number }): Promise<CallToolResult> {
        console.log("starting getVacationsByBudgetTool");
        const result = await mcpService.getVacationsByBudget(input.maxPrice);
        return mcpHelper.getToolResult({
            message: `Here are vacations within your budget`,
            data: result
        });
    }

    public async getVacationsByDateRangeTool(input: { startDate: string; endDate: string }): Promise<CallToolResult> {
        console.log("starting getVacationsByDateRangeTool");
        const result = await mcpService.getVacationsByDateRange(
            input.startDate,
            input.endDate
        );
        return mcpHelper.getToolResult({
            message: `Here are vacations matching your dates`,
            data: result
        });
    }
}

export const mcpTools = new McpTools();
