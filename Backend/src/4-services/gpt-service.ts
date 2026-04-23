import OpenAI from "openai";
import { appConfig } from "../2-utils/app-config";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources";

class GptService {
    private openai = new OpenAI({
        apiKey: appConfig.chatGptKey
    });

    // get gpt completion:
    public async getCompletion(prompt: string): Promise<string> {
        const body: ChatCompletionCreateParamsNonStreaming = {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful and friendly travel assistant. Your job is to Read the user's message and Detect if they provided a vacation destination. If a destination is provided Write a short, fun, and engaging summary about the destination.
                            If no clear destination is provided, Politely and playfully ask the user to provide a destination.`
                },
                { role: "user", content: prompt }
            ]
        };
        const response = await this.openai.chat.completions.create(body);

        // Return completion: 
        const completion = response.choices[0].message.content!;
        return completion;
    }
    public async getMcpResult(input: string): Promise<string> {

        const body: OpenAI.Responses.ResponseCreateParams = {
            model: "gpt-4o-mini",
            tools: [{
                type: "mcp",
                server_label: "VacationMCP",
                server_description: "Vacation project mcp server exposing vacation data.",
                server_url: appConfig.mcpServerUrl,
                require_approval: "never"
            }],
            input
        };
        console.log("MCP URL:", appConfig.mcpServerUrl);

        const response = await this.openai.responses.create(body);
        return response.output_text || "No response from AI";
    }
}

export const gptService = new GptService();