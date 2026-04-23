import axios from "axios";
import { appConfig } from "../Utils/AppConfig";

class GptService {

    public async getGptAnswer(prompt: string): Promise<string> {
        const response = await axios.post<string>(appConfig.gptUrl, {
            prompt
        });
        return response.data;
    }

    public async getMcpAnswer(prompt: string): Promise<string> {
        const response = await axios.post<string>(appConfig.mcpUrl, {
            prompt
        });
        return response.data;
    }

}

export const gptService = new GptService();
