import axios from "axios";
import { appConfig } from "../Utils/AppConfig";


class LikeService {

    public async addLike(vacationId: number): Promise<void> {
        await axios.post(appConfig.likesUrl, { vacationId });
    }

    public async removeLike(vacationId: number): Promise<void> {
        await axios.delete(`${appConfig.likesUrl}/${vacationId}`);
    }
}

export const likeService = new LikeService();